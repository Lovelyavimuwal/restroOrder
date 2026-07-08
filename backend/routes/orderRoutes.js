import express from 'express';
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', createOrder);
router.get('/', protect, adminOnly, getOrders);
router.get('/:id', protect, adminOnly, getOrderById);
router.patch('/:id', protect, adminOnly, updateOrder);
router.delete('/:id', protect, adminOnly, deleteOrder);

export default router;
