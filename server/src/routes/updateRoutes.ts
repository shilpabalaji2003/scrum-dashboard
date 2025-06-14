import express from 'express';
import {
  createUpdate,
  getUpdates,
  getUpdateById,
  updateUpdate,
  deleteUpdate,
} from '../controllers/updateController';

const router = express.Router();

router.post('/', createUpdate);
router.get('/', getUpdates);
router.get('/:id', getUpdateById);
router.put('/:id', updateUpdate);
router.delete('/:id', deleteUpdate);

export default router; 