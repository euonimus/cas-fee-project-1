import {taskService} from '../services/task-service.js';
import popupController from './popup-controller.js';

class TaskController {
  constructor() {
    this.popupController = new popupController(this);
    this.lastSortElementId = undefined;

    // ElemendIds
    this.elementIdTaskList = document.querySelector('[data-list]');
    this.elementBtnFinish = document.querySelector('[data-list-btn-finish]');
    this.elementBtnDueDate = document.querySelector('[data-list-btn-dueDate]');
    this.elementBtnCreateDate = document.querySelector('[data-list-btn-createDate]');
    this.elementBtnImportance = document.querySelector('[data-list-btn-importance]');
    this.elementBtnNew = document.querySelector('[data-list-btn-new]');
    this.elementBtnEdit = document.querySelector('[data-list-btn-edit]');

    this.htmlTemplateShowTask = Handlebars.compile(`
        <div><span class='task-title'>{{title}}</span></div>
        <div><span class='{{duedate.class}}'>{{duedate.text}}</span></div>
        <div>{{importance}}</div>
        <div class='task_edit'><button id='{{id}}' class='btn' data-list-btn-edit>Bearbeiten</button></div>
        <div><label><input id='{{id}}' type='checkbox' {{finish.checked}} data-list-btn-finish/>{{finish.text}}</label></div>
        <div class='task-desc'><textarea readonly rows='4'>{{descr}}</textarea></div>`);
  }

  initEventHandlers() {
    this.elementBtnFinish.addEventListener('click', () => this.sortTasks(this.elementBtnFinish));
    this.elementBtnDueDate.addEventListener('click', () => this.sortTasks(this.elementBtnDueDate));
    this.elementBtnCreateDate.addEventListener('click', () => this.sortTasks(this.elementBtnCreateDate));
    this.elementBtnImportance.addEventListener('click', () => this.sortTasks(this.elementBtnImportance));

    // popup clicks
    this.elementBtnNew.addEventListener('click', () => this.popupController.showPopup(true));
  }

  registerEventHandlersPerTask(newTask, taskId) {
    // register event listener for task
    newTask.querySelector('[data-list-btn-edit]').addEventListener('click', () => this.popupController.showPopup(true, taskId));

    newTask.querySelector('[data-list-btn-finish]').addEventListener('click', () => {
      taskService.changeFinish(taskId);
      this.showTaskList();
    });
  }

  showTaskList(elementId = this.lastSortElementId) {
    let taskArray = [];
    switch (elementId) {
      case this.elementBtnFinish:
        taskArray = taskService.getOnlyFinished();
        break;
      case this.elementBtnDueDate:
        taskArray = taskService.getSortedByDueDate();
        break;
      case this.elementBtnCreateDate:
        taskArray = taskService.getSortedByCreateDate();
        break;
      case this.elementBtnImportance:
        taskArray = taskService.getSortedByImportance();
        break;
      default:
        taskArray = taskService.getAllTasks();
        break;
    }

    this.elementIdTaskList.innerHTML = '';
    if (taskArray.length === 0) {
        const newElementTask = document.createElement('div');
        newElementTask.innerHTML = '<p>Es sind keine Tasks zum Anzeigen verfügbar';
        this.elementIdTaskList.appendChild(newElementTask);
    } else {
      taskArray.forEach((task) => {
        const newElementTask = document.createElement('div');
        newElementTask.classList.add('show_task');
        newElementTask.innerHTML = this.htmlTemplateShowTask({
          duedate: (task.finish) ? {} : this.htmlDueDate(task.dueDate),
          title: task.title,
          importance: Array(task.importance).fill('⚡').join(''),
          id: task.id,
          finish: (task.finish) ? {checked: 'checked', text: 'erledigt'} : {checked: '', text: 'noch zu erledigen'},
          descr: task.descr,
        });
        this.registerEventHandlersPerTask(newElementTask, task.id);
        this.elementIdTaskList.appendChild(newElementTask);
      });
    }
  }

  sortTasks(paramElementId) {
    let elementId = paramElementId;
    if (elementId.classList.contains('current')) {
      // if already set > do unset
      elementId = undefined;
    }
    this.lastSortElementId = elementId;
    this.elementBtnFinish.classList.toggle('current', false);
    this.elementBtnDueDate.classList.toggle('current', false);
    this.elementBtnCreateDate.classList.toggle('current', false);
    this.elementBtnImportance.classList.toggle('current', false);

    if (elementId !== undefined) {
      elementId.classList.toggle('current', true);
    }
    this.showTaskList(elementId);
  }

  htmlDueDate(dueDate) {
    const dueDiff = moment.duration(moment(dueDate).diff(moment().startOf('day'))).asDays();
    const stringDate = moment(dueDate).format('DD.MM.YY');

    if (dueDiff < -1) {
      return {class: 'dueDate-tolate', text: 'überfällig seit ' + Math.abs(Math.round(dueDiff)) + ' Tagen'};
    } else if (dueDiff < 0) {
      return {class: 'dueDate-tolate', text: 'überfällig seit gestern'};
    } else if (dueDiff < 1) {
      return {class: 'dueDate-short', text: 'heute fällig'};
    } else if (dueDiff < 2) {
      return {class: 'dueDate-short', text: 'morgen fällig'};
    } else if (dueDiff < 5) {
      return {class: 'dueDate-easy', text: 'demnächst fällig am ' + stringDate};
    } else {
      return {class: 'dueDate-easy', text: 'erst fällig am ' + stringDate};
    }
  }

  initialize() {
      this.initEventHandlers();
      taskService.loadData();
      this.showTaskList();
  }
}

new TaskController().initialize();
