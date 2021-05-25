import Task from "./task.js";

export default class ViewPopup {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.task = new Task();
    this.taskListElement = document.querySelector("#task_list");
    this.popup = document.querySelector('[data-task-popup]');    
    this.elementH2         = document.querySelector('[data-task-popup-h2]');
    this.elementTitle      = document.querySelector('[data-task-popup-title]');
    this.elementDescr      = document.querySelector('[data-task-popup-descr]');
    this.elementDueDate    = document.querySelector('[data-task-popup-duedate]');
    this.elementFinished   = document.querySelector('[data-task-popup-finished]');
    this.elementCreateDate = document.querySelector('[data-task-popup-createdate]');    
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
    } else {
      this.popup.classList.remove("popup-visible");
    }
  }

  mapData() {
    this.task.title = this.elementTitle.value;
    this.task.descr = this.elementDescr.value;
    this.task.dueDate = this.elementDueDate.valueAsDate; 
    this.task.finished = this.elementFinished.checked;
  }
}