import prisma from '../db/prismaClient.js';

export const createEmoji = async (data) => {
  return prisma.emoji.create({ data });
};

export const getEmojisByStudyId = async (studyId) => {
  return prisma.emoji.findMany({
    where: { studyId },
    orderBy: { createdAt: 'desc' },
  });
};

export const incrementEmoji = async (id) => {
  return prisma.emoji.update({
    where: { id },
    data: { count: { increment: 1 } },
  });
};

export const deleteEmoji = async (id) => {
  return prisma.emoji.delete({ where: { id } });
};
