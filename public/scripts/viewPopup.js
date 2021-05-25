import Task from "./task.js";

export default class ViewPopup {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.task = new Task();
    this.tmp_importance = this.task.importance;
    this.taskListElement = document.querySelector("#task_list");
    this.popup = document.querySelector('[data-popup]');    
    this.elementH2         = document.querySelector('[data-popup-h2]');
    this.elementTitle      = document.querySelector('[data-popup-title]');
    this.elementDescr      = document.querySelector('[data-popup-descr]');
    this.elementDueDate    = document.querySelector('[data-popup-duedate]');
    this.elementFinished   = document.querySelector('[data-popup-finished]');
    this.elementCreateDate = document.querySelector('[data-popup-createdate]');
    
    this.elementPopupImportanceAll = document.querySelectorAll('.importance span');
    this.elementPopupImportance1 = document.querySelector('[data-popup-importance1]');
    this.elementPopupImportance2 = document.querySelector('[data-popup-importance2]');
    this.elementPopupImportance3 = document.querySelector('[data-popup-importance3]');
    this.elementPopupImportance4 = document.querySelector('[data-popup-importance4]');
    this.elementPopupImportance5 = document.querySelector('[data-popup-importance5]');
  }
  
  showPopup(display, id = 0) {
    if (display) {
      this.popup.classList.add("popup-visible");
      if (id > 0) {
        this.elementH2.innerHTML = "Bearbeite diesen Task";
        this.task = this.taskManager.getTask(id)
      } else {
        this.elementH2.innerHTML = "Erstelle einen neuen Task";
        this.task = new Task(this.taskManager.getNextId());
      }
      this.elementTitle.value   = this.task.title;
      this.elementDescr.value   = this.task.descr;
      this.elementDueDate.value = moment(this.task.dueDate).format("YYYY-MM-DD");
      this.elementFinished.checked = this.task.finished;
      this.elementCreateDate.innerHTML = moment(this.task.createDate).format("DD.MM.YYYY");
      this.updateAndDisplayImportance(this.task.importance);
    } else {
      this.popup.classList.remove("popup-visible");
    }
  }

  mapData() {
    this.task.title = this.elementTitle.value;
    this.task.descr = this.elementDescr.value;
    this.task.dueDate = this.elementDueDate.valueAsDate; 
    this.task.finished = this.elementFinished.checked;
    this.task.importance = this.tmp_importance;
  }

  updateAndDisplayImportance(importance) {
    this.tmp_importance = importance;
    this.elementPopupImportanceAll.forEach((element, index) => (index < importance) ? element.classList.add("choice") : element.classList.remove("choice"));
  }
}