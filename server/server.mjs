import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import studyRoute from './src/routes/studyRoute.js';
import habitRoute from './src/routes/habitRoute.js';
import habitRecordRoute from './src/routes/habitRecordRoute.js';
import emojiRoute from './src/routes/emojiRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const corsOption = {
  origin: 'http://localhost:5173', //fe 주소
  credentials: true,
};
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: ' Server is healthy!',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/api/studies', studyRoute);
app.use('/api/habits', habitRoute);
app.use('/api/habit-records', habitRecordRoute);
app.use('/api/emojis', emojiRoute);

app.use((err, req, res, next) => {
  console.error(err); // 서버 로그에 에러 기록

  // Status를 지정한 에러 처리
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: '서버 오류 발생',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
