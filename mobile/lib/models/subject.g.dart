// GENERATED CODE - DO NOT MODIFY BY HAND
part of 'subject.dart';

Subject _$SubjectFromJson(Map<String, dynamic> json) => Subject(
  id: json['id'] as String,
  userId: json['userId'] as String,
  name: json['name'] as String,
  description: json['description'] as String?,
  color: json['color'] as String,
  icon: json['icon'] as String?,
  examDate: json['examDate'] == null
      ? null
      : DateTime.parse(json['examDate'] as String),
  archived: json['archived'] as bool,
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$SubjectToJson(Subject instance) => <String, dynamic>{
  'id': instance.id,
  'userId': instance.userId,
  'name': instance.name,
  'description': instance.description,
  'color': instance.color,
  'icon': instance.icon,
  'examDate': instance.examDate?.toIso8601String(),
  'archived': instance.archived,
  'createdAt': instance.createdAt.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
};
