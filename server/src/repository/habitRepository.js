import { prisma } from '../db/prismaClient.js';

//습관 생성
export const createHabit = async (data) => {
  return await prisma.habit.create({ data });
};

//특정 스터디의 습관 전체 조회
export const getHabitsByStudyId = async (studyId) => {
  return await prisma.habit.findMany({
    where: { studyId },
    include: { habitRecords: true },
    orderBy: { createdAt: 'desc' },
  });
};

// 습관 수정
export const updateHabit = async (id, data) => {
  return await prisma.habit.update({
    where: { id },
    data,
  });
};

//습관 삭제
export const deleteHabit = async (id) => {
  return await prisma.habit.delete({
    where: { id },
  });
};
