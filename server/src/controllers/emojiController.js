import * as EmojiRepo from '../repository/emojiRepository.js';
import { Prisma } from '@prisma/client';

export const createEmoji = async (req, res) => {
  try {
    const { emoji, studyId } = req.body;
    if (!emoji || !studyId) {
      return res
        .status(400)
        .json({ success: false, message: 'emoji, studyId는 필수입니다.' });
    }
    const created = await EmojiRepo.createEmoji({ emoji, studyId });
    return res
      .status(201)
      .json({ success: true, message: '이모지 생성 완료!', data: created });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res
        .status(400)
        .json({ success: false, message: '유효하지 하지 않은 studyId !!' });
    }
    console.error('createEmoji Error ', error);
    return res.status(500).json({
      success: false,
      message: '이모지 생성 실패 ',
      error: error.message,
    });
  }
};

export const getEmojisByStudyId = async (req, res) => {
  try {
    const { studyId } = req.params;
    if (!studyId)
      return res
        .status(400)
        .json({ success: false, message: 'studyId가 필요합니다.' });
    const list = await EmojiRepo.getEmojisByStudyId(studyId);
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error('getEmojisByStudyId Error', error);
    return res.status(500).json({
      success: false,
      message: '이모지 조회실패',
      error: error.message,
    });
  }
};

export const incrementEmoji = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await EmojiRepo.incrementEmoji(id);
    return res
      .status(200)
      .json({ success: true, message: '이모지 +1', data: updated });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res
        .status(404)
        .json({ success: false, message: '존재하지 않는 이모지입니다.' });
    }
    console.error(' incrementEmoji Error:', error);
    return res.status(500).json({
      success: false,
      message: '이모지 증가 실패',
      error: error.message,
    });
  }
};

export const deleteEmoji = async (req, res) => {
  try {
    const { id } = req.params;
    await EmojiRepo.deleteEmoji(id);
    return res
      .status(200)
      .json({ success: true, message: '이모지 삭제 완료!!' });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError &&
      error.code === 'P2025'
    ) {
      return res
        .status(400)
        .json({ success: false, message: '존재하지 않는 이모지입니다!!' });
    }
    console.error('deleteEmoji Error', error);
    return res.status(500).json({
      success: false,
      message: '이모지 삭제 실패',
      error: error.message,
    });
  }
};
