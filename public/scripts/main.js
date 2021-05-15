
function changeTheme() {
  if (document.getElementById("theme-button").value === "dark-theme") {
    document.body.classList.toggle("dark-theme", true);
  } else {
    document.body.classList.toggle("dark-theme", false);
  }
}