// script.js

// === Tema Chiaro/Scuro ===
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    localStorage.setItem('theme', document.documentElement.getAttribute('data-theme'));
  });

  // Imposta tema salvato
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// === Toast Notifiche ===
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// === Nome Utente ===
function updateUserGreeting() {
  const userGreeting = document.getElementById('user-greeting');
  const username = localStorage.getItem('username');
  if (userGreeting && username) {
    userGreeting.innerHTML = `👋 Ciao, <strong>${username}</strong>!`;
  }
}
updateUserGreeting();

// === Gestione nome utente iniziale ===
window.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('username')) {
    const username = prompt('Come ti chiami?')?.trim();
    if (username) {
      localStorage.setItem('username', username);
      updateUserGreeting();
      showToast(`Benvenuto/a ${username}!`);
    }
  }
});

// === Aggiornamento automatico Service Worker ===
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(registration => {
      console.log('Service Worker registrato:', registration);

      // Controlla se c'è un nuovo SW
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              showToast('Nuova versione disponibile! Aggiorna la pagina.');
            } else {
              console.log('App pronta offline.');
            }
          }
        };
      };
    })
    .catch(err => console.error('Errore Service Worker:', err));
}
