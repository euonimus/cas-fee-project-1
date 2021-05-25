export default class View {
  constructor(taskManager, viewPopup) {
    this.taskManager = taskManager;
    this.viewPopup = viewPopup;
    this.elementTaskList = document.querySelector("#task_list");

    //cons ElemendIds
    this.elementIdFinished    = document.getElementById("by_finished");
    this.elementIdCreateDate  = document.getElementById("by_createDate");
    this.elementIdDueDate     = document.getElementById("by_dueDate");    
    this.elementIdImportance  = document.getElementById("by_importance");
    this.elementIdThemeButton = document.getElementById("theme_button");
    this.elementIdPopupOpen   = document.getElementById("popupOpen");
    this.elementIdPopupEdit   = document.getElementById("popupEdit");
    this.elementIdPopupCancle = document.getElementById("popupCancle");
    this.elementIdPopupSave   = document.getElementById("popupSave");
    this.elementIdPopupDelete = document.getElementById("popupDelete");    
  }

  HTMLfinished(task) {
    return (task.finished)
    ? `<label><input id="${task.id}" type="checkbox" checked data-list-btn-finish/>erledigt</label>`
    : `<label><input id="${task.id}" type="checkbox" data-list-btn-finish/>noch nicht abgeschlossen</label>`;
  }

  HTMLdueDate(dueDate) {
    let dueDiff = moment.duration(moment(dueDate).diff(moment().startOf('day'))).asDays();
    let stringDate = moment(dueDate).format("DD.MM.YYYY")

    if (dueDiff < -1) {
      return "überfällig seit " + Math.abs(Math.round(dueDiff)) + " Tagen";
    } else if (dueDiff < 0) {
      return "überfällig seit gestern";
    } else if (dueDiff < 1) {
      return "heute fällig";
    } else if (dueDiff < 2) {
      return "morgen fällig";
    } else if (dueDiff < 5) {
      return "demnächst fällig am " + stringDate;
    } else {
      return "erst fällig am " + stringDate;
    }
  }

  showTasks(taskArray = this.taskManager.getAllTasks()) {
    this.elementTaskList.innerHTML = "";
    if (taskArray.length === 0) {
        const newTask = document.createElement("div");
        newTask.classList.add("show_task");
        newTask.innerHTML = "<p>Es sind keine Tasks zum Anzeigen vorhanden";
    } else {
      taskArray.forEach((task) => {
        const newTask = document.createElement("div");
        newTask.classList.add("show_task");
        newTask.innerHTML = 
            `<div>${this.HTMLdueDate(task.dueDate)}</div>
              <div>${task.title}</div>
              <div>${task.importance}</div>
              <div class="task_edit"><button id="${task.id}" class="btn" data-list-btn-edit>Bearbeiten</button></div>
              <div>${this.HTMLfinished(task)}
            </div>
            <div class="task-desc"><textarea readonly rows="4">${task.descr}</textarea>
            </div>`;
        this.registerTaskEventHandlers(newTask, task.id);
        this.elementTaskList.appendChild(newTask);
      })
    }
  }

  sortTasks(elementId) {
    if (elementId.classList.contains("current")) {
      //if already set > do unset
      elementId = undefined;
    }  

    this.elementIdFinished.classList.toggle("current", false);
    this.elementIdCreateDate.classList.toggle("current", false);
    this.elementIdDueDate.classList.toggle("current", false);        
    this.elementIdImportance.classList.toggle("current", false);
    
    switch(elementId) {
      case this.elementIdFinished:
        this.showTasks(this.taskManager.getOnlyFinished());
        break;
      case this.elementIdCreateDate:
        this.showTasks(this.taskManager.getSortedByCreateDate());
        break;
      case this.elementIdDueDate:
        this.showTasks(this.taskManager.getSortedByDueDate());
        break;
      case this.elementIdImportance:
        this.showTasks(this.taskManager.getSortedByImportance())
        break;
      default:
        this.showTasks();
        return;
    }

    elementId.classList.toggle("current", true);
  }

  registerTaskEventHandlers(newTask, taskId) {
    //register event listener for task
    newTask.querySelector('[data-list-btn-edit]').addEventListener('click', () => this.viewPopup.showPopup(true, taskId));

    newTask.querySelector('[data-list-btn-finish]').addEventListener('click', () => {
      this.taskManager.changeFinished(taskId);
      this.showTasks();
    });  
  }
}