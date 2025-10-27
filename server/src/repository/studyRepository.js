import prisma from '../db/prismaClient.js';

export const createStudy = async function (data) {
  return prisma.study.create({ data: data });
};

export const getAllStudies = async function () {
  return prisma.study.findMany({
    select: {
      id: true,
      nickName: true,
      title: true,
      description: true,
      background: true,
      totalPoint: true,
      createdAt: true,
      emojis: { select: { id: true, emoji: true, count: true } },
      habits: { select: { id: true, title: true, createdAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};
