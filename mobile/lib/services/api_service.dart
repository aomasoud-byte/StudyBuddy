import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

class ApiService {
  late final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  static const String _tokenKey = 'auth_token';

  ApiService() {
    final baseUrl = dotenv.env['API_BASE_URL'] ?? 'http://localhost:3000/api';

    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add interceptors
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Add auth token to headers
          final token = await getToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (error, handler) async {
          // Handle 401 Unauthorized
          if (error.response?.statusCode == 401) {
            await clearToken();
            // Navigate to login
          }
          return handler.next(error);
        },
      ),
    );

    // Add logger in development
    if (dotenv.env['ENV'] == 'development') {
      _dio.interceptors.add(PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
        compact: true,
      ));
    }
  }

  Dio get dio => _dio;

  // Token management
  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  Future<void> clearToken() async {
    await _storage.delete(key: _tokenKey);
  }

  Future<bool> isAuthenticated() async {
    final token = await getToken();
    return token != null;
  }

  // Auth endpoints
  Future<Map<String, dynamic>> signup({
    required String email,
    required String password,
    required String name,
  }) async {
    final response = await _dio.post('/auth/signup', data: {
      'email': email,
      'password': password,
      'name': name,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getMe() async {
    final response = await _dio.get('/auth/me');
    return response.data;
  }

  // Subjects endpoints
  Future<List<dynamic>> getSubjects({bool includeArchived = false}) async {
    final response = await _dio.get('/subjects',
        queryParameters: {'includeArchived': includeArchived});
    return response.data as List;
  }

  Future<Map<String, dynamic>> createSubject(Map<String, dynamic> data) async {
    final response = await _dio.post('/subjects', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> updateSubject(
      String id, Map<String, dynamic> data) async {
    final response = await _dio.patch('/subjects/$id', data: data);
    return response.data;
  }

  Future<void> deleteSubject(String id) async {
    await _dio.delete('/subjects/$id');
  }

  // Flashcards endpoints
  Future<List<dynamic>> getDueFlashcards({String? subjectId}) async {
    final response = await _dio.get('/flashcards/due',
        queryParameters: subjectId != null ? {'subjectId': subjectId} : null);
    return response.data as List;
  }

  Future<Map<String, dynamic>> createFlashcard(
      Map<String, dynamic> data) async {
    final response = await _dio.post('/flashcards', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> reviewFlashcard(
      String id, String quality) async {
    final response =
        await _dio.patch('/flashcards/$id/review', data: {'quality': quality});
    return response.data;
  }

  Future<void> deleteFlashcard(String id) async {
    await _dio.delete('/flashcards/$id');
  }

  // AI endpoints
  Future<Map<String, dynamic>> generateFlashcards({
    required String subjectId,
    required String notes,
  }) async {
    final response = await _dio.post('/ai/generate-flashcards', data: {
      'subjectId': subjectId,
      'notes': notes,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> generateQuiz({
    required String subjectId,
    required String topic,
    int count = 5,
  }) async {
    final response = await _dio.post('/ai/generate-quiz', data: {
      'subjectId': subjectId,
      'topic': topic,
      'count': count,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> tutorChat({
    required String subjectId,
    required String message,
  }) async {
    final response = await _dio.post('/ai/tutor', data: {
      'subjectId': subjectId,
      'message': message,
    });
    return response.data;
  }
}
