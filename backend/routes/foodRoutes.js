import express from 'express';
import { createFood, deleteFood, getFoods, updateFood } from '../controllers/foodController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getFoods);
router.post('/', protect, adminOnly, createFood);
router.put('/:id', protect, adminOnly, updateFood);
router.delete('/:id', protect, adminOnly, deleteFood);

export default router;
