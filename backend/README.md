# Study Buddy Backend API

NestJS-based backend API for the Study Buddy application.

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Passport
- **AI Integration**: Anthropic Claude / OpenAI GPT
- **Validation**: class-validator, class-transformer

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `ANTHROPIC_API_KEY`: Anthropic API key (optional, for AI features)
- `OPENAI_API_KEY`: OpenAI API key (optional, for AI features)

### Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npm run seed

# (Optional) Open Prisma Studio
npm run prisma:studio
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Endpoints

### Health Check
- `GET /api/health` - Check API health status

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user

### Subjects
- `GET /api/subjects` - Get all user subjects
- `POST /api/subjects` - Create new subject
- `GET /api/subjects/:id` - Get subject details
- `PATCH /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Flashcards
- `GET /api/flashcards/due` - Get due flashcards
- `POST /api/flashcards` - Create flashcard
- `PATCH /api/flashcards/:id/review` - Submit review rating
- `DELETE /api/flashcards/:id` - Delete flashcard

### Quizzes
- `POST /api/quizzes` - Create quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/history` - Get quiz history

### Mock Exams
- `POST /api/exams` - Create mock exam
- `POST /api/exams/:id/submit` - Submit exam
- `GET /api/exams/history` - Get exam history

### AI
- `POST /api/ai/generate-flashcards` - Generate flashcards from notes
- `POST /api/ai/generate-quiz` - Generate quiz questions
- `POST /api/ai/tutor` - AI tutor chat

### User Progress
- `GET /api/progress` - Get user progress stats
- `GET /api/progress/streaks` - Get streak information
- `GET /api/progress/achievements` - Get achievements

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts           # Seed script
├── src/
│   ├── auth/             # Authentication module
│   ├── subjects/         # Subjects module
│   ├── flashcards/       # Flashcards & spaced repetition
│   ├── quizzes/          # Quiz module
│   ├── exams/            # Mock exams module
│   ├── ai/               # AI integration module
│   ├── progress/         # User progress & gamification
│   ├── common/           # Shared utilities
│   ├── app.module.ts     # Root module
│   └── main.ts           # Application entry point
├── test/                 # E2E tests
└── package.json
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Request validation and sanitization
- Rate limiting
- CORS configuration
- Environment variable protection

## License

MIT
