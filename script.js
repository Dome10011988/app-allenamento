document.addEventListener('DOMContentLoaded', () => {
  // Greeting utente
  let name = localStorage.getItem('ft_name');
  if (!name) {
    name = prompt('Come ti chiami?') || 'Amico';
    localStorage.setItem('ft_name', name);
  }
  document.getElementById('user-greeting').textContent = `Ciao, ${name}!`;

  // T// Toggle tema e saluto utente
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const current = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', current);
  toggle.textContent = current === 'light' ? '🌙' : '☀️';
  toggle.onclick = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.textContent = next === 'light' ? '🌙' : '☀️';
    showToast('Tema cambiato su ' + next);
  };

  const user = localStorage.getItem('userName') || 'Utente';
  const greet = document.getElementById('user-greeting');
  greet.textContent = 'Benvenuto, ' + user + '!';
});

function showToast(msg) {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
