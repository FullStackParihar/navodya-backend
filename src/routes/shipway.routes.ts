import { Router } from 'express';
import { 
    handleShipwayWebhook, 
    checkPincodeServiceable, 
    getCarrierRates, 
    getOrderTracking 
} from '../controllers/shipway.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Webhook endpoint (public callback for Shipway API status updates)
router.post('/webhook', handleShipwayWebhook);

// Authenticated customer/admin shipping endpoints
router.get('/pincode/:pincode', authenticate, checkPincodeServiceable);
router.get('/rates', authenticate, getCarrierRates);
router.get('/tracking/:orderId', authenticate, getOrderTracking);

export default router;
