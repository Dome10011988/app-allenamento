// On load, apply saved theme (default to light)
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  // Initialize toggle icon
  btn.textContent = savedTheme === 'light' ? '🌙' : '☀️';

  // Toggle theme on click
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.textContent = next === 'light' ? '🌙' : '☀️';
  });
});
