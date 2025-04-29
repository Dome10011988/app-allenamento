const toggle = document.getElementById('theme-toggle');

toggle.addEventListener('click', () => {
  document.body.toggleAttribute('data-theme', 'dark');
  if (document.body.hasAttribute('data-theme')) {
    localStorage.setItem('theme', 'dark');
    toggle.textContent = '☀️';
  } else {
    localStorage.removeItem('theme');
    toggle.textContent = '🌙';
  }
});

window.addEventListener('load', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    toggle.textContent = '☀️';
  }
});
