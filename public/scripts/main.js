
function changeTheme() {
  if (document.getElementById("theme-button").value === "dark-theme") {
    document.body.classList.toggle("dark-theme", true);
  } else {
    document.body.classList.toggle("dark-theme", false);
  }
}

function sortList(id) {
  if (document.getElementById(id).classList.contains("current")) {
    //if already set > unset
    id = undefined;
  }  

  document.getElementById("by_finished").classList.toggle("current", false);
  document.getElementById("by_created").classList.toggle("current", false);
  document.getElementById("by_importance").classList.toggle("current", false);

  switch(id) {
    case 'by_finished':
      break;
    case 'by_created':
      break;
    case 'by_importance':
      break;
    default:
      return;
  }

  document.getElementById(id).classList.toggle("current", true);
}