import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

// Mock data for demo mode
const mockUsers = new Map();
const mockSubjects = new Map();
const mockFlashcards = new Map();
let userIdCounter = 1;
let subjectIdCounter = 1;
let flashcardIdCounter = 1;

// Simple Express app for demo
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret';

// Middleware to verify JWT
const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Health check
app.get('/api/health', (req: any, res: any) => {
  res.json({
    status: 'ok',
    message: 'Study Buddy Backend API (Demo Mode)',
    timestamp: new Date().toISOString(),
    version: '1.0.0-demo',
  });
});

// Auth endpoints
app.post('/api/auth/signup', async (req: any, res: any) => {
  const { email, password, name } = req.body;

  if (Array.from(mockUsers.values()).some((u: any) => u.email === email)) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = `user_${userIdCounter++}`;

  const user = {
    id: userId,
    email,
    password: hashedPassword,
    name,
    plan: 'FREE',
    subscriptionStatus: null,
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: null,
    dailyGoalMinutes: 30,
    dailyGoalCards: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockUsers.set(userId, user);

  const token = jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: '7d' });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
});

app.post('/api/auth/login', async (req: any, res: any) => {
  const { email, password } = req.body;

  const user: any = Array.from(mockUsers.values()).find((u: any) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '7d' });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
});

app.get('/api/auth/me', verifyToken, (req: any, res: any) => {
  const user = mockUsers.get(req.user.sub);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Subjects endpoints
app.get('/api/subjects', verifyToken, (req: any, res: any) => {
  const userSubjects = Array.from(mockSubjects.values()).filter(
    (s: any) => s.userId === req.user.sub
  );
  res.json(userSubjects);
});

app.post('/api/subjects', verifyToken, (req: any, res: any) => {
  const { name, description, color, examDate } = req.body;

  const subjectId = `subject_${subjectIdCounter++}`;
  const subject = {
    id: subjectId,
    userId: req.user.sub,
    name,
    description,
    color: color || '#6366F1',
    icon: null,
    examDate,
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockSubjects.set(subjectId, subject);
  res.json(subject);
});

// Flashcards endpoints
app.get('/api/flashcards/due', verifyToken, (req: any, res: any) => {
  const userFlashcards = Array.from(mockFlashcards.values()).filter(
    (f: any) => f.userId === req.user.sub
  );
  res.json(userFlashcards.slice(0, 10)); // Return first 10
});

app.post('/api/flashcards', verifyToken, (req: any, res: any) => {
  const { subjectId, front, back, difficulty } = req.body;

  const flashcardId = `flashcard_${flashcardIdCounter++}`;
  const flashcard = {
    id: flashcardId,
    userId: req.user.sub,
    subjectId,
    front,
    back,
    easeFactor: 2.5,
    intervalDays: 1,
    repetitions: 0,
    lastReviewedAt: null,
    scheduledReviewAt: new Date().toISOString(),
    difficulty: difficulty || 'MEDIUM',
    tags: null,
    mastered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockFlashcards.set(flashcardId, flashcard);
  res.json(flashcard);
});

app.patch('/api/flashcards/:id/review', verifyToken, (req: any, res: any) => {
  const flashcard: any = mockFlashcards.get(req.params.id);

  if (!flashcard || flashcard.userId !== req.user.sub) {
    return res.status(404).json({ message: 'Flashcard not found' });
  }

  // Simple scheduling update
  flashcard.lastReviewedAt = new Date().toISOString();
  flashcard.repetitions += 1;

  const xpGained = 10;
  const user: any = mockUsers.get(req.user.sub);
  user.xp += xpGained;

  res.json({ ...flashcard, xpGained });
});

// AI endpoints (mocked)
app.post('/api/ai/tutor', verifyToken, (req: any, res: any) => {
  const { message } = req.body;

  const responses = [
    "That's a great question! Let me explain...",
    "I can help you understand this concept better.",
    "Let me break this down for you step by step.",
    "Here's what you need to know about this topic...",
  ];

  const response = responses[Math.floor(Math.random() * responses.length)];

  res.json({ response: `${response} (This is demo mode - connect a real AI API key for full functionality)` });
});

// Start server
async function bootstrap() {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log('');
    console.log('🚀 Study Buddy Backend API (DEMO MODE)');
    console.log(`📊 Running on: http://localhost:${port}/api`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
    console.log('⚠️  DEMO MODE: Using in-memory storage (no database required)');
    console.log('💡 To use full features, set up Prisma and database as documented');
    console.log('');
  });
}

bootstrap();
