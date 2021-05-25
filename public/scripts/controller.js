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
view.elementIdThemeButton.addEventListener('change', () => (view.elementIdThemeButton.value === "dark-theme") ? document.body.classList.add("dark-theme") : document.body.classList.remove("dark-theme"));

//popup clicks
view.elementBtnNew.addEventListener('click', () => viewPopup.showPopup(true));
view.elementPopupBtnCancle.addEventListener('click', () => viewPopup.showPopup(false));
view.elementPopupBtnCancle.addEventListener('click', () => viewPopup.showPopup(false));

view.updateView();

viewPopup.elementPopupImportance1.addEventListener('click', () => viewPopup.updateAndDisplayImportance(1));
viewPopup.elementPopupImportance2.addEventListener('click', () => viewPopup.updateAndDisplayImportance(2));
viewPopup.elementPopupImportance3.addEventListener('click', () => viewPopup.updateAndDisplayImportance(3));
viewPopup.elementPopupImportance4.addEventListener('click', () => viewPopup.updateAndDisplayImportance(4));
viewPopup.elementPopupImportance5.addEventListener('click', () => viewPopup.updateAndDisplayImportance(5));

view.elementPopupBtnSave.addEventListener('click', () => {
  viewPopup.showPopup(false);
  viewPopup.mapData();
  taskManager.editTask(viewPopup.task);

  view.updateView();
});

view.elementPopupBtnDelete.addEventListener('click', () => {
  viewPopup.showPopup(false);
  taskManager.deleteTask(viewPopup.task);

  view.updateView();
});