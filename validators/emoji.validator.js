import { z } from 'zod';

export const createEmojiSchema = z.object({
  emoji: z.string().min(1, '이모지는 필수입니다'),
  studyId: z.string().min(1, '유효한 studyId가 필요합니다.'),
  count: z.number().int().default(0),
});

export const updateEmojiSchema = z.object({
  count: z.number().int().min(0, 'count는 0 이상이어야 합니다.'),
});