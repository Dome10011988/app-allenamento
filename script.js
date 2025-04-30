// === TEMA CHIARO/SCURO ===
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }
});

// === SALUTO E NOME UTENTE ===
document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('username');
  const greetingDiv = document.getElementById('user-greeting');

  const savedName = localStorage.getItem('username');

  if (nameInput && greetingDiv) {
    // Se esiste un nome già salvato
    if (savedName) {
      nameInput.value = savedName;
      greetingDiv.textContent = `👋 Benvenuto, ${savedName}!`;
    }

    // Aggiorna saluto al cambiamento del campo input
    nameInput.addEventListener('input', () => {
      localStorage.setItem('username', nameInput.value);
      greetingDiv.textContent = `👋 Benvenuto, ${nameInput.value}!`;
    });
  } else if (greetingDiv && savedName) {
    greetingDiv.textContent = `👋 Benvenuto, ${savedName}!`;
  }
});
