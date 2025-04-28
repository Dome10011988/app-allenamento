// === Gestione Toggle Tema Chiaro/Scuro ===
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });

  // Imposta tema salvato
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// === Toast notification semplice ===
function showToast(message) {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// === Nome utente salvato ===
document.addEventListener('DOMContentLoaded', () => {
  const userGreeting = document.getElementById('user-greeting');
  const username = localStorage.getItem('username');
  if (username && userGreeting) {
    userGreeting.innerHTML = `Ciao, <strong>${username}</strong>!`;
  }
});

// === Service Worker Update (gestione aggiornamenti automatici) ===
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => {
      console.log('Service Worker registrato');

      reg.onupdatefound = () => {
        const installingWorker = reg.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              showToast('Aggiornamento disponibile! Ricarica la pagina.');
            }
          }
        };
      };
    })
    .catch(err => console.error('Errore Service Worker:', err));
}
