import express from 'express';
import {
  createEmoji,
  getEmojisByStudyId,
  incrementEmoji,
  deleteEmoji,
} from '../controllers/emojiController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', createEmoji);
router.get('/:studyId', getEmojisByStudyId);
router.patch('/:id/increment', incrementEmoji);
router.delete('/:id', authMiddleware, deleteEmoji);

export default router;
