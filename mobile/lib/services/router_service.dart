import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:study_buddy/providers/auth_provider.dart';
import 'package:study_buddy/screens/auth/login_screen.dart';
import 'package:study_buddy/screens/auth/signup_screen.dart';
import 'package:study_buddy/screens/home/home_screen.dart';
import 'package:study_buddy/screens/study/flashcard_review_screen.dart';
import 'package:study_buddy/screens/study/subjects_screen.dart';
import 'package:study_buddy/screens/ai/tutor_chat_screen.dart';
import 'package:study_buddy/screens/profile/profile_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final isAuthenticated = authState.maybeWhen(
        authenticated: (_) => true,
        orElse: () => false,
      );

      final isLoggingIn = state.matchedLocation == '/login' ||
          state.matchedLocation == '/signup';

      if (!isAuthenticated && !isLoggingIn) {
        return '/login';
      }

      if (isAuthenticated && isLoggingIn) {
        return '/home';
      }

      return null;
    },
    routes: [
      // Auth routes
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupScreen(),
      ),

      // Main app routes
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/subjects',
        builder: (context, state) => const SubjectsScreen(),
      ),
      GoRoute(
        path: '/flashcards/review',
        builder: (context, state) {
          final subjectId = state.uri.queryParameters['subjectId'];
          return FlashcardReviewScreen(subjectId: subjectId);
        },
      ),
      GoRoute(
        path: '/tutor',
        builder: (context, state) {
          final subjectId = state.uri.queryParameters['subjectId'] ?? '';
          return TutorChatScreen(subjectId: subjectId);
        },
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
    ],
  );
});
