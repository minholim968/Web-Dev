// Global app state
let currentUser = null;
let users = [];
let posts = [];
let matches = [];
let messages = [];
let currentView = 'feed';

// Sample data
const samplePosts = [
    {
        id: 1,
        user: { name: 'Sarah Johnson', avatar: '🏆', skillLevel: 'Advanced' },
        content: 'Just won my first tournament match! The backhand practice is paying off 💪',
        image: '🎾🏆',
        likes: 23,
        comments: 5,
        timestamp: '2h ago',
        type: 'achievement'
    },
    {
        id: 2,
        user: { name: 'Mike Rodriguez', avatar: '🎯', skillLevel: 'Beginner' },
        content: 'Looking for practice partners in downtown area. Still working on my serve!',
        likes: 8,
        comments: 12,
        timestamp: '4h ago',
        type: 'looking_for_match'
    }
];

const sampleMatches = [
    {
        id: 1,
        name: 'David Kim',
        skillLevel: 'Intermediate',
        location: '2.3 miles away',
        avatar: '🎾',
        rating: 4.1,
        availability: 'Weekends',
        compatibility: 92
    },
    {
        id: 2,
        name: 'Lisa Park',
        skillLevel: 'Beginner-Intermediate',
        location: '1.8 miles away',
        avatar: '🏸',
        rating: 3.8,
        availability: 'Evenings',
        compatibility: 87
    },
    {
        id: 3,
        name: 'Carlos Rivera',
        skillLevel: 'Advanced',
        location: '3.1 miles away',
        avatar: '🏆',
        rating: 4.5,
        availability: 'Mornings',
        compatibility: 78
    }
];

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });

    // Forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
});

// Authentication Functions
function switchToRegister() {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
}

function switchToLogin() {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        showMainApp();
        clearLoginForm();
    } else {
        alert('Invalid email or password');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const skillLevel = document.getElementById('register-skill').value;
    const location = document.getElementById('register-location').value;
    const bio = document.getElementById('register-bio').value;
    
    // Get availability
    const availability = [];
    document.querySelectorAll('.checkbox-group input:checked').forEach(checkbox => {
        availability.push(checkbox.value);
    });
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        skillLevel,
        location,
        bio,
        availability,
        avatar: '🎾',
        rating: 0,
        matchesPlayed: 0,
        joinedDate: new Date().toLocaleDateString()
    };
    
    users.push(newUser);
    currentUser = newUser;
    showMainApp();
    clearRegisterForm();
}

function clearLoginForm() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

function clearRegisterForm() {
    document.getElementById('register-name').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm-password').value = '';
    document.getElementById('register-skill').value = 'Beginner';
    document.getElementById('register-location').value = '';
    document.getElementById('register-bio').value = '';
    document.querySelectorAll('.checkbox-group input').forEach(checkbox => {
        checkbox.checked = false;
    });
}

function showMainApp() {
    authScreen.classList.add('hidden');
    mainApp.classList.remove('hidden');
    
    // Update user name in navbar
    document.getElementById('user-name').textContent = currentUser.name;
    
    // Initialize data
    posts = [...samplePosts];
    matches = [...sampleMatches];
    messages = [];
    
    // Show initial view
    switchView('feed');
    updateProfile();
}

function logout() {
    currentUser = null;
    posts = [];
    matches = [];
    messages = [];
    
    mainApp.classList.add('hidden');
    authScreen.classList.remove('hidden');
    
    // Reset to login form
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
}

// Navigation
function switchView(view) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-view') === view) {
            item.classList.add('active');
        }
    });
    
    // Hide all views
    document.querySelectorAll('[id$="-view"]').forEach(viewEl => {
        viewEl.classList.add('hidden');
    });
    
    // Show selected view
    document.getElementById(view + '-view').classList.remove('hidden');
    
    currentView = view;
    
    // Update content based on view
    if (view === 'feed') {
        renderPosts();
    } else if (view === 'matches') {
        renderMatches();
    } else if (view === 'messages') {
        renderMessages();
    } else if (view === 'profile') {
        updateProfile();
    }
}

// Post Functions
function createPost() {
    const content = document.getElementById('new-post').value.trim();
    
    if (!content) return;
    
    const newPost = {
        id: posts.length + 1,
        user: {
            name: currentUser.name,
            avatar: currentUser.avatar,
            skillLevel: currentUser.skillLevel
        },
        content,
        likes: 0,
        comments: 0,
        timestamp: 'now',
        type: 'general'
    };
    
    posts.unshift(newPost);
    document.getElementById('new-post').value = '';
    renderPosts();
}

function renderPosts() {
    const container = document.getElementById('posts-container');
    const emptyState = document.getElementById('posts-empty');
    
    if (posts.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    container.innerHTML = posts.map(post => `
        <div class="post">
            <div class="post-header">
                <span class="user-avatar">${post.user.avatar}</span>
                <div class="post-user-info">
                    <h3>${post.user.name}</h3>
                    <div class="post-meta">
                        <span class="skill-badge">${post.user.skillLevel}</span>
                        <span class="post-time">${post.timestamp}</span>
                    </div>
                </div>
            </div>
            
            <div class="post-content">${post.content}</div>
            
            ${post.image ? `<div class="post-image">${post.image}</div>` : ''}
            
            <div class="post-engagement">
                <button class="engagement-btn" onclick="likePost(${post.id})">
                    ❤️ <span>${post.likes}</span>
                </button>
                <button class="engagement-btn">
                    💬 <span>${post.comments}</span>
                </button>
                <button class="engagement-btn">
                    🔄 Share
                </button>
            </div>
        </div>
    `).join('');
}

function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        renderPosts();
    }
}

// Matches Functions
function renderMatches() {
    const container = document.getElementById('matches-container');
    const emptyState = document.getElementById('matches-empty');
    
    if (matches.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    container.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="match-header">
                <span class="match-avatar">${match.avatar}</span>
                <div class="match-info">
                    <h3>${match.name}</h3>
                    <p class="match-location">${match.location}</p>
                </div>
                <div class="match-rating">
                    <div class="rating">
                        <span class="star">⭐</span>
                        <span>${match.rating}</span>
                    </div>
                    <div class="compatibility">${match.compatibility}% match</div>
                </div>
            </div>
            
            <div class="match-details">
                <div class="detail-row">
                    <span class="detail-label">Skill Level:</span>
                    <span class="detail-value">${match.skillLevel}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Available:</span>
                    <span class="detail-value">${match.availability}</span>
                </div>
            </div>
            
            <div class="match-actions">
                <button class="btn-connect" onclick="connectWithPlayer(${match.id})">Connect</button>
                <button class="btn-profile">View Profile</button>
            </div>
        </div>
    `).join('');
}

function connectWithPlayer(matchId) {
    const match = matches.find(m => m.id === matchId);
    if (match) {
        alert(`Connection request sent to ${match.name}!`);
        
        // Add to messages
        const newMessage = {
            id: messages.length + 1,
            user: { name: match.name, avatar: match.avatar },
            lastMessage: 'You sent a connection request',
            timestamp: 'now',
            unread: false
        };
        
        messages.unshift(newMessage);
    }
}

// Messages Functions
function renderMessages() {
    const container = document.getElementById('messages-container');
    const emptyState = document.getElementById('messages-empty');
    
    if (messages.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    container.innerHTML = messages.map(message => `
        <div class="message-item">
            <div class="message-content">
                <span class="user-avatar">${message.user.avatar}</span>
                <div class="message-user">
                    <h3>${message.user.name}</h3>
                    <p class="message-preview">${message.lastMessage}</p>
                </div>
                <div class="message-meta">
                    <span class="message-time">${message.timestamp}</span>
                    ${message.unread ? '<div class="unread-indicator"></div>' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Profile Functions
function updateProfile() {
    if (!currentUser) return;
    
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-location').textContent = currentUser.location;
    document.getElementById('profile-skill').textContent = currentUser.skillLevel;
    document.getElementById('profile-rating').textContent = currentUser.rating || 'Not rated';
    document.getElementById('profile-matches').textContent = currentUser.matchesPlayed;
    document.getElementById('profile-joined').textContent = currentUser.joinedDate;
    
    // Bio section
    const bioSection = document.getElementById('profile-bio-section');
    const bioElement = document.getElementById('profile-bio');
    
    if (currentUser.bio) {
        bioElement.textContent = currentUser.bio;
        bioSection.classList.remove('hidden');
    } else {
        bioSection.classList.add('hidden');
    }
    
    // Availability section
    const availabilitySection = document.getElementById('profile-availability-section');
    const availabilityTags = document.getElementById('profile-availability-tags');
    
    if (currentUser.availability && currentUser.availability.length > 0) {
        availabilityTags.innerHTML = currentUser.availability.map(time => 
            `<span class="availability-tag">${time}</span>`
        ).join('');
        availabilitySection.classList.remove('hidden');
    } else {
        availabilitySection.classList.add('hidden');
    }
}
