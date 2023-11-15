let userData = JSON.parse(localStorage.getItem('userData')) || {};


const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    
    userData[username] = password;
    localStorage.setItem('userData', JSON.stringify(userData)); // Save data to local storage
    console.log('User signed up:', username);
    
    signupForm.reset();
});


const showLoginFormButton = document.getElementById('show-login-button');
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');

showLoginFormButton.addEventListener('click', function () {
    loginContainer.style.display = 'block';
    signupContainer.style.display = 'none'; 
});


const showSignupFormButton = document.getElementById('show-signup-button');
showSignupFormButton.addEventListener('click', function () {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block'; 
});


const loginForm = document.getElementById('login-form');
const loginStatus = document.getElementById('login-status');
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (userData.hasOwnProperty(username) && userData[username] === password) {
        loginStatus.textContent = 'Login successful.';
        
        setTimeout(function () {
            window.location.href = 'index.html'; 
        }, 500);
        
    } else {
        loginStatus.textContent = 'Login failed. Please check your credentials.';
    }
   
    loginForm.reset();
});