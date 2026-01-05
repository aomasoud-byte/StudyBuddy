import 'package:json_annotation/json_annotation.dart';

part 'subject.g.dart';

@JsonSerializable()
class Subject {
  final String id;
  final String userId;
  final String name;
  final String? description;
  final String color;
  final String? icon;
  final DateTime? examDate;
  final bool archived;
  final DateTime createdAt;
  final DateTime updatedAt;

  Subject({
    required this.id,
    required this.userId,
    required this.name,
    this.description,
    required this.color,
    this.icon,
    this.examDate,
    required this.archived,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Subject.fromJson(Map<String, dynamic> json) => _$SubjectFromJson(json);
  Map<String, dynamic> toJson() => _$SubjectToJson(this);
}
