import TaskManager from './taskManager.js';
import View from './view.js';
import ViewPopup from './viewPopup.js';

const taskManager = new TaskManager();
const view = new View(taskManager);
const viewPopup = new ViewPopup(taskManager);

//sort clicks
view.elementIdFinished.addEventListener('click', () => {
  view.sortTasks(view.elementIdFinished);
  registerTaskEventHandlers();
});
view.elementIdCreateDate.addEventListener('click', () => {
  view.sortTasks(view.elementIdCreateDate);
  registerTaskEventHandlers();
});
view.elementIdDueDate.addEventListener('click', () => {
  view.sortTasks(view.elementIdDueDate);
  registerTaskEventHandlers();
});
view.elementIdImportance.addEventListener('click', () => {
  view.sortTasks(view.elementIdImportance);
  registerTaskEventHandlers();
});

//theme click
view.elementIdThemeButton.addEventListener('change', () => {
  document.body.classList.toggle("dark-theme").value = (view.elementIdThemeButton.value === "dark-theme") ? true : false;
});

//popup clicks
view.elementIdPopupOpen.addEventListener('click', () => viewPopup.showPopup(true));
view.elementIdPopupCancle.addEventListener('click', () => viewPopup.showPopup(false));

view.showTasks();
registerTaskEventHandlers();

view.elementIdPopupSave.addEventListener('click', () => {
  viewPopup.showPopup(false);
  viewPopup.mapData();
  taskManager.editTask(viewPopup.task);
  
  view.showTasks();
  registerTaskEventHandlers();
});

view.elementIdPopupDelete.addEventListener('click', () => {
  viewPopup.showPopup(false);
  taskManager.deleteTask(viewPopup.task);
  
  view.showTasks();
  registerTaskEventHandlers();
});

function registerTaskEventHandlers() {
  //register new Event Listener
  document.querySelectorAll('[data-list-btn-edit]').forEach((element) => element.addEventListener('click', () => {
    viewPopup.showPopup(true, element.id);
  }));

  document.querySelectorAll('[data-list-btn-finish]').forEach((element) => element.addEventListener('click', () => {
    taskManager.changeFinished(element.id);
    view.showTasks();
    registerTaskEventHandlers();
  }));  
}