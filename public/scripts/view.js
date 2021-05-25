export default class View {
  htmlTemplateNewTask = Handlebars.compile(
            `<div><span class='{{duedate.class}}'>{{duedate.text}}</span></div>
              <div>{{title}}</div>
              <div>{{importance}}</div>
              <div class="task_edit"><button id="{{id}}" class="btn" data-list-btn-edit>Bearbeiten</button></div>
              <div><label><input id="{{id}}" type="checkbox" {{checked}} data-list-btn-finish/>erledigt</label></div>
            <div class="task-desc"><textarea readonly rows="4">{{descr}}</textarea>
            </div>`);

  constructor(taskManager, viewPopup) {
    this.taskManager = taskManager;
    this.viewPopup = viewPopup;
    this.lastSortElementId = undefined;

    //cons ElemendIds
    this.elementIdTaskList    = document.querySelector("#task_list");
    this.elementIdFinished    = document.getElementById("by_finished");
    this.elementIdCreateDate  = document.getElementById("by_createDate");
    this.elementIdDueDate     = document.getElementById("by_dueDate");    
    this.elementIdImportance  = document.getElementById("by_importance");
    this.elementIdThemeButton = document.getElementById("theme_button");
    
    this.elementBtnNew         = document.querySelector("[data-list-btn-new]");
    this.elementBtnEdit        = document.querySelector("[data-list-btn-edit]");
    this.elementPopupBtnSave   = document.querySelector("[data-popup-btn-save]");
    this.elementPopupBtnCancle = document.querySelector("[data-popup-btn-cancle]");    
    this.elementPopupBtnDelete = document.querySelector("[data-popup-btn-delete]");    
  }

  HTMLdueDate(dueDate) {
    let dueDiff = moment.duration(moment(dueDate).diff(moment().startOf('day'))).asDays();
    let stringDate = moment(dueDate).format("DD.MM.YYYY")

    if (dueDiff < -1) {
      return {class: "dueDate-tolate", text: "überfällig seit " + Math.abs(Math.round(dueDiff)) + " Tagen"};
    } else if (dueDiff < 0) {
      return {class: "dueDate-tolate", text: "überfällig seit gestern"};
    } else if (dueDiff < 1) {
      return {class: "dueDate-short", text: "heute fällig"};
    } else if (dueDiff < 2) {
      return {class: "dueDate-short", text: "morgen fällig"};
    } else if (dueDiff < 5) {
      return {class: "dueDate-easy", text: "demnächst fällig am " + stringDate};
    } else {
      return {class: "dueDate-easy", text: "erst fällig am " + stringDate};
    }
  }

  updateView(elementId = this.lastSortElementId) {
    let taskArray = [];
    switch(elementId) {
      case this.elementIdFinished:
        taskArray = this.taskManager.getTasksOnlyFinished();
        break;
      case this.elementIdCreateDate:
        taskArray = this.taskManager.getTasksSortedByCreateDate();
        break;
      case this.elementIdDueDate:
        taskArray = this.taskManager.getTasksSortedByDueDate();
        break;
      case this.elementIdImportance:
        taskArray = this.taskManager.getTasksSortedByImportance();
        break;
      default:
        taskArray = this.taskManager.getTasksAll();
        break;
    }

    this.elementIdTaskList.innerHTML = "";
    if (taskArray.length === 0) {
        const newTask = document.createElement("div");
        newTask.innerHTML = "<p>Es sind keine Tasks zum Anzeigen verfügbar";
        this.elementIdTaskList.appendChild(newTask);
    } else {
      taskArray.forEach((task) => {
        const newTask = document.createElement("div");
        newTask.classList.add("show_task");
        newTask.innerHTML = this.htmlTemplateNewTask({
          duedate:    this.HTMLdueDate(task.dueDate),
          title:      task.title,
          importance: task.importance,
          id:         task.id,
          checked:    (task.finished) ? "checked" : "",
          descr:      task.descr
        });
        this.registerTaskEventHandlers(newTask, task.id);
        this.elementIdTaskList.appendChild(newTask);
      })
    }
  }

  sortTasks(elementId) {
    if (elementId.classList.contains("current")) {
      //if already set > do unset
      elementId = undefined;
    }  
    this.lastSortElementId = elementId;
    this.elementIdFinished.classList.toggle("current", false);
    this.elementIdCreateDate.classList.toggle("current", false);
    this.elementIdDueDate.classList.toggle("current", false);        
    this.elementIdImportance.classList.toggle("current", false);

    if (elementId != undefined) {
      elementId.classList.toggle("current", true);    
    }
    this.updateView(elementId);
  }

  registerTaskEventHandlers(newTask, taskId) {
    //register event listener for task
    newTask.querySelector('[data-list-btn-edit]').addEventListener('click', () => this.viewPopup.showPopup(true, taskId));

    newTask.querySelector('[data-list-btn-finish]').addEventListener('click', () => {
      this.taskManager.changeFinished(taskId);
      this.updateView();
    });  
  }
}