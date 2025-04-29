// === Tema chiaro/scuro ===
const themeToggle = document.getElementById('theme-toggle');

function setTheme(mode) {
  if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

// Imposta tema salvato
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
}

// === Nome Utente ===
function chiediNomeUtente() {
  let nome = prompt("Come ti chiami?");
  if (nome) {
    localStorage.setItem('nomeUtente', nome.trim());
    mostraNomeUtente();
  }
}

function mostraNomeUtente() {
  const nomeSalvato = localStorage.getItem('nomeUtente');
  const userGreeting = document.getElementById('user-greeting');
  if (nomeSalvato && userGreeting) {
    userGreeting.innerText = `👋 Benvenuto, ${nomeSalvato}!`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  mostraNomeUtente();
  const changeButton = document.getElementById('change-user-button');
  if (changeButton) {
    changeButton.addEventListener('click', chiediNomeUtente);
  }
});

// === Service Worker (già incluso nell'index.html, backup qui se serve) ===
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('sw.js')
//       .then(() => console.log('Service Worker registrato'))
//       .catch(err => console.error('Errore Service Worker:', err));
//   });
// }
