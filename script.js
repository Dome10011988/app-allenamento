// script.js

// Gestione toggle tema chiaro/scuro
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? '' : 'dark';
    localStorage.setItem('theme', document.body.dataset.theme || 'light');
  });

  // Carica tema salvato
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.dataset.theme = 'dark';
  }
}

// Gestione nome utente (se presente)
if (document.getElementById('user-greeting')) {
  const username = localStorage.getItem('username');
  if (username) {
    document.getElementById('user-greeting').textContent = `👋 Ciao ${username}!`;
  }
}

// Gestione inserimento nome utente
if (document.getElementById('username-form')) {
  document.getElementById('username-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('username-input').value.trim();
    if (nome) {
      localStorage.setItem('username', nome);
      location.reload();
    }
  });
}

// Funzione toast (messaggi popup)
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    container.removeChild(toast);
  }, 3000);
}
