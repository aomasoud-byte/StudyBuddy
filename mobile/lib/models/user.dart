import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final String id;
  final String email;
  final String name;
  final String plan;
  final String? subscriptionStatus;
  final int xp;
  final int level;
  final int streak;
  final DateTime? lastStudyDate;
  final int dailyGoalMinutes;
  final int dailyGoalCards;
  final DateTime createdAt;

  User({
    required this.id,
    required this.email,
    required this.name,
    required this.plan,
    this.subscriptionStatus,
    required this.xp,
    required this.level,
    required this.streak,
    this.lastStudyDate,
    required this.dailyGoalMinutes,
    required this.dailyGoalCards,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);

  bool get isPro => plan == 'PRO';
}

@JsonSerializable()
class AuthResponse {
  final User user;
  final String token;

  AuthResponse({required this.user, required this.token});

  factory AuthResponse.fromJson(Map<String, dynamic> json) =>
      _$AuthResponseFromJson(json);
  Map<String, dynamic> toJson() => _$AuthResponseToJson(this);
}
