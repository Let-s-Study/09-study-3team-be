import * as HabitRepo from '../repository/habitRepository.js';
import { Prisma } from '@prisma/client';

//습관 생성
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
      error.code === 'P2003'
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

//특정 스터디의 습관 조회
export const getHabitsByStudyId = async (req, res) => {
  try {
    const { studyId } = req.params;

    if (!studyId) {
      return res.status(400).json({
        success: false,
        message: 'studyId가 필요하다!',
      });
    }

    const habits = await HabitRepo.getHabitsByStudyId(studyId);

    return res.status(200).json({
      success: true,
      data: habits,
    });
  } catch (error) {
    console.error('getHabitsByStudyId Error:', error);
    return res.status(500).json({
      success: false,
      message: '습관 조회 실패',
      error: error.message,
    });
  }
};

// 습관 수정
export const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: '수정할 타이틀이 필요합니다.!',
      });
    }

    const updatedHabit = await HabitRepo.updateHabit(id, {
      title: title.trim(),
    });

    return res.status(200).json({
      success: true,
      message: '습관 수정 완료!',
      data: updatedHabit,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않은 습관!',
      });
    }
    console.error('updateHabit Error', error);
    return res.status(500).json({
      success: false,
      message: '습관 수정 실패',
      error: error.message,
    });
  }
};

//  습관 삭제
export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    await HabitRepo.deleteHabit(id);

    return res.status(200).json({
      success: true,
      message: '습관 삭제 완료',
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: '존재하지 않는 습관입니다.',
        });
      }
      if (error.code === 'P2003') {
        return res.status(409).json({
          success: false,
          message: '먼저 해당 습관의 기록을 삭제해야합니다.',
        });
      }
    }

    console.error('deleteHabit Error', error);
    return res.status(500).json({
      success: false,
      message: '습관 삭제 실패',
      error: error.message,
    });
  }
};
