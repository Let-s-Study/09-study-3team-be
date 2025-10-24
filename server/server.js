import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import studyRoute from './src/routes/studyRoute.js';
import habitRoute from './src/routes/habitRoute.js';
import habitRecordRoute from './src/routes/habitRecordRoute.js';
import emojiRoute from './src/routes/emojiRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
