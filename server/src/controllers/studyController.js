import * as StudyRepo from '../repository/studyRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';
const { Prisma } = pkg;

export const createStudy = async (req, res) => {
  try {
    const b = req.body || {};

    const nickName =
      typeof b.nickName === 'string' && b.nickName.trim() !== ''
        ? b.nickName.trim()
        : typeof b.nickname === 'string'
          ? b.nickname.trim()
          : '';
    const title = typeof b.title === 'string' ? b.title.trim() : '';
    const description =
      typeof b.description === 'string' ? b.description.trim() : '';
    const password = typeof b.password === 'string' ? b.password : '';
    const background =
      typeof b.background === 'string' && b.background.trim() !== ''
        ? b.background.trim()
        : typeof b.backgroundId === 'string'
          ? b.backgroundId.trim()
          : '';

    const missing = [];
    if (!nickName) missing.push('nickName');
    if (!title) missing.push('title');
    if (!description) missing.push('description');
    if (!background) missing.push('background');
    if (!password) missing.push('password');
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: '필수 항목 누락: ' + missing.join(', '),
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudy = await StudyRepo.createStudy({
      nickName: nickName,
      title: title,
      description: description,
      password: hashedPassword,
      background: background,
    });

    const safe = { ...newStudy };
    delete safe.password;

    return res.status(201).json({
      success: true,
      message: '스터디 생성 완료',
      data: safe,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res
        .status(409)
        .json({ success: false, message: '중복된 스터디가 존재합니다.' });
    }
    console.error('createStudy Error:', error);
    return res.status(500).json({
      success: false,
      message: '스터디 생성 실패',
      error: String(error && error.message ? error.message : error),
    });
  }
};

export const getAllStudies = async (req, res) => {
  try {
    const studies = await StudyRepo.getAllStudies();
    return res.status(200).json({ success: true, data: studies });
  } catch (error) {
    console.error('getAllStudies Error:', error);
    return res.status(500).json({
      success: false,
      message: '스터디 조회 실패',
      error: String(error && error.message ? error.message : error),
    });
  }
};

export const deleteStudy = async (req, res) => {
  try {
    const id = req.params && req.params.id ? req.params.id : '';
    const authStudy = req.study;

    if (!authStudy || !authStudy.id || id !== authStudy.id) {
      return res
        .status(403)
        .json({ success: false, message: '자신의 스터디가 아닙니다' });
    }

    await StudyRepo.deleteStudy(id);
    return res.status(200).json({ success: true, message: '스터디 삭제 완료' });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res
        .status(404)
        .json({ success: false, message: '존재하지 않는 스터디입니다.' });
    }
    console.error('deleteStudy Error:', error);
    return res.status(500).json({
      success: false,
      message: '스터디 삭제 실패',
      error: String(error && error.message ? error.message : error),
    });
  }
};

export const addStudyPoints = async (req, res) => {
  try {
    const id = req.params && req.params.id ? req.params.id : '';
    const authStudy = req.study;
    if (!authStudy || !authStudy.id || id !== authStudy.id) {
      return res
        .status(403)
        .json({ success: false, message: '로그인된 스터디가 아닙니다' });
    }

    const body = req.body || {};
    const amount = body.amount;
    if (amount === undefined || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: '추가할 포인트(amount)가 필요합니다.',
      });
    }

    const updated = await StudyRepo.addPoints(id, Number(amount));
    return res.status(200).json({
      success: true,
      message: '+' + amount + ' 포인트 추가 완료',
      data: updated,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res
        .status(404)
        .json({ success: false, message: '존재하지 않는 스터디입니다.' });
    }
    console.error('addStudyPoints Error:', error);
    return res.status(500).json({
      success: false,
      message: '포인트 추가 실패',
      error: String(error && error.message ? error.message : error),
    });
  }
};

export const verifyPw = async (req, res, next) => {
  try {
    const studyId = req.params && req.params.studyId ? req.params.studyId : '';
    const body = req.body || {};
    const password = typeof body.password === 'string' ? body.password : '';

    const study = await StudyRepo.findStudyById(studyId);
    if (!study)
      return res.status(404).json({ message: '로그인된 스터디가 아닙니다' });

    const ok = await bcrypt.compare(password, study.password);
    if (!ok)
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

    const token = jwt.sign({ studyId: study.id }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 12 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: '로그인 완료' });
  } catch (error) {
    next(error);
  }
};
