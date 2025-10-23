import jwt from 'jsonwebtoken';
import prisma from '../db/prismaClient';

export const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new Error('로그인 정보가 없습니다.');
    }
    const payload = jwt.verify(accessToken, 'process.env.JWT_SECRET');
    const study = await prisma.study.findUnique({
      where: { id: payload.studyId },
    });
    if (!study) {
      return res.status(401).json({ message: '해당하는 스터디가 없습니다' });
    }
    req.study = study;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({ message: '로그인이 만료되었습니다' });
    }
    next(error);
  }
};
