//theme click
document.getElementById("theme_button").addEventListener('change', () =>
    (document.getElementById("theme_button").value === "dark-theme")
    ? document.body.classList.add("dark-theme")
    : document.body.classList.remove("dark-theme"));      