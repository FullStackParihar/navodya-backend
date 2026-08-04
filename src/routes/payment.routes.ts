import express from 'express';
import { 
    createCashfreeOrder, 
    verifyPayment, 
    handleWebhook 
} from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Webhook is called by Cashfree servers directly, no user authentication needed
router.post('/cashfree/webhook', handleWebhook);

// Protected routes require authentication
router.post('/create-order', authenticate, createCashfreeOrder);
router.post('/verify', authenticate, verifyPayment);

export default router;
