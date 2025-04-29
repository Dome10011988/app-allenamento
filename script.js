// Tema chiaro/scuro
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}

// Gestione del nome utente nella Home
const userGreeting = document.getElementById('user-greeting');
if (userGreeting) {
  let nomeUtente = localStorage.getItem('nomeUtente');

  if (!nomeUtente) {
    nomeUtente = prompt("Inserisci il tuo nome:");
    if (nomeUtente) {
      localStorage.setItem('nomeUtente', nomeUtente);
    }
  }

  if (nomeUtente) {
    userGreeting.textContent = `Ciao, ${nomeUtente}! 👋`;
  }
}

// Toast automatico
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (container) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      container.removeChild(toast);
    }, 3000);
  }
}

// Controlla aggiornamenti Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(registration => {
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showToast("🔄 Nuova versione disponibile. Aggiorna la pagina!");
        }
      };
    };
  }).catch(err => console.error('Service Worker registration failed:', err));
}
