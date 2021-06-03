/* Cookie */
function setCookie(name, value, expdays) {
  const expires = moment().add(2, "days").add(2, "hours" /* UTC to CET */).toDate();
  document.cookie = name + "=" + value + ";expires="+ expires.toUTCString();
}

 function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

/*  theme */
document.querySelector('[data-list-btn-theme]').addEventListener('change', () => setTheme(document.querySelector('[data-list-btn-theme]').value));

function setTheme(theme = 'white-theme') {
    if (theme === 'dark-theme') {
        document.body.classList.add('dark-theme');
        setCookie("theme", "dark-theme", 1);
    } else {
        document.body.classList.remove('dark-theme');
        setCookie("theme", "white-theme", 1);
    }
    document.querySelector('[data-list-btn-theme]').value = theme; //necessary for setting the dropdown in case of html switching and load from cookie    
}

setTheme(getCookie('theme'));
