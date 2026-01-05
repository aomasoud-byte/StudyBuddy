import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:study_buddy/providers/auth_provider.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final user = authState is Authenticated ? authState.user : null;

    if (user == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildHomeTab(user),
          _buildStudyTab(),
          _buildTutorTab(),
          _buildProfileTab(user),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.school_outlined),
            selectedIcon: Icon(Icons.school),
            label: 'Study',
          ),
          NavigationDestination(
            icon: Icon(Icons.chat_outlined),
            selectedIcon: Icon(Icons.chat),
            label: 'Tutor',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildHomeTab(user) {
    final greeting = _getGreeting();

    return CustomScrollView(
      slivers: [
        SliverAppBar.large(
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                greeting,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.normal),
              ),
              Text(
                user.name,
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.all(16),
          sliver: SliverList(
            delegate: SliverChildListDelegate([
              // Streak & XP Card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildStatItem(
                        icon: Icons.local_fire_department,
                        label: 'Streak',
                        value: '${user.streak} days',
                        color: Colors.orange,
                      ),
                      _buildStatItem(
                        icon: Icons.stars,
                        label: 'Level',
                        value: '${user.level}',
                        color: Colors.purple,
                      ),
                      _buildStatItem(
                        icon: Icons.bolt,
                        label: 'XP',
                        value: '${user.xp}',
                        color: Colors.blue,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Today's Plan
              Text(
                'Today\'s Plan',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 12),
              Card(
                child: ListTile(
                  leading: const CircleAvatar(
                    child: Icon(Icons.library_books),
                  ),
                  title: const Text('Review Flashcards'),
                  subtitle: const Text('15 cards due today'),
                  trailing: const Icon(Icons.arrow_forward_ios),
                  onTap: () => context.push('/flashcards/review'),
                ),
              ),
              const SizedBox(height: 8),
              Card(
                child: ListTile(
                  leading: const CircleAvatar(
                    child: Icon(Icons.quiz),
                  ),
                  title: const Text('Practice Quiz'),
                  subtitle: const Text('Biology - Cells'),
                  trailing: const Icon(Icons.arrow_forward_ios),
                  onTap: () {},
                ),
              ),
              const SizedBox(height: 16),

              // Quick Actions
              Text(
                'Quick Actions',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: Card(
                      child: InkWell(
                        onTap: () => context.push('/subjects'),
                        child: const Padding(
                          padding: EdgeInsets.all(20),
                          child: Column(
                            children: [
                              Icon(Icons.add_circle_outline, size: 32),
                              SizedBox(height: 8),
                              Text('New Subject'),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Card(
                      child: InkWell(
                        onTap: () {},
                        child: const Padding(
                          padding: EdgeInsets.all(20),
                          child: Column(
                            children: [
                              Icon(Icons.edit_note, size: 32),
                              SizedBox(height: 8),
                              Text('Paste Notes'),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ]),
          ),
        ),
      ],
    );
  }

  Widget _buildStudyTab() {
    return const Center(child: Text('Study Tab - Subject List'));
  }

  Widget _buildTutorTab() {
    return const Center(child: Text('AI Tutor Tab'));
  }

  Widget _buildProfileTab(user) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 50,
            child: Text(
              user.name[0].toUpperCase(),
              style: const TextStyle(fontSize: 32),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            user.name,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          Text(user.email),
          const SizedBox(height: 8),
          Chip(
            label: Text(user.plan),
            backgroundColor: user.isPro ? Colors.amber : Colors.grey[300],
          ),
          const SizedBox(height: 32),
          ElevatedButton(
            onPressed: () {
              ref.read(authProvider.notifier).logout();
            },
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Column(
      children: [
        Icon(icon, color: color, size: 32),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        Text(
          label,
          style: TextStyle(fontSize: 12, color: Colors.grey[600]),
        ),
      ],
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }
}
