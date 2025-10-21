import * as HabitRepo from '../repository/habitRepository.js';
import { Prisma } from '@prisma/client';

export const createHabit = async (req, res) => {
  try {
    const { title, studyId } = req.body;

    if (!title || !studyId) {
      return res.status(400).json({
        success: false,
        message: 'title, studyId 누락되었습니다!',
      });
    }

    const newHabit = await HabitRepo.createHabit({
      title: title.trim(),
      studyId,
    });

    return res.status(201).json({
      success: true,
      message: '습관 생성 완료!',
      data: newHabit,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003 '
    ) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 studyId 입니다.',
      });
    }

    console.error('createHabit Error', error);
    return res.status(500).json({
      success: false,
      message: '습관 생성 실패',
      error: error.message,
    });
  }
};
