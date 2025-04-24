let deferredPrompt;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('install-btn').style.display = 'block';
});

document.getElementById('install-btn').addEventListener('click', () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(choice => {
    deferredPrompt = null;
  });
});
