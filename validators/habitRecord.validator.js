import { z } from 'zod';

export const createHabitRecordSchema = z.object({
  habitId: z.string().min(1, '유효한 habitId가 필요합니다.'),
  day: z.coerce.date({ required_error: '날짜는 필수입니다.' }),
});

export const updateHabitRecordSchema = z.object({
  day: z.string().optional(),
});

