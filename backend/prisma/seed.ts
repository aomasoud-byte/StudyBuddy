import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@studybuddy.com' },
    update: {},
    create: {
      email: 'demo@studybuddy.com',
      password: hashedPassword,
      name: 'Demo User',
      plan: 'PRO',
      xp: 1250,
      level: 5,
      streak: 7,
      dailyGoalMinutes: 30,
      dailyGoalCards: 20,
    },
  });

  console.log(`✅ Created demo user: ${demoUser.email}`);

  // Create sample subjects
  const biologySubject = await prisma.subject.create({
    data: {
      userId: demoUser.id,
      name: 'Biology',
      description: 'High school biology - cells, genetics, evolution',
      color: '#10b981',
      examDate: new Date('2024-06-15'),
    },
  });

  const mathSubject = await prisma.subject.create({
    data: {
      userId: demoUser.id,
      name: 'Calculus',
      description: 'AP Calculus AB',
      color: '#3b82f6',
    },
  });

  console.log(`✅ Created ${2} subjects`);

  // Create sample flashcards
  const flashcards = await prisma.flashcard.createMany({
    data: [
      {
        userId: demoUser.id,
        subjectId: biologySubject.id,
        front: 'What is the powerhouse of the cell?',
        back: 'Mitochondria - produces ATP through cellular respiration',
        difficulty: 'EASY',
        tags: JSON.stringify(['cells', 'organelles']),
      },
      {
        userId: demoUser.id,
        subjectId: biologySubject.id,
        front: 'What is DNA?',
        back: 'Deoxyribonucleic acid - carries genetic information',
        difficulty: 'MEDIUM',
        tags: JSON.stringify(['genetics', 'molecules']),
      },
      {
        userId: demoUser.id,
        subjectId: mathSubject.id,
        front: 'What is the derivative of x²?',
        back: '2x',
        difficulty: 'EASY',
        tags: JSON.stringify(['derivatives', 'power-rule']),
      },
    ],
  });

  console.log(`✅ Created ${flashcards.count} flashcards`);

  // Create sample quiz questions
  const questions = await prisma.quizQuestion.createMany({
    data: [
      {
        userId: demoUser.id,
        subjectId: biologySubject.id,
        question: 'Which organelle is responsible for protein synthesis?',
        type: 'MCQ',
        options: JSON.stringify(['Mitochondria', 'Ribosome', 'Nucleus', 'Golgi apparatus']),
        correctAnswer: 'Ribosome',
        explanation: 'Ribosomes are the cellular structures where proteins are synthesized',
        difficulty: 'MEDIUM',
        topics: JSON.stringify(['cells', 'organelles']),
      },
      {
        userId: demoUser.id,
        subjectId: mathSubject.id,
        question: 'What is the integral of 2x?',
        type: 'SHORT_ANSWER',
        correctAnswer: 'x² + C',
        explanation: 'The antiderivative of 2x is x² plus a constant of integration',
        difficulty: 'EASY',
        topics: JSON.stringify(['integrals', 'antiderivatives']),
      },
    ],
  });

  console.log(`✅ Created ${questions.count} quiz questions`);

  // Create sample achievements
  const achievements = await prisma.userAchievement.createMany({
    data: [
      {
        userId: demoUser.id,
        achievementKey: 'streak_3',
        title: '3-Day Streak',
        description: 'Studied for 3 consecutive days',
      },
      {
        userId: demoUser.id,
        achievementKey: 'streak_7',
        title: 'Week Warrior',
        description: 'Studied for 7 consecutive days',
      },
      {
        userId: demoUser.id,
        achievementKey: 'cards_50',
        title: 'Card Creator',
        description: 'Created 50 flashcards',
      },
    ],
  });

  console.log(`✅ Created ${achievements.count} achievements`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
