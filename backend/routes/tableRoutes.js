import express from 'express';
import { createTable, deleteTable, getTables, updateTable } from '../controllers/tableController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getTables);
router.post('/', protect, adminOnly, createTable);
router.put('/:id', protect, adminOnly, updateTable);
router.delete('/:id', protect, adminOnly, deleteTable);

export default router;
