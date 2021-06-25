/* global moment */
/* eslint no-unused-vars: "off" */

/* Cookie */
function setCookie(name, value) {
  const expires = new Date();
  expires.setTime(expires.getTime() + 2 * 24 * 3600 * 1000); // 2 days in milliseconds
  document.cookie = name + '=' + value + ';expires=' + expires.toUTCString();
}

 function getCookieValue(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return (match) ? match[2] : 'white-theme';
}

/* theme */
function setTheme(theme) {
    if (theme === 'dark-theme') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    setCookie('theme', theme);
    document.querySelector('[data-list-btn-theme]').value = theme; // necessary for setting the dropdown in case of page switching and load from cookie
}

/* give formatted date with optional delay */
function giveDate(delay = 0, type = 'days') {
    return moment().add(delay, type).format('YYYY-MM-DD');
}

document.querySelector('[data-list-btn-theme]').addEventListener('change', () => setTheme(document.querySelector('[data-list-btn-theme]').value));
setTheme(getCookieValue('theme'));
