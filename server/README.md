
# 🌳 Study Forest — Backend (Express + Prisma + PostgreSQL)

간단한 API 서버(Express) + ORM(Prisma) + DB(PostgreSQL) 세팅입니다.  
Prisma Studio/DBeaver로 데이터 확인 가능합니다.

---

## 📦 Tech
- Node.js, Express, CORS, dotenv
- Prisma ORM, PostgreSQL
- ESLint(ESM), Prettier, Nodemon

---

## 🗂 구조

server/
├ prisma/            # schema.prisma, migrations
├ src/
│ └── db/
│     └── prismaClient.js
├ .vscode/
│ └── settings.json
├ .env.example
├ eslint.config.js
├ .prettierrc
├ .gitignore
├ server.js
└ package.json

---

## 🔑 환경변수 (.env)
`.env.example` 복사 후 값 채우기:
```bash
cp .env.example .env

예시:

PORT=4000
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:5432/forest?schema=public"
NODE_ENV=development


⸻

🚀 실행 순서

npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev


⸻

🩺 Health Check

서버 실행 후 아래 주소에서 확인:

GET http://localhost:4000/api/v1/health

응답 예시:

{
  "success": true,
  "message": "✅ Server is healthy!",
  "data": {
    "status": "ok",
    "timestamp": "2025-10-21T12:34:56.789Z"
  }
}


⸻

🧰 명령어

npm run dev            # nodemon(개발용)
npm start              # node 실행(배포용)
npm run lint           # ESLint 검사
npm run lint:fix       # ESLint 자동수정
npm run prisma:generate# Prisma Client 생성
npm run prisma:migrate # 스키마 → DB 반영
npm run prisma:studio  # Prisma Studio UI

```
server
├─ .prettierrc
├─ README.md
├─ eslint.config.js
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20251021174432_update_schema
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ server.js
├─ src
│  ├─ common
│  │  ├─ Errors
│  │  └─ constants
│  ├─ config
│  ├─ controllers
│  │  ├─ emojiController.js
│  │  ├─ habitController.js
│  │  ├─ habitRecordController.js
│  │  └─ studyController.js
│  ├─ db
│  │  └─ prismaClient.js
│  ├─ middlewares
│  ├─ repository
│  │  ├─ emojiRepository.js
│  │  ├─ habitRecordRepository.js
│  │  ├─ habitRepository.js
│  │  └─ studyRepository.js
│  ├─ routes
│  │  ├─ emojiRoute.js
│  │  ├─ habitRecordRoute.js
│  │  ├─ habitRoute.js
│  │  └─ studyRoute.js
│  ├─ utils
│  └─ validators
└─ vscode
   └─ settings.json

```


