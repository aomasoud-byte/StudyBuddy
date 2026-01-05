# Prisma Migration Guide

## Initial Setup

Due to environment network restrictions during development, the Prisma client and migrations need to be generated in a proper deployment environment.

### Steps to Initialize Database:

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Create Initial Migration:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Seed the Database (Optional):**
   ```bash
   npm run seed
   ```

4. **View Database (Optional):**
   ```bash
   npx prisma studio
   ```

## For Production

1. **Switch to PostgreSQL:**

   Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Update DATABASE_URL in .env:**
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/studybuddy?schema=public"
   ```

3. **Deploy Migrations:**
   ```bash
   npx prisma migrate deploy
   ```

## Common Commands

- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Create and apply migrations (dev)
- `npx prisma migrate deploy` - Apply migrations (production)
- `npx prisma studio` - Open database GUI
- `npx prisma db push` - Sync schema without migrations (dev only)
- `npx prisma db seed` - Run seed script

## Schema Overview

The database schema includes:

- **User** - Authentication and user data
- **Subject** - Study subjects/courses
- **Flashcard** - Flashcards with spaced repetition
- **QuizQuestion** - Quiz questions (MCQ and short answer)
- **QuizAttempt** - Quiz attempt history
- **QuizAttemptAnswer** - Individual quiz answers
- **MockExam** - Mock exam configurations
- **MockExamQuestion** - Questions in mock exams
- **MockExamAttempt** - Mock exam attempt history
- **StudySession** - Study session tracking
- **UserAchievement** - User achievements
- **TutorMessage** - AI tutor conversation history

## Troubleshooting

If you encounter issues:

1. Delete `node_modules/.prisma` and `node_modules/@prisma`
2. Run `npm install` again
3. Run `npx prisma generate`
4. Run `npx prisma migrate dev`

For "engine not found" errors, ensure network access is available for downloading Prisma engines.
