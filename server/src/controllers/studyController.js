import * as StudyRepo from '../repository/studyRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';
const { Prisma } = pkg;

export const createStudy = async (req, res) => {
  try {
    const { nickName, title, description, password, backgroundId } = req.body;

    if (!nickName || !title || !password) {
      return res.status(400).json({
        success: false,
        message: '필수 항목(nickName, title, password)이 누락되었습니다.',
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newStudy = await StudyRepo.createStudy({
      nickName: nickName.trim(),
      title: title.trim(),
      description: description ? description.trim() : null,
      password: hashedPassword,
      background,
    });

    return res.status(201).json({
      success: true,
      message: '스터디 생성 완료',
      data: newStudy,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: '중복된 스터디가 존재합니다.',
        });
      }
    }

    console.error(' createStudy Error:', error);
    return res.status(500).json({
      success: false,
      message: '스터디 생성 실패',
      error: error.message,
    });
  }
};

export const getAllStudies = async (req, res) => {
  try {
    const studies = await StudyRepo.getAllStudies();
    return res.status(200).json({
      success: true,
      data: studies,
    });
  } catch (error) {
    console.error('❌ getAllStudies Error:', error);
    return res.status(500).json({
      success: false,
      message: '스터디 조회 실패',
      error: error.message,
    });
  }
};

export const deleteStudy = async (req, res) => {
  try {
    const { id } = req.params;
    const authStudy = req.study;

    if (id !== authStudy.id) {
      //삭제하려는 스터디 id와 인증(로그인)된 id가 다르면
      return res.status(403).json({
        success: false,
        message: '자신의 스터디가 아닙니다',
      });
    }

    await StudyRepo.deleteStudy(id);

    return res.status(200).json({
      success: true,
      message: '스터디 삭제 완료',
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 스터디입니다.',
      });
    }

    console.error(' deleteStudy Error:', error);
    return res.status(500).json({
      success: false,
      message: '스터디 삭제 실패',
      error: error.message,
    });
  }
};

export const addStudyPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: authStudyId } = req.study;
    if (id !== authStudyId) {
      return res.status(403).json({
        success: false,
        message: '로그인된 스터디가 아닙니다',
      });
    }
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: '추가할 포인트(amount)가 필요합니다.',
      });
    }

    const updatedStudy = await StudyRepo.addPoints(id, Number(amount));
    return res.status(200).json({
      success: true,
      message: `+${amount} 포인트 추가 완료`,
      data: updatedStudy,
    });
  } catch (error) {
    console.error('addStudyPoints Error:', error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res
        .status(404)
        .json({ success: false, message: '존재하지 않는 스터디입니다.' });
    }
    return res.status(500).json({
      success: false,
      message: '포인트 추가 실패',
      error: error.message,
    });
  }
};

export const verifyPw = async (req, res, next) => {
  // 비밀번호 체크
  try {
    const { studyId } = req.params;
    const { password } = req.body;
    const study = await StudyRepo.findStudyById(studyId);
    if (!study) {
      return res.status(404).json({ message: '로그인된 스터디가 아닙니다' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, study.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign({ studyId: study.id }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: true,
      maxAge: 12000 * 60 * 60, //쿠키 유효시간(12시간)
    });
    return res.status(200).json({ message: '로그인 완료' });
  } catch (error) {
    next(error);
  }
};
