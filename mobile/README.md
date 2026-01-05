# Study Buddy - Flutter App

Flutter application for Study Buddy - works on iOS, Android, and Web.

## Features Implemented

### Authentication
- ✅ Login/Signup screens
- ✅ JWT token management
- ✅ Secure storage for tokens
- ✅ Auto-redirect based on auth state

### Core Screens
- ✅ Home screen with bottom navigation
- ✅ Study dashboard with stats (streak, XP, level)
- ✅ Flashcard review with spaced repetition UI
- ✅ Subject management
- ✅ AI Tutor chat interface
- ✅ Profile screen

### State Management
- Riverpod for global state
- Auth provider with reactive updates
- API service with interceptors

### API Integration
- Dio HTTP client
- Pretty logging for development
- Automatic token injection
- Error handling and 401 redirects

## Setup

### Prerequisites
- Flutter SDK 3.0+
- Dart 3.0+
- iOS: Xcode 14+
- Android: Android Studio with SDK 21+

### Installation

```bash
# Install dependencies
flutter pub get

# Generate code (for JSON serialization)
flutter pub run build_runner build --delete-conflicting-outputs

# Create .env file
cp .env.example .env
# Edit .env with your API URL
```

### Environment Configuration

Create a `.env` file:

```env
API_BASE_URL=http://localhost:3000/api
REVENUECAT_API_KEY_IOS=your_key
REVENUECAT_API_KEY_ANDROID=your_key
REVENUECAT_API_KEY_WEB=your_key
ENV=development
```

### Running the App

```bash
# Web
flutter run -d chrome

# iOS (requires Mac)
flutter run -d ios

# Android
flutter run -d android

# Or use VS Code/Android Studio run configurations
```

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   ├── user.dart
│   ├── subject.dart
│   └── flashcard.dart
├── providers/                # Riverpod providers
│   └── auth_provider.dart
├── screens/                  # UI screens
│   ├── auth/
│   │   ├── login_screen.dart
│   │   └── signup_screen.dart
│   ├── home/
│   │   └── home_screen.dart
│   ├── study/
│   │   ├── subjects_screen.dart
│   │   └── flashcard_review_screen.dart
│   ├── ai/
│   │   └── tutor_chat_screen.dart
│   └── profile/
│       └── profile_screen.dart
├── services/                 # Business logic
│   ├── api_service.dart
│   └── router_service.dart
├── utils/                    # Utilities
│   └── theme.dart
└── widgets/                  # Reusable widgets
```

## Key Dependencies

- **flutter_riverpod**: State management
- **go_router**: Navigation
- **dio**: HTTP client
- **flutter_secure_storage**: Secure token storage
- **json_annotation**: JSON serialization
- **google_fonts**: Custom fonts
- **purchases_flutter**: RevenueCat subscriptions (to be configured)

## TODO - Additional Implementation

### Phase 6-7: Core Features
- [ ] Connect subjects screen to API
- [ ] Connect flashcard review to API
- [ ] Implement quiz screens
- [ ] Implement mock exam screens
- [ ] Add loading states and error handling
- [ ] Add pull-to-refresh

### Phase 8: AI Features
- [ ] Connect AI tutor chat to API
- [ ] Implement "Paste Notes" feature
- [ ] Add flashcard generation UI
- [ ] Add quiz generation UI

### Phase 9: Gamification
- [ ] Achievements screen
- [ ] Progress analytics
- [ ] Streak tracking and reminders
- [ ] XP/Level system visualization
- [ ] Daily goal tracking

### Phase 10: RevenueCat Integration
- [ ] Initialize RevenueCat SDK
- [ ] Create paywall screen
- [ ] Implement subscription purchase flow
- [ ] Add restore purchases
- [ ] Gate features based on subscription status
- [ ] Handle subscription events

### Phase 11: Polish
- [ ] Add animations and transitions
- [ ] Implement dark mode
- [ ] Add offline support
- [ ] Write widget tests
- [ ] Add integration tests
- [ ] Optimize performance
- [ ] Add error boundaries
- [ ] Implement analytics

## Building for Production

### iOS
```bash
flutter build ios --release
# Then open ios/Runner.xcworkspace in Xcode
# Archive and upload to App Store Connect
```

### Android
```bash
flutter build appbundle --release
# Upload to Google Play Console
```

### Web
```bash
flutter build web --release
# Deploy the build/web directory
```

## Code Generation

When you modify models with `@JsonSerializable`:

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

## Testing

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage

# Run specific test file
flutter test test/models/user_test.dart
```

## Troubleshooting

### Build Runner Issues
```bash
flutter pub run build_runner clean
flutter pub run build_runner build --delete-conflicting-outputs
```

### iOS Pod Install Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android Gradle Issues
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
```

## Notes

- The app requires the backend API to be running
- Generated files (*.g.dart) are created by build_runner
- Secure storage may not work on some simulators
- RevenueCat requires configuration in App Store Connect and Google Play Console

## License

MIT
