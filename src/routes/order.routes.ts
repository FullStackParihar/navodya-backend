import express from 'express';
import { createPaymentIntent, createOrder, getOrders, getOrderById } from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createOrderSchema, createPaymentIntentSchema, orderIdParamSchema } from '../validations/order.validation.js';

const router = express.Router();

router.use(authenticate);

router.post('/create-payment-intent', validate(createPaymentIntentSchema), createPaymentIntent);
router.post('/create', validate(createOrderSchema), createOrder);
router.get('/', getOrders);
router.get('/:id', validate(orderIdParamSchema), getOrderById);

export default router;
