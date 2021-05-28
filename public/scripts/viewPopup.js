import {Task} from "./services/task.js";

export class ViewPopup {
  constructor(taskService, taskController) {
    this.taskController    = taskController;
    this.taskService       = taskService;
    this.tmp_importance    = undefined;
    this.taskListElement   = document.querySelector("#task_list");
    this.popup             = document.querySelector('[data-popup]');    
    this.elementH2         = document.querySelector('[data-popup-h2]');
    this.elementTitle      = document.querySelector('[data-popup-title]');
    this.elementDescr      = document.querySelector('[data-popup-descr]');
    this.elementDueDate    = document.querySelector('[data-popup-duedate]');
    this.elementFinish     = document.querySelector('[data-popup-finish]');
    this.elementCreateDate = document.querySelector('[data-popup-createdate]');
    
    this.elementPopupImportanceAll = document.querySelectorAll('.importance span');
    this.elementPopupImportance1 = document.querySelector('[data-popup-importance1]');
    this.elementPopupImportance2 = document.querySelector('[data-popup-importance2]');
    this.elementPopupImportance3 = document.querySelector('[data-popup-importance3]');
    this.elementPopupImportance4 = document.querySelector('[data-popup-importance4]');
    this.elementPopupImportance5 = document.querySelector('[data-popup-importance5]');

    this.elementPopupBtnSave    = document.querySelector("[data-popup-btn-save]");
    this.elementPopupBtnCancle  = document.querySelector("[data-popup-btn-cancle]"); 
    this.elementPopupBtnDelete  = document.querySelector("[data-popup-btn-delete]");

    this.initEventHandlers();
  }
  
  initEventHandlers() {
    this.elementPopupBtnCancle.addEventListener('click', () => this.showPopup(false));
    this.elementPopupBtnCancle.addEventListener('click', () => this.showPopup(false));

    this.elementPopupImportance1.addEventListener('click', () => this.updateAndDisplayImportance(1));
    this.elementPopupImportance2.addEventListener('click', () => this.updateAndDisplayImportance(2));
    this.elementPopupImportance3.addEventListener('click', () => this.updateAndDisplayImportance(3));
    this.elementPopupImportance4.addEventListener('click', () => this.updateAndDisplayImportance(4));
    this.elementPopupImportance5.addEventListener('click', () => this.updateAndDisplayImportance(5));

    this.elementPopupBtnSave.addEventListener('click', () => {
       this.showPopup(false);
       this.mapData();
       this.taskService.editTask(this.task);

       this.taskController.showTaskList();
    });

    this.elementPopupBtnDelete.addEventListener('click', () => {
       this.showPopup(false);
       this.taskService.deleteTask(this.task);

       this.taskController.showTaskList();
    });
  }

  showPopup(display, id = 0) {
    if (display) {
      this.popup.classList.add("popup-visible");
      if (id > 0) {
        this.elementH2.innerHTML = "Bearbeite diesen Task";
        this.task = this.taskService.getTask(id)        
      } else {
        this.elementH2.innerHTML = "Erstelle einen neuen Task";
        this.task = new Task(this.taskService.getNextId());
      }
      this.elementTitle.value   = this.task.title;
      this.elementDescr.value   = this.task.descr;
      this.elementDueDate.value = moment(this.task.dueDate).format("YYYY-MM-DD");
      this.elementFinish.checked = this.task.finish;
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
    this.task.finish = this.elementFinish.checked;
    this.task.importance = this.tmp_importance;
  }

  updateAndDisplayImportance(importance) {
    this.tmp_importance = importance;
    this.elementPopupImportanceAll.forEach((element, index) => (index < importance) ? element.classList.add("choice") : element.classList.remove("choice"));
  }
}