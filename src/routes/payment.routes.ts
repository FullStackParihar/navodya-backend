import express from 'express';
import { 
    createCashfreeOrder, 
    verifyPayment, 
    handleWebhook,
    uploadDesignFiles,
    attachDesignToOrder
} from '../controllers/payment.controller.js';
import { authenticate, optionalAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Webhook is called by Cashfree servers directly, no user authentication needed
router.post('/cashfree/webhook', handleWebhook);

// Protected routes require authentication
router.post('/create-order', authenticate, createCashfreeOrder);
router.post('/verify', authenticate, verifyPayment);

// Design image upload — customer uploads design files (images/PDF/AI/SVG) at checkout
// Uses optionalAuth so customers can upload designs before signing in or during guest checkout
router.post('/upload-design', optionalAuth, uploadDesignFiles);

// Attach/update design images on an already-created (PENDING) order
// Useful if customer uploads design after payment session is created
router.patch('/orders/:orderId/design', authenticate, attachDesignToOrder);

export default router;
