// Global variables
let currentUser = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (simple check for demo)
    const userId = localStorage.getItem('userId');
    if (userId && !document.getElementById('login-form')) {
        currentUser = userId;
        if (document.getElementById('current-balance')) {
            loadDashboardData();
        }
    }
    
    // Auth form toggling
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (showRegister && showLogin) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
        
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
    
    // Login form submission
    const loginFormElement = document.getElementById('login');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('userId', data.userId);
                    window.location.href = '/dashboard';
                } else {
                    alert('Login failed: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Login failed. Please try again.');
            });
        });
    }
    
    // Register form submission
    const registerFormElement = document.getElementById('register');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registration successful! Please login.');
                    document.getElementById('show-login').click();
                } else {
                    alert('Registration failed: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Registration failed. Please try again.');
            });
        });
    }
    
    // Watch ad button
    const watchAdBtn = document.getElementById('watch-ad-btn');
    if (watchAdBtn) {
        watchAdBtn.addEventListener('click', function() {
            watchAdBtn.disabled = true;
            watchAdBtn.textContent = 'Loading Ad...';
            
            // Simulate ad loading
            setTimeout(() => {
                document.getElementById('ad-display').innerHTML = `
                    <h3>Sample Advertisement</h3>
                    <p>This is where an actual ad would display.</p>
                    <p>Please watch the ad for 30 seconds...</p>
                    <div class="countdown">30</div>
                `;
                
                let countdown = 30;
                const countdownElement = document.querySelector('.countdown');
                const countdownInterval = setInterval(() => {
                    countdown--;
                    countdownElement.textContent = countdown;
                    
                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        completeAdView();
                    }
                }, 1000);
            }, 1500);
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('userId');
            window.location.href = '/';
        });
    }
});

function completeAdView() {
    fetch(`/api/watch-ad/${currentUser}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('ad-display').innerHTML = `
                <p>Thank you for watching the ad!</p>
            `;
            
            document.getElementById('earned-amount').textContent = data.earnings.toFixed(2);
            document.getElementById('new-balance').textContent = data.newBalance.toFixed(2);
            document.getElementById('earnings-message').style.display = 'block';
            
            const watchAdBtn = document.getElementById('watch-ad-btn');
            watchAdBtn.disabled = false;
            watchAdBtn.textContent = 'Watch Ad & Earn Money';
            
            // Update dashboard if on that page
            if (document.getElementById('current-balance')) {
                loadDashboardData();
            }
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

function loadDashboardData() {
    fetch(`/api/user/${currentUser}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('current-balance').textContent = data.balance.toFixed(2);
            document.getElementById('ads-watched').textContent = data.adsWatched;
            document.getElementById('estimated-earnings').textContent = (data.adsWatched * 0.55 * 30).toFixed(2); // Rough estimate
            
            // Simulate recent activity
            const activityList = document.getElementById('activity-list');
            activityList.innerHTML = '';
            
            for (let i = 0; i < 5; i++) {
                const li = document.createElement('li');
                li.textContent = `Earned $${(Math.random() * 0.9 + 0.1).toFixed(2)} from watching an ad`;
                activityList.appendChild(li);
            }
        }
    })
    .catch(error => {
        console.error('Error loading dashboard data:', error);
    });
}