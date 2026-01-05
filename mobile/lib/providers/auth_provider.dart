import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:study_buddy/models/user.dart';
import 'package:study_buddy/services/api_service.dart';

// API Service Provider
final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

// Auth State
sealed class AuthState {}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class Authenticated extends AuthState {
  final User user;
  Authenticated(this.user);
}

class Unauthenticated extends AuthState {}

class AuthError extends AuthState {
  final String message;
  AuthError(this.message);
}

// Auth Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final ApiService _apiService;

  AuthNotifier(this._apiService) : super(AuthInitial()) {
    checkAuth();
  }

  Future<void> checkAuth() async {
    try {
      final isAuth = await _apiService.isAuthenticated();
      if (isAuth) {
        final userData = await _apiService.getMe();
        state = Authenticated(User.fromJson(userData));
      } else {
        state = Unauthenticated();
      }
    } catch (e) {
      state = Unauthenticated();
    }
  }

  Future<void> login(String email, String password) async {
    state = AuthLoading();
    try {
      final response = await _apiService.login(email: email, password: password);
      final authResponse = AuthResponse.fromJson(response);
      await _apiService.saveToken(authResponse.token);
      state = Authenticated(authResponse.user);
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<void> signup(String email, String password, String name) async {
    state = AuthLoading();
    try {
      final response = await _apiService.signup(
        email: email,
        password: password,
        name: name,
      );
      final authResponse = AuthResponse.fromJson(response);
      await _apiService.saveToken(authResponse.token);
      state = Authenticated(authResponse.user);
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<void> logout() async {
    await _apiService.clearToken();
    state = Unauthenticated();
  }
}

// Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return AuthNotifier(apiService);
});
