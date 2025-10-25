import * as EmojiRepo from '../repository/emojiRepository.js';
import pkg from '@prisma/client';
const { Prisma } = pkg;

export const createEmoji = async (req, res, next) => {
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
      error.code === 'P2003' // studyId가 유효하지 않음
    ) {
      return res
        .status(400)
        .json({ success: false, message: '유효하지 않은 studyId 입니다.' });
    }
    next(error);
  }
};

export const getEmojisByStudyId = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    if (!studyId)
      return res
        .status(400)
        .json({ success: false, message: 'studyId가 필요합니다.' });
    const list = await EmojiRepo.getEmojisByStudyId(studyId);
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

export const incrementEmoji = async (req, res, next) => {
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
    next(error);
  }
};

// 삭제는 로그인
export const deleteEmoji = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: loggedInStudyId } = req.study;

    const emoji = await EmojiRepo.findEmojiById(id);
    if (!emoji) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 이모지입니다.',
      });
    }
    if (emoji.studyId !== loggedInStudyId) {
      return res.status(403).json({
        success: false,
        message: '자신의 스터디 이모지만 삭제할 수 있습니다.',
      });
    }

    await EmojiRepo.deleteEmoji(id);
    return res
      .status(200)
      .json({ success: true, message: '이모지 삭제 완료!!' });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res
        .status(404)
        .json({ success: false, message: '존재하지 않는 이모지입니다!!' });
    }
    next(error);
  }
};
