import { z } from 'zod';

export const createStudySchema = z.object({
  nickName: z.string().trim().min(1, '닉네임은 필수입니다.'),
  title: z.string().trim().min(1, '스터디 제목은 필수입니다'),
  description: z.string().trim().min(2, '소개는 최소 2자리 이상이어야 합니다.'),
  password: z.string().min(4, '비밀번호는 최소 4자리 이상이어야 합니다.'),
  backgroundId: z.string().min(1, '배경 선택은 필수 입력 항목입니다.')
});

