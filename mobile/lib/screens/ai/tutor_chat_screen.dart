import 'package:flutter/material.dart';

class TutorChatScreen extends StatelessWidget {
  final String subjectId;

  const TutorChatScreen({super.key, required this.subjectId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Tutor'),
        subtitle: const Text('Biology'),
      ),
      body: Column(
        children: [
          // Chat messages
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildMessage(
                  'Hello! I\'m your AI tutor for Biology. Ask me anything!',
                  isBot: true,
                ),
                _buildMessage(
                  'Can you explain photosynthesis?',
                  isBot: false,
                ),
                _buildMessage(
                  'Photosynthesis is the process where plants convert light energy into chemical energy...',
                  isBot: true,
                ),
              ],
            ),
          ),

          // Input field
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Ask a question...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: () {},
                  style: FilledButton.styleFrom(
                    shape: const CircleBorder(),
                    padding: const EdgeInsets.all(16),
                  ),
                  child: const Icon(Icons.send),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessage(String text, {required bool isBot}) {
    return Align(
      alignment: isBot ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isBot ? Colors.grey[200] : const Color(0xFF6366F1),
          borderRadius: BorderRadius.circular(16),
        ),
        constraints: const BoxConstraints(maxWidth: 280),
        child: Text(
          text,
          style: TextStyle(
            color: isBot ? Colors.black : Colors.white,
          ),
        ),
      ),
    );
  }
}
