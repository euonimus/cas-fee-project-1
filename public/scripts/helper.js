/* Cookie */
function setCookie(name, value) {
  const expires = moment().add(2, 'days').toDate();
  document.cookie = name + '=' + value + ';expires=' + expires.toUTCString();
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
        setCookie('theme', 'dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
        setCookie('theme', 'white-theme');
    }
    document.querySelector('[data-list-btn-theme]').value = theme; //necessary for setting the dropdown in case of page switching and load from cookie    
}

function giveDate(delay = 0, type = 'days') {
    return moment().add(delay, type).format('YYYY-MM-DD');
}

setTheme(getCookie('theme'));
