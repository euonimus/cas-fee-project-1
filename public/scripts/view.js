export default class View {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.taskListElement = document.querySelector("#task_list");

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

  getHTML(tasksArray) {
      return (tasksArray.length === 0) ? `<div class="show_task"><p>Es sind keine Tasks zum Anzeigen vorhanden</p></div>`
          : tasksArray.map(task => `<div class="show_task">
              <div>${this.HTMLdueDate(task.dueDate)}</div>
              <div>${task.title}</div>
              <div>${task.importance}</div>
              <div class="task_edit"><button id="${task.id}" class="btn" data-list-btn-edit>Bearbeiten</button></div>
              <div>${this.HTMLfinished(task)}
            </div>
            <div class="task-desc"><textarea readonly rows="4">${task.descr}</textarea>
            </div>            
          </div>`)
          .join("");
  }

  HTMLfinished(task) {
    return (task.finished)
    ? `<label><input id="${task.id}" type="checkbox" checked data-list-btn-finish/>erledigt</label>`
    : `<label><input id="${task.id}" type="checkbox" data-list-btn-finish/>noch nicht abgeschlossen</label>`;
  }

  HTMLdueDate(dueDate) {
    //https://momentjs.com/docs/#/displaying/difference/
    switch(moment(dueDate).diff(moment(), 'days')) { //TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      case 0, 1: return "in den nächsten 24h";
      case 2: return "übermorgen";
      case 3, 4, 5, 6, 7: return "in den nächsten 7 Tagen fällig";
      default: return "erst sehr spät fällig";
    }
  }

  showTasks(Array = this.taskManager.getAllTasks()) {
    this.taskListElement.innerHTML = this.getHTML(Array);
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
}