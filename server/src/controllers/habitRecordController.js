import * as RecordRepo from '../repository/habitRecordRepository.js';
import { Prisma } from '@prisma/client';
import { startOfWeek, endOfWeek } from 'date-fns';

// 오늘의 습관 기록 생성
export const createHabitRecord = async (req, res) => {
  try {
    const { habitId } = req.body;

    if (!habitId) {
      return res
        .status(400)
        .json({ success: false, message: 'habitId가 필요합니다.' });
    }

    const newRecord = await RecordRepo.createHabitRecord({
      habitId,
      day: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: '습관 기록이 추가되었습니다.',
      data: newRecord,
    });
  } catch (error) {
    console.error(' createHabitRecord Error:', error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 habitId입니다.',
      });
    }
    return res.status(500).json({
      success: false,
      message: '습관 기록 추가 실패',
      error: error.message,
    });
  }
};

// 특정 습관의 이번 주 기록 조회
export const getWeeklyRecords = async (req, res) => {
  try {
    const { habitId } = req.params;

    if (!habitId) {
      return res.status(400).json({
        success: false,
        message: 'habitId가 필요합니다.',
      });
    }

    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // 월요일 시작
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });

    const weeklyRecords = await RecordRepo.getWeeklyRecordsByHabitId(
      habitId,
      start,
      end,
    );

    return res.status(200).json({
      success: true,
      data: weeklyRecords,
    });
  } catch (error) {
    console.error('getWeeklyRecords Error:', error);
    return res.status(500).json({
      success: false,
      message: '주간 기록 조회 실패',
      error: error.message,
    });
  }
};

// 기록 삭제
export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await RecordRepo.deleteRecord(id);
    return res
      .status(200)
      .json({ success: true, message: '기록이 삭제되었습니다.' });
  } catch (error) {
    console.error(' deleteRecord Error:', error);
    return res.status(500).json({ success: false, message: '기록 삭제 실패' });
  }
};
