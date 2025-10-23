import prisma from '../db/prismaClient.js';

export const createHabitRecord = async (data) => {
  return await prisma.habitRecord.create({
    data,
  });
};

export const getWeeklyRecordsByHabitId = async (
  habitId,
  startDate,
  endDate,
) => {
  return await prisma.habitRecord.findMany({
    where: {
      habitId,
      day: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { day: 'asc' },
  });
};

export const deleteRecord = async (id) => {
  return await prisma.habitRecord.delete({
    where: { id },
  });
};
export const findHabitRecordById = async (id) => {
  return prisma.habitRecord.findUnique({
    where: { id },
  });
};
