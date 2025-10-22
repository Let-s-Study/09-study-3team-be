import express from 'express';

import {
  createEmoji,
  getEmojisByStudyId,
  incrementEmoji,
  deleteEmoji,
} from '../controllers/emojiController.js';

const router = express.Router();

router.post('/', createEmoji);
router.get('/:studyId', getEmojisByStudyId);
router.patch('/:id/increment', incrementEmoji);
router.delete('/:id', deleteEmoji);

export default router;
