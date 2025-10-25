import * as RecordRepo from '../repository/habitRecordRepository.js';
import * as HabitRepo from '../repository/habitRepository.js';
import { startOfWeek, endOfWeek } from 'date-fns';
import pkg from '@prisma/client';
const { Prisma } = pkg;

// 기록 생성
export const createHabitRecord = async (req, res, next) => {
  try {
    const { habitId } = req.body;
    const { id: authorizedId } = req.study;

    if (!habitId) {
      return res
        .status(400)
        .json({ success: false, message: 'habitId가 필요합니다.' });
    }

    const habit = await HabitRepo.findHabitById(habitId);
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 습관입니다.',
      });
    }
    if (habit.studyId !== authorizedId) {
      return res.status(403).json({
        success: false,
        message: '자신의 습관에만 기록을 추가할 수 있습니다.',
      });
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        success: false,
        message: '오늘은 이미 기록되었습니다.',
      });
    }
    next(error);
  }
};

export const getWeeklyRecords = async (req, res, next) => {
  try {
    const { habitId } = req.params;
    const { id: authorizedId } = req.study;

    if (!habitId) {
      return res.status(400).json({
        success: false,
        message: 'habitId가 필요합니다.',
      });
    }

    const habit = await HabitRepo.findHabitById(habitId);
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 습관입니다.',
      });
    }
    if (habit.studyId !== authorizedId) {
      return res.status(403).json({
        success: false,
        message: '자신의 습관 기록만 조회할 수 있습니다.',
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
    next(error);
  }
};

// 기록 삭제
export const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: authorizedId } = req.study;
    const record = await RecordRepo.findHabitRecordById(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 기록입니다.',
      });
    }
    const habit = await HabitRepo.findHabitById(record.habitId);
    if (habit.studyId !== authorizedId) {
      return res.status(403).json({
        success: false,
        message: '자신의 기록만 삭제할 수 있습니다.',
      });
    }

    await RecordRepo.deleteRecord(id);
    return res
      .status(200)
      .json({ success: true, message: '기록이 삭제되었습니다.' });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 기록입니다.',
      });
    }
    next(error);
  }
};
