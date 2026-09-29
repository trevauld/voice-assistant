// Apply the saved theme before the page paints, to avoid a flash of the wrong colors.
// No saved value means 'system': the page follows the device's light/dark setting.
(function () {
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();
