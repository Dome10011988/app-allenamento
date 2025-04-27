document.addEventListener('DOMContentLoaded', () => {
  // Greeting utente
  let name = localStorage.getItem('ft_name');
  if (!name) {
    name = prompt('Come ti chiami?') || 'Amico';
    localStorage.setItem('ft_name', name);
  }
  document.getElementById('user-greeting').textContent = `Ciao, ${name}!`;

  // Toggle tema
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('ft_theme') || 'light';
  root.setAttribute('data-theme', saved);
  toggle.textContent = saved === 'light' ? '🌙' : '🌞';
  toggle.onclick = () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ft_theme', next);
    toggle.textContent = next === 'light' ? '🌙' : '🌞';
    showToast(`Tema ${next === 'light' ? 'chiaro' : 'scuro'} attivato`);
  };

  // Funzione toast
  window.showToast = (msg, duration = 3000) => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hide');
      toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
  };
});

  });
});
