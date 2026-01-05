// GENERATED CODE - DO NOT MODIFY BY HAND
// Run: flutter pub run build_runner build

part of 'user.dart';

// Placeholder for generated JSON serialization code
// This file will be auto-generated when you run build_runner

User _$UserFromJson(Map<String, dynamic> json) => User(
  id: json['id'] as String,
  email: json['email'] as String,
  name: json['name'] as String,
  plan: json['plan'] as String,
  subscriptionStatus: json['subscriptionStatus'] as String?,
  xp: json['xp'] as int,
  level: json['level'] as int,
  streak: json['streak'] as int,
  lastStudyDate: json['lastStudyDate'] == null
      ? null
      : DateTime.parse(json['lastStudyDate'] as String),
  dailyGoalMinutes: json['dailyGoalMinutes'] as int,
  dailyGoalCards: json['dailyGoalCards'] as int,
  createdAt: DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'name': instance.name,
  'plan': instance.plan,
  'subscriptionStatus': instance.subscriptionStatus,
  'xp': instance.xp,
  'level': instance.level,
  'streak': instance.streak,
  'lastStudyDate': instance.lastStudyDate?.toIso8601String(),
  'dailyGoalMinutes': instance.dailyGoalMinutes,
  'dailyGoalCards': instance.dailyGoalCards,
  'createdAt': instance.createdAt.toIso8601String(),
};

AuthResponse _$AuthResponseFromJson(Map<String, dynamic> json) => AuthResponse(
  user: User.fromJson(json['user'] as Map<String, dynamic>),
  token: json['token'] as String,
);

Map<String, dynamic> _$AuthResponseToJson(AuthResponse instance) =>
    <String, dynamic>{
  'user': instance.user.toJson(),
  'token': instance.token,
};
