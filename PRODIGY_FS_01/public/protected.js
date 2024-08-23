document.getElementById('logout-button').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

window.onload = function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
};
