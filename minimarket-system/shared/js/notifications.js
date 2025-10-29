// Notificaciones simples
window.Notifications = (function() {
  const containerId = 'notifications';
  const ensureContainer = () => {
    if (!document.getElementById(containerId)) {
      const el = document.createElement('div');
      el.id = containerId;
      el.style.position = 'fixed';
      el.style.top = '16px'; el.style.right = '16px';
      el.style.zIndex = '9999';
      document.body.appendChild(el);
    }
  };

  const show = (message, type = 'info', timeout = 3000) => {
    ensureContainer();
    const div = document.createElement('div');
    div.className = `alert alert-${type}`;
    div.textContent = message;
    document.getElementById(containerId).appendChild(div);
    setTimeout(() => div.remove(), timeout);
  };

  return { show };
})();