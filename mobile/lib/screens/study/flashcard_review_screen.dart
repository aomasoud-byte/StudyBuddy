import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class FlashcardReviewScreen extends ConsumerStatefulWidget {
  final String? subjectId;

  const FlashcardReviewScreen({super.key, this.subjectId});

  @override
  ConsumerState<FlashcardReviewScreen> createState() =>
      _FlashcardReviewScreenState();
}

class _FlashcardReviewScreenState extends ConsumerState<FlashcardReviewScreen> {
  bool _showAnswer = false;
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Review Flashcards'),
        actions: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text('1/15'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Progress indicator
          LinearProgressIndicator(value: 1 / 15),

          // Flashcard
          Expanded(
            child: Center(
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    _showAnswer = !_showAnswer;
                  });
                },
                child: Card(
                  margin: const EdgeInsets.all(24),
                  elevation: 4,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          _showAnswer ? 'Answer' : 'Question',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _showAnswer
                              ? 'Mitochondria - produces ATP through cellular respiration'
                              : 'What is the powerhouse of the cell?',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        if (!_showAnswer) ...[
                          const SizedBox(height: 32),
                          Text(
                            'Tap to show answer',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[500],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Rating buttons (shown after answer is revealed)
          if (_showAnswer)
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const Text(
                    'How well did you remember?',
                    style: TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _buildRatingButton(
                          'Again',
                          Colors.red,
                          () => _submitRating('AGAIN'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildRatingButton(
                          'Hard',
                          Colors.orange,
                          () => _submitRating('HARD'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildRatingButton(
                          'Good',
                          Colors.blue,
                          () => _submitRating('GOOD'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildRatingButton(
                          'Easy',
                          Colors.green,
                          () => _submitRating('EASY'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildRatingButton(String label, Color color, VoidCallback onPressed) {
    return FilledButton(
      onPressed: onPressed,
      style: FilledButton.styleFrom(
        backgroundColor: color,
        padding: const EdgeInsets.symmetric(vertical: 12),
      ),
      child: Text(label),
    );
  }

  void _submitRating(String quality) {
    // TODO: Call API to submit rating
    setState(() {
      _showAnswer = false;
      _currentIndex++;
    });

    if (_currentIndex >= 15) {
      // Show completion screen
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🎉 Review session complete! +50 XP')),
      );
    }
  }
}
