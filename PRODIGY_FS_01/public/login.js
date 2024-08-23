document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          localStorage.setItem('token', data.token);
          window.location.href = 'protected.html';
      } else {
          alert('Login failed!');
      }
  })
  .catch(error => alert('Error: ' + error));
});
