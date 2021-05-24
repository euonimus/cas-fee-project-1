import Task from "./task.js";

export default class ViewPopup {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.taskListElement = document.querySelector("#task_list");
    this.popup = document.querySelector('[data-task-form]');
    this.task = new Task();
    this.elementTitle = document.querySelector('[data-task-form-title]');
    this.elementDescr = document.querySelector('[data-task-form-descr]');
    this.elementDueDate = document.querySelector('[data-task-form-duedate]');
    this.elementFinished = document.querySelector('[data-task-form-finished]');
  }
  
  showPopup(display, id = 0) {
    if (display) {
      this.popup.style.display = "block";
      this.task = (id > 0) ? this.taskManager.getTask(id) : new Task(this.taskManager.getNextId());
      this.elementTitle.value   = this.task.title;
      this.elementDescr.value   = this.task.descr;
      this.elementDueDate.value = this.task.dueDate.toISOString().substring(0, 10);
      this.elementFinished.checked = this.task.finished;
    } else {
      this.popup.style.display = "none";
    }
  }

  mapData() {
    this.task.title = this.elementTitle.value;
    this.task.descr = this.elementDescr.value;
    this.task.dueDate = this.elementDueDate.valueAsDate; 
    this.task.finished = this.elementFinished.checked;
  }
}