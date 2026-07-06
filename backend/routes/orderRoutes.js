import express from 'express';
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id', protect, updateOrder);
router.delete('/:id', protect, deleteOrder);

export default router;
