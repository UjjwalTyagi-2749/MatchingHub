document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
   if (!form) return console.error("Signup form not found");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (password !== confirmPassword) {
      return alert('Passwords do not match');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password,
        confirmPassword
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username);

      window.location.href = "Main.html"

    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Signup failed');
    }
  });
});
