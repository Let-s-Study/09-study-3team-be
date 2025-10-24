import { z } from 'zod';

export const createHabitSchema = z.object({
  title: z.string().trim().min(1, 'title은 필수입니다.'),
  studyId: z.string({
    required_error: 'studyId는 필수입니다.',
    invalid_type_error: 'studyId는 문자열이어야 합니다.',
  }),
});

export const updateHabitSchema = z.object({
  title: z.string().optional(),
});