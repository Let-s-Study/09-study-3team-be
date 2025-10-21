import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import studyRoute from './src/routes/studyRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ Server is healthy!',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/api/v1/studies', studyRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
