// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// App State
let currentUser = null;
let authToken = null;
let currentSubjects = [];
let currentFlashcards = [];
let currentFlashcardIndex = 0;
let showingAnswer = false;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check for stored auth token
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        authToken = storedToken;
        loadUserData();
    }

    // Setup form handlers
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('create-subject-form').addEventListener('submit', handleCreateSubject);
});

// Navigation functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showLogin() {
    showScreen('login-screen');
}

function showSignup() {
    showScreen('signup-screen');
}

function showHome() {
    showScreen('home-screen');
    loadSubjects();
}

function showCreateSubject() {
    showScreen('create-subject-screen');
}

function showFlashcardReview() {
    showScreen('flashcard-screen');
    loadFlashcards();
}

// Auth functions
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            showError('login-error', error.message || 'Login failed');
            return;
        }

        const data = await response.json();
        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('authToken', authToken);

        showHome();
    } catch (error) {
        showError('login-error', 'Network error. Please try again.');
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            showError('signup-error', error.message || 'Signup failed');
            return;
        }

        const data = await response.json();
        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('authToken', authToken);

        showHome();
    } catch (error) {
        showError('signup-error', 'Network error. Please try again.');
    }
}

async function loadUserData() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            logout();
            return;
        }

        currentUser = await response.json();
        updateUserDisplay();
        showHome();
    } catch (error) {
        logout();
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    showLogin();
}

function updateUserDisplay() {
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-streak').textContent = currentUser.streak;
        document.getElementById('user-level').textContent = currentUser.level;
        document.getElementById('user-xp').textContent = currentUser.xp;
    }
}

// Subject functions
async function loadSubjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/subjects`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) return;

        currentSubjects = await response.json();
        displaySubjects();
    } catch (error) {
        console.error('Failed to load subjects:', error);
    }
}

function displaySubjects() {
    const container = document.getElementById('subjects-list');

    if (currentSubjects.length === 0) {
        container.innerHTML = '<p style="color: #6b7280;">No subjects yet. Create one to get started!</p>';
        return;
    }

    container.innerHTML = currentSubjects.map(subject => `
        <div class="list-item">
            <h3 style="color: ${subject.color || '#6366f1'}">${subject.name}</h3>
            <p>${subject.description || 'No description'}</p>
        </div>
    `).join('');
}

async function handleCreateSubject(e) {
    e.preventDefault();

    const name = document.getElementById('subject-name').value;
    const description = document.getElementById('subject-description').value;

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    try {
        const response = await fetch(`${API_BASE_URL}/subjects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, description, color })
        });

        if (!response.ok) {
            alert('Failed to create subject');
            return;
        }

        document.getElementById('subject-name').value = '';
        document.getElementById('subject-description').value = '';

        showHome();
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

// Flashcard functions
async function loadFlashcards() {
    try {
        // First, let's create some demo flashcards if none exist
        const response = await fetch(`${API_BASE_URL}/flashcards/due`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) return;

        currentFlashcards = await response.json();

        // Create demo flashcards if empty
        if (currentFlashcards.length === 0 && currentSubjects.length > 0) {
            await createDemoFlashcards();
            const response2 = await fetch(`${API_BASE_URL}/flashcards/due`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            currentFlashcards = await response2.json();
        }

        currentFlashcardIndex = 0;
        showingAnswer = false;

        if (currentFlashcards.length === 0) {
            document.getElementById('flashcard-text').textContent =
                'No flashcards available. Create a subject and some flashcards first!';
            document.getElementById('flashcard-label').textContent = '';
            return;
        }

        displayCurrentFlashcard();
    } catch (error) {
        console.error('Failed to load flashcards:', error);
    }
}

async function createDemoFlashcards() {
    const demoCards = [
        { front: 'What is the powerhouse of the cell?', back: 'Mitochondria - produces ATP through cellular respiration' },
        { front: 'What is DNA?', back: 'Deoxyribonucleic acid - carries genetic information' },
        { front: 'What is photosynthesis?', back: 'The process where plants convert light energy into chemical energy using sunlight, water, and CO2' }
    ];

    if (currentSubjects.length === 0) return;

    for (const card of demoCards) {
        await fetch(`${API_BASE_URL}/flashcards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                subjectId: currentSubjects[0].id,
                front: card.front,
                back: card.back,
                difficulty: 'MEDIUM'
            })
        });
    }
}

function displayCurrentFlashcard() {
    if (currentFlashcardIndex >= currentFlashcards.length) {
        document.getElementById('flashcard-text').textContent =
            '🎉 Review complete! You earned XP! Click "Back to Home" to continue.';
        document.getElementById('flashcard-label').textContent = '';
        document.getElementById('rating-section').style.display = 'none';
        return;
    }

    const card = currentFlashcards[currentFlashcardIndex];
    showingAnswer = false;

    document.getElementById('flashcard-label').textContent = 'Question';
    document.getElementById('flashcard-text').textContent = card.front;
    document.getElementById('rating-section').style.display = 'none';
}

function flipCard() {
    if (currentFlashcardIndex >= currentFlashcards.length) return;

    const card = currentFlashcards[currentFlashcardIndex];

    if (!showingAnswer) {
        showingAnswer = true;
        document.getElementById('flashcard-label').textContent = 'Answer';
        document.getElementById('flashcard-text').textContent = card.back;
        document.getElementById('rating-section').style.display = 'block';
    }
}

async function rate(quality) {
    if (currentFlashcardIndex >= currentFlashcards.length) return;

    const card = currentFlashcards[currentFlashcardIndex];

    try {
        const response = await fetch(`${API_BASE_URL}/flashcards/${card.id}/review`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ quality })
        });

        if (response.ok) {
            const result = await response.json();
            // Update user XP
            if (currentUser) {
                currentUser.xp += result.xpGained || 10;
                updateUserDisplay();
            }
        }
    } catch (error) {
        console.error('Failed to submit rating:', error);
    }

    // Move to next card
    currentFlashcardIndex++;
    displayCurrentFlashcard();
}

// Utility functions
function showError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    errorDiv.innerHTML = `<div class="error">${message}</div>`;
    setTimeout(() => {
        errorDiv.innerHTML = '';
    }, 5000);
}

function showSuccess(elementId, message) {
    const successDiv = document.getElementById(elementId);
    successDiv.innerHTML = `<div class="success">${message}</div>`;
    setTimeout(() => {
        successDiv.innerHTML = '';
    }, 5000);
}
