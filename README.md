# Study Buddy

**AI-Powered Personal Tutor & Study Companion**

Study Buddy is a comprehensive learning platform that combines proven learning science (active recall, spaced repetition, mock exams) with behavior-change psychology (habit loops, streaks, gamification) to help students learn faster and remember longer.

## 🎯 Features

### Core Learning Features
- **Spaced Repetition Flashcards**: Smart scheduling based on SM-2 algorithm
- **AI-Powered Content Generation**: Generate flashcards and quizzes from your notes
- **Mock Exams**: Timed practice tests with detailed analytics
- **AI Tutor**: Personal AI tutor that explains concepts and tests understanding
- **Quizzes**: Multiple choice and short answer questions

### Gamification & Habits
- Daily study goals and streaks
- XP and leveling system
- Achievements and milestones
- Progress tracking and analytics

### Monetization
- **Free Tier**: Up to 3 subjects, 200 flashcards, limited AI usage
- **Pro Tier**: Unlimited subjects, flashcards, and AI usage via RevenueCat subscriptions

## 🏗️ Architecture

### Frontend
- **Framework**: Flutter (single codebase for iOS, Android, and Web)
- **State Management**: Riverpod
- **Platforms**: iOS, Android, Web

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT-based

### AI Integration
- **Providers**: Anthropic Claude / OpenAI GPT
- **Features**: Content generation, tutoring chat

### Subscriptions
- **Platform**: RevenueCat
- **Products**: Free tier and Study Buddy Pro (monthly/yearly)

## 📁 Project Structure

```
StudyBuddy/
├── backend/          # NestJS backend API
│   ├── src/
│   ├── prisma/
│   ├── test/
│   └── package.json
├── mobile/           # Flutter app (iOS, Android, Web)
│   ├── lib/
│   ├── test/
│   ├── ios/
│   ├── android/
│   ├── web/
│   └── pubspec.yaml
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Flutter SDK 3.16+
- PostgreSQL 14+
- Git

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed

# Start development server
npm run start:dev
```

### Mobile App Setup

```bash
cd mobile

# Install dependencies
flutter pub get

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Run on desired platform
flutter run -d chrome          # Web
flutter run -d ios             # iOS
flutter run -d android         # Android
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/studybuddy"

# JWT
JWT_SECRET="your-secure-jwt-secret"
JWT_EXPIRES_IN="7d"

# AI Provider (choose one or both)
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:8080"
```

### Mobile (.env)

```env
# API
API_BASE_URL="http://localhost:3000/api"

# RevenueCat
REVENUECAT_PUBLIC_KEY_IOS="your-ios-key"
REVENUECAT_PUBLIC_KEY_ANDROID="your-android-key"
REVENUECAT_PUBLIC_KEY_WEB="your-web-key"
```

## 🧪 Testing

### Backend
```bash
cd backend
npm test                # Run unit tests
npm run test:e2e        # Run integration tests
npm run test:cov        # Run with coverage
```

### Mobile
```bash
cd mobile
flutter test            # Run unit and widget tests
flutter test --coverage # Run with coverage
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Mobile

**iOS:**
```bash
cd mobile
flutter build ios --release
```

**Android:**
```bash
cd mobile
flutter build apk --release
flutter build appbundle --release
```

**Web:**
```bash
cd mobile
flutter build web --release
```

## 🐳 Docker

```bash
# Build backend image
cd backend
docker build -t study-buddy-backend .

# Run with docker-compose
docker-compose up
```

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Mobile App Documentation](./mobile/README.md)
- [Database Schema](./backend/prisma/schema.prisma)

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for stateless authentication
- API keys stored in environment variables (never committed)
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configured for allowed origins

## 🎓 Learning Science Principles

Study Buddy is built on proven learning research:

1. **Active Recall**: Retrieving information strengthens memory
2. **Spaced Repetition**: Reviewing at increasing intervals optimizes retention
3. **Practice Testing**: Testing is more effective than re-reading
4. **Interleaving**: Mixing topics improves learning
5. **Elaboration**: Explaining concepts in your own words deepens understanding

## 🤝 Contributing

This is a production-ready application template. Feel free to customize and extend it for your needs.

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues, questions, or feature requests, please open an issue in the repository.

---

**Built with ❤️ for students everywhere**
