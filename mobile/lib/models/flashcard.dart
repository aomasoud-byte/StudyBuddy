import 'package:json_annotation/json_annotation.dart';

part 'flashcard.g.dart';

@JsonSerializable()
class Flashcard {
  final String id;
  final String userId;
  final String subjectId;
  final String front;
  final String back;
  final double easeFactor;
  final int intervalDays;
  final int repetitions;
  final DateTime? lastReviewedAt;
  final DateTime scheduledReviewAt;
  final String difficulty;
  final String? tags;
  final bool mastered;
  final DateTime createdAt;

  Flashcard({
    required this.id,
    required this.userId,
    required this.subjectId,
    required this.front,
    required this.back,
    required this.easeFactor,
    required this.intervalDays,
    required this.repetitions,
    this.lastReviewedAt,
    required this.scheduledReviewAt,
    required this.difficulty,
    this.tags,
    required this.mastered,
    required this.createdAt,
  });

  factory Flashcard.fromJson(Map<String, dynamic> json) =>
      _$FlashcardFromJson(json);
  Map<String, dynamic> toJson() => _$FlashcardToJson(this);

  List<String> get tagsList {
    if (tags == null || tags!.isEmpty) return [];
    // Parse JSON string array
    return [];  // Simplified for now
  }
}

enum ReviewQuality { again, hard, good, easy }
