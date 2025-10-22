import prisma from '../db/prismaClient.js';

export const createStudy = async (data) => {
  return await prisma.study.create({ data });
};

export const getAllStudies = async () => {
  return await prisma.study.findMany({
    include: { emojis: true, habits: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteStudy = async (id) => {
  return await prisma.study.delete({ where: { id } });
};

export const addPoints = async (id, amount) => {
  return await prisma.study.update({
    where: { id },
    data: { totalPoint: { increment: amount } },
  });
};
