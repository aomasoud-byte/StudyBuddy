import 'package:flutter/material.dart';

class SubjectsScreen extends StatelessWidget {
  const SubjectsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Subjects'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSubjectCard(
            'Biology',
            'High school biology - cells, genetics',
            Colors.green,
            50,
            15,
          ),
          _buildSubjectCard(
            'Calculus',
            'AP Calculus AB',
            Colors.blue,
            30,
            8,
          ),
          _buildSubjectCard(
            'History',
            'World History',
            Colors.orange,
            25,
            5,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Show add subject dialog
        },
        icon: const Icon(Icons.add),
        label: const Text('New Subject'),
      ),
    );
  }

  Widget _buildSubjectCard(
    String name,
    String description,
    Color color,
    int flashcardCount,
    int dueCount,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.2),
          child: Icon(Icons.book, color: color),
        ),
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(description),
            const SizedBox(height: 4),
            Text(
              '$flashcardCount cards • $dueCount due',
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
          ],
        ),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: () {},
      ),
    );
  }
}
