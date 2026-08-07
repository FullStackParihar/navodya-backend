import { config } from '../config/env.js';
import { Order } from '../models/order.model.js';

const formatDate = (date: Date): string => {
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

/**
 * Pushes order details to Shipway to initiate shipment creation and billing sync.
 */
export const pushOrderToShipway = async (orderId: string) => {
    try {
        const order = await Order.findById(orderId).populate('user_id', 'name email phone');
        if (!order) {
            console.error(`[Shipway] Order ${orderId} not found in database.`);
            return { success: false, error: 'Order not found' };
        }

        const isMockMode = 
            !config.shipway.email || 
            !config.shipway.licenseKey || 
            config.shipway.email === 'test@shipway.in' || 
            config.shipway.licenseKey === 'dummy_license_key';

        if (isMockMode) {
            console.log(`[Shipway Mock] Simulating order push for order ${orderId}`);
            return { success: true, message: 'Order has been added successfully (Mock Mode).' };
        }

        const user = order.user_id as any;
        const userName = user?.name || 'Customer';
        const nameParts = userName.trim().split(/\s+/);
        const firstname = nameParts[0] || 'Customer';
        const lastname = nameParts.slice(1).join(' ') || '';

        // Normalize phone number (exactly 10 digits)
        let phone = user?.phone || '9999999999';
        phone = phone.replace(/\D/g, '');
        if (phone.length === 12 && phone.startsWith('91')) {
            phone = phone.substring(2);
        }
        if (phone.length > 10) {
            phone = phone.slice(-10);
        }
        if (phone.length < 10) {
            phone = '9999999999';
        }

        const streetAddress = order.shipping_address.street || 'N/A';
        const addressParts = streetAddress.match(/.{1,30}/g) || ['N/A'];
        const billingAddress = order.billing_address?.street || streetAddress;
        const billingAddressParts = billingAddress.match(/.{1,30}/g) || ['N/A'];

        const products = order.items.map((item: any) => ({
            product: item.name,
            price: String(item.price),
            product_code: String(item.product_id),
            product_quantity: String(item.quantity),
            discount: "0",
            tax_rate: "0",
            tax_title: "GST"
        }));

        const payload = {
            order_id: order._id.toString(),
            products,
            discount: String(order.pricing.discount || 0),
            shipping: String(order.pricing.shipping_fee || 0),
            order_total: String(order.pricing.total),
            gift_card_amt: "0",
            taxes: String(order.pricing.tax || 0),
            payment_type: (order.payment_info?.method || '').toLowerCase() === 'cod' ? 'C' : 'P',
            email: user?.email || 'customer@example.com',
            billing_address: billingAddressParts[0] || 'N/A',
            billing_address2: billingAddressParts.slice(1).join(' ') || '',
            billing_city: order.billing_address?.city || order.shipping_address.city || 'N/A',
            billing_state: order.billing_address?.state || order.shipping_address.state || 'N/A',
            billing_country: order.billing_address?.country || order.shipping_address.country || 'India',
            billing_firstname: firstname,
            billing_lastname: lastname,
            billing_phone: phone,
            billing_zipcode: order.billing_address?.zip_code || order.shipping_address.zip_code || 'N/A',
            shipping_address: addressParts[0] || 'N/A',
            shipping_address2: addressParts.slice(1).join(' ') || '',
            shipping_city: order.shipping_address.city || 'N/A',
            shipping_state: order.shipping_address.state || 'N/A',
            shipping_country: order.shipping_address.country || 'India',
            shipping_firstname: firstname,
            shipping_lastname: lastname,
            shipping_phone: phone,
            shipping_zipcode: order.shipping_address.zip_code || 'N/A',
            order_date: formatDate(order.created_at || new Date())
        };

        const token = Buffer.from(`${config.shipway.email}:${config.shipway.licenseKey}`).toString('base64');

        console.log(`[Shipway] Pushing order ${order._id} payload:`, JSON.stringify(payload));

        const response = await fetch('https://app.shipway.com/api/v2orders', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Shipway API responded with HTTP ${response.status}: ${errorText}`);
        }

        const data: any = await response.json();
        console.log(`[Shipway] Order push response:`, data);
        return { success: true, response: data };
    } catch (error: any) {
        console.error(`[Shipway] Error pushing order ${orderId}:`, error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Cancels an order in the Shipway platform to ensure synchronization.
 */
export const cancelOrderInShipway = async (orderId: string) => {
    try {
        const isMockMode = 
            !config.shipway.email || 
            !config.shipway.licenseKey || 
            config.shipway.email === 'test@shipway.in' || 
            config.shipway.licenseKey === 'dummy_license_key';

        if (isMockMode) {
            console.log(`[Shipway Mock] Simulating order cancel for order ${orderId}`);
            return { success: true, message: 'Order has marked cancelled successfully (Mock Mode).' };
        }

        const payload = {
            order_ids: [orderId]
        };

        const token = Buffer.from(`${config.shipway.email}:${config.shipway.licenseKey}`).toString('base64');

        const response = await fetch('https://app.shipway.com/api/Cancelorders/', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Shipway API responded with HTTP ${response.status}: ${errorText}`);
        }

        const data: any = await response.json();
        console.log(`[Shipway] Order cancel response:`, data);
        return { success: true, response: data };
    } catch (error: any) {
        console.error(`[Shipway] Error cancelling order ${orderId} in Shipway:`, error.message);
        return { success: false, error: error.message };
    }
};
