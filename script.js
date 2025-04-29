// === SCRIPT GESTIONE THEME TOGGLE, TOAST E STORAGE ===

// Toggle tema chiaro/scuro
const toggle = document.getElementById('theme-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.body.toggleAttribute('data-theme', 'dark');
    if (document.body.hasAttribute('data-theme')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.removeItem('theme');
    }
  });
}

// Ripristina tema salvato
if (localStorage.getItem('theme') === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
}

// Toast messaggi
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Gestione nome utente
const userGreeting = document.getElementById('user-greeting');
if (userGreeting) {
  const username = localStorage.getItem('username');
  if (username) {
    userGreeting.innerHTML = `Ciao, <strong>${username}</strong>! 👋`;
  } else {
    const nome = prompt('Inserisci il tuo nome:');
    if (nome) {
      localStorage.setItem('username', nome);
      userGreeting.innerHTML = `Ciao, <strong>${nome}</strong>! 👋`;
    }
  }
}
