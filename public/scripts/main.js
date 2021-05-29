// theme click
document.querySelector('[data-list-btn-theme]').addEventListener('change', () => ((document.querySelector('[data-list-btn-theme]').value === 'dark-theme')
    ? document.body.classList.add('dark-theme')
    : document.body.classList.remove('dark-theme')));
