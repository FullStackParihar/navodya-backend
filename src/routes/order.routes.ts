import express from 'express';
import { createPaymentIntent, createOrder, getOrders, getOrderById } from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/create-payment-intent', createPaymentIntent);
router.post('/create', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

export default router;
