// GENERATED CODE - DO NOT MODIFY BY HAND
part of 'flashcard.dart';

Flashcard _$FlashcardFromJson(Map<String, dynamic> json) => Flashcard(
  id: json['id'] as String,
  userId: json['userId'] as String,
  subjectId: json['subjectId'] as String,
  front: json['front'] as String,
  back: json['back'] as String,
  easeFactor: (json['easeFactor'] as num).toDouble(),
  intervalDays: json['intervalDays'] as int,
  repetitions: json['repetitions'] as int,
  lastReviewedAt: json['lastReviewedAt'] == null
      ? null
      : DateTime.parse(json['lastReviewedAt'] as String),
  scheduledReviewAt: DateTime.parse(json['scheduledReviewAt'] as String),
  difficulty: json['difficulty'] as String,
  tags: json['tags'] as String?,
  mastered: json['mastered'] as bool,
  createdAt: DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$FlashcardToJson(Flashcard instance) => <String, dynamic>{
  'id': instance.id,
  'userId': instance.userId,
  'subjectId': instance.subjectId,
  'front': instance.front,
  'back': instance.back,
  'easeFactor': instance.easeFactor,
  'intervalDays': instance.intervalDays,
  'repetitions': instance.repetitions,
  'lastReviewedAt': instance.lastReviewedAt?.toIso8601String(),
  'scheduledReviewAt': instance.scheduledReviewAt.toIso8601String(),
  'difficulty': instance.difficulty,
  'tags': instance.tags,
  'mastered': instance.mastered,
  'createdAt': instance.createdAt.toIso8601String(),
};
