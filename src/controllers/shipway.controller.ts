import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Order } from '../models/order.model.js';
import { config } from '../config/env.js';

const isMockMode = (): boolean => {
    return !config.shipway.email || 
           !config.shipway.licenseKey || 
           config.shipway.email === 'test@shipway.in' || 
           config.shipway.licenseKey === 'dummy_license_key';
};

/**
 * POST /api/shipway/webhook
 * Processes tracking status and delivery scan callbacks sent by Shipway.
 */
export const handleShipwayWebhook = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    console.log('[Shipway Webhook] Received payload:', JSON.stringify(payload, null, 2));

    const { awbno, carrier, current_status, order_id, scans_current_status } = payload;

    if (!order_id && !awbno) {
        throw new ApiError(400, 'Order ID or AWB number is required');
    }

    let order = null;
    if (order_id && order_id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(order_id);
    }
    
    if (!order && awbno) {
        order = await Order.findOne({ 'tracking.tracking_number': String(awbno) });
    }

    if (!order) {
        console.warn(`[Shipway Webhook] Order matching order_id ${order_id} or awb ${awbno} not found.`);
        return res.status(200).json(new ApiResponse(200, null, 'Order not found, webhook ignored'));
    }

    // Map Shipway current_status code to our order status
    let newStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | null = null;
    const statusUpper = String(current_status || '').toUpperCase();

    if (['DEL'].includes(statusUpper)) {
        newStatus = 'DELIVERED';
    } else if (['INT', 'OOD', 'RPKP', 'SCH'].includes(statusUpper)) {
        newStatus = 'SHIPPED';
    } else if (['CAN', 'PCAN'].includes(statusUpper)) {
        newStatus = 'CANCELLED';
    } else if (['RTO', 'RTD', 'RDEL', 'RINT'].includes(statusUpper)) {
        newStatus = 'RETURNED';
    }

    // Update tracking info
    order.tracking = {
        carrier: carrier || order.tracking?.carrier,
        tracking_number: awbno || order.tracking?.tracking_number,
        url: payload.tracking_url || order.tracking?.url || `https://shipway.in/track/${awbno}`
    };

    const statusNote = scans_current_status || `Shipway status updated to: ${current_status}`;

    if (newStatus && order.status !== newStatus) {
        order.status_history.push({
            status: newStatus,
            changed_at: new Date(),
            note: statusNote,
            changed_by: 'Shipway Webhook'
        });
        order.status = newStatus;
    } else {
        order.status_history.push({
            status: order.status,
            changed_at: new Date(),
            note: `Scan Update: ${statusNote}`,
            changed_by: 'Shipway Webhook'
        });
    }

    await order.save();
    console.log(`[Shipway Webhook] Updated order ${order._id} status to ${order.status}`);

    res.status(200).json(new ApiResponse(200, order, 'Webhook processed successfully'));
});

/**
 * GET /api/shipway/pincode/:pincode
 * Checks if a destination zipcode is serviceable by configured couriers.
 */
export const checkPincodeServiceable = asyncHandler(async (req: Request, res: Response) => {
    const { pincode } = req.params;
    const { payment_type } = req.query; // 'P' or 'C'

    if (!pincode || isNaN(Number(pincode))) {
        throw new ApiError(400, 'A valid numeric pincode is required');
    }

    if (isMockMode()) {
        console.log(`[Shipway Mock] Checking serviceability for pincode ${pincode}`);
        return res.status(200).json(new ApiResponse(200, {
            success: 1,
            error: "",
            message: [
                {
                    carrier_id: "mock_xpressbees",
                    name: "Xpressbees",
                    carrier_title: "Mock Xpressbees Service (Serviceable)",
                    payment_type: payment_type || 'P'
                },
                {
                    carrier_id: "mock_delhivery",
                    name: "Delhivery",
                    carrier_title: "Mock Delhivery Service (Serviceable)",
                    payment_type: payment_type || 'P'
                }
            ]
        }, 'Pincode serviceable check (Mock Mode)'));
    }

    try {
        const token = Buffer.from(`${config.shipway.email}:${config.shipway.licenseKey}`).toString('base64');
        const url = `https://app.shipway.com/api/pincodeserviceable?pincode=${pincode}&payment_type=${payment_type || 'P'}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Shipway API responded with HTTP ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(new ApiResponse(200, data, 'Pincode checked successfully'));
    } catch (err: any) {
        console.error(`[Shipway] Pincode check error:`, err.message);
        throw new ApiError(500, `Shipway pincode service failed: ${err.message}`);
    }
});

/**
 * GET /api/shipway/rates
 * Returns shipping delivery charges estimated across courier partners.
 */
export const getCarrierRates = asyncHandler(async (req: Request, res: Response) => {
    const { fromPincode, toPincode, paymentType, weight } = req.query;

    if (!fromPincode || !toPincode || !paymentType) {
        throw new ApiError(400, 'fromPincode, toPincode, and paymentType are required parameters');
    }

    if (isMockMode()) {
        console.log(`[Shipway Mock] Fetching courier rates`);
        return res.status(200).json(new ApiResponse(200, {
            success: "success",
            rate_card: [
                {
                    carrier_id: 7377,
                    courier_name: "Shipway Bluedart Express (0.5kg)",
                    delivery_charge: paymentType === 'cod' ? 99 : 50,
                    rto_charge: 50,
                    charged_weight: Number(weight || 0.5),
                    zone: 1
                }
            ]
        }, 'Courier rates fetched successfully (Mock Mode)'));
    }

    try {
        const token = Buffer.from(`${config.shipway.email}:${config.shipway.licenseKey}`).toString('base64');
        const queryParams = new URLSearchParams({
            fromPincode: String(fromPincode),
            toPincode: String(toPincode),
            paymentType: String(paymentType),
            weight: String(weight || 0.5)
        });

        const response = await fetch(`https://app.shipway.com/api/getshipwaycarrierrates?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Shipway API responded with HTTP ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(new ApiResponse(200, data, 'Rates retrieved successfully'));
    } catch (err: any) {
        console.error(`[Shipway] Rates check error:`, err.message);
        throw new ApiError(500, `Shipway rates estimation failed: ${err.message}`);
    }
});

/**
 * GET /api/shipway/tracking/:orderId
 * Fetches tracking logs directly from Shipway API.
 */
export const getOrderTracking = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    const awb = order.tracking?.tracking_number;
    if (!awb) {
        // Return a friendly fallback instead of throwing 400 for new orders
        const fallbackTracking = {
            awb: null,
            tracking_details: {
                shipment_status: 'NEW',
                shipment_details: [
                    {
                        courier_id: null,
                        courier_name: 'Not Assigned Yet',
                        order_id: order._id.toString(),
                        pickup_date: null,
                        delivered_date: null,
                        weight: '0.05',
                        packages: order.items.reduce((sum, item) => sum + item.quantity, 0),
                        current_status: 'New (Order created, waiting for pickup/fulfillment)',
                        destination: order.shipping_address.city,
                        consignee_name: `${order.shipping_address.firstname} ${order.shipping_address.lastname}`
                    }
                ],
                scans: [],
                track_url: null
            }
        };

        // If order status is PENDING or PROCESSING, and it is pushed to Shipway, let's keep it as is
        return res.status(200).json(new ApiResponse(200, {
            tracking: fallbackTracking,
            order: order
        }, 'Order has not been shipped yet'));
    }

    if (isMockMode()) {
        console.log(`[Shipway Mock] Fetching tracking for awb ${awb}`);
        const mockTracking = [
            {
                awb: Number(awb) || 1234567890,
                tracking_details: {
                    shipment_status: order.status === 'DELIVERED' ? 'DEL' : 'INT',
                    shipment_details: [
                        {
                            courier_id: "mock_carrier_id",
                            courier_name: order.tracking?.carrier || "Mock Shipping Courier",
                            order_id: order._id.toString(),
                            pickup_date: order.created_at,
                            delivered_date: order.status === 'DELIVERED' ? new Date() : null,
                            weight: "0.5",
                            packages: order.items.reduce((sum, item) => sum + item.quantity, 0),
                            current_status: order.status,
                            destination: order.shipping_address.city,
                            consignee_name: "Customer"
                        }
                    ],
                    track_url: order.tracking?.url || `https://shipway.in/track/${awb}`
                }
            }
        ];
        return res.status(200).json(new ApiResponse(200, {
            tracking: mockTracking,
            order: order
        }, 'Tracking history fetched successfully (Mock Mode)'));
    }

    try {
        const token = Buffer.from(`${config.shipway.email}:${config.shipway.licenseKey}`).toString('base64');
        const response = await fetch(`https://app.shipway.com/api/tracking?awb_numbers=${awb}&tracking_history=1`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Shipway API responded with HTTP ${response.status}`);
        }

        const data = await response.json();

        // Auto-sync status from Shipway to database order
        const trackingData = Array.isArray(data) ? data[0] : data;
        const currentStatus = trackingData?.tracking_details?.shipment_status;
        if (currentStatus) {
            let newStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | null = null;
            const statusUpper = String(currentStatus).toUpperCase();

            if (['DEL'].includes(statusUpper)) {
                newStatus = 'DELIVERED';
            } else if (['INT', 'OOD', 'RPKP', 'SCH'].includes(statusUpper)) {
                newStatus = 'SHIPPED';
            } else if (['CAN', 'PCAN'].includes(statusUpper)) {
                newStatus = 'CANCELLED';
            } else if (['RTO', 'RTD', 'RDEL', 'RINT'].includes(statusUpper)) {
                newStatus = 'RETURNED';
            }

            if (newStatus && order.status !== newStatus) {
                order.status = newStatus;
                order.status_history.push({
                    status: newStatus,
                    changed_at: new Date(),
                    note: `Synced live from Shipway: ${trackingData.tracking_details?.shipment_details?.[0]?.current_status || currentStatus}`,
                    changed_by: 'Shipway Sync API'
                });
                await order.save();
                console.log(`[Shipway Sync API] Updated order ${order._id} status to ${order.status}`);
            }
        }

        res.status(200).json(new ApiResponse(200, {
            tracking: data,
            order: order
        }, 'Tracking logs retrieved successfully'));
    } catch (err: any) {
        console.error(`[Shipway] Tracking retrieval error:`, err.message);
        throw new ApiError(500, `Shipway tracking retrieval failed: ${err.message}`);
    }
});
