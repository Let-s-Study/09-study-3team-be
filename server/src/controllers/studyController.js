import * as StudyRepo from '../repository/studyRepository.js';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonbtoken';

export const createStudy = async (req, res) => {
  try {
    const { nickname, title, description, password, background } = req.body;

    if (!nickname || !title || !password) {
      return res.status(400).json({
        success: false,
        message: '필수 항목(nickname, title, password)이 누락되었습니다.',
      });
    }

    const newStudy = await StudyRepo.createStudy({
      nickname: nickname.trim(),
      title: title.trim(),
      description: description ? description.trim() : null,
      password,
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
    return res
      .status(500)
      .json({
        success: false,
        message: '포인트 추가 실패',
        error: error.message,
      });
  }
};

export const verifyPw = async (req,res,next) => {
  try {
    const {studyId} = req.params;
    const {password} = req.body;
    const isPasswordCorrect = await bcrypt.compare(password,studyId.password);
    if(!isPasswordCorrect){
      return res.status(401).json({message: '비밀번호가 일치하지 않습니다.'});
    }
    return res.status(200).json({message: '로그인 성공'});
  } catch(error){
    next(error);
  }
}
