import TaskManager from './taskManager.js';
import View from './view.js';
import ViewPopup from './viewPopup.js';

const taskManager = new TaskManager();
const viewPopup = new ViewPopup(taskManager);
const view = new View(taskManager, viewPopup);

//sort clicks
view.elementIdFinished.addEventListener('click', () => view.sortTasks(view.elementIdFinished));
view.elementIdCreateDate.addEventListener('click', () => view.sortTasks(view.elementIdCreateDate));
view.elementIdDueDate.addEventListener('click', () => view.sortTasks(view.elementIdDueDate));
view.elementIdImportance.addEventListener('click', () => view.sortTasks(view.elementIdImportance));

//theme click
view.elementIdThemeButton.addEventListener('change', () => document.body.classList.toggle("dark-theme").value = (view.elementIdThemeButton.value === "dark-theme") ? true : false);

//popup clicks
view.elementIdPopupOpen.addEventListener('click', () => viewPopup.showPopup(true));
view.elementIdPopupCancle.addEventListener('click', () => viewPopup.showPopup(false));

view.showTasks();

view.elementIdPopupSave.addEventListener('click', () => {
  viewPopup.showPopup(false);
  viewPopup.mapData();
  taskManager.editTask(viewPopup.task);

  view.showTasks();
});

view.elementIdPopupDelete.addEventListener('click', () => {
  viewPopup.showPopup(false);
  taskManager.deleteTask(viewPopup.task);
  
  view.showTasks();
});