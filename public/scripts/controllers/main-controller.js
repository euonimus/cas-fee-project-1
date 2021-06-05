/* global moment, Handlebars */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["htmlDueDate"] }] */
import TaskService from '../services/task-service.js';
import PopupController from './popup-controller.js';

class MainController {
  constructor() {
    this.taskService = new TaskService();
    this.popupController = new PopupController(this, this.taskService);
    this.lastSortElementId = undefined;
    this.filterFinish = 0;

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
    this.elementBtnFinish.addEventListener('click', () => this.sortTaskList(this.elementBtnFinish));
    this.elementBtnDueDate.addEventListener('click', () => this.sortTaskList(this.elementBtnDueDate));
    this.elementBtnCreateDate.addEventListener('click', () => this.sortTaskList(this.elementBtnCreateDate));
    this.elementBtnImportance.addEventListener('click', () => this.sortTaskList(this.elementBtnImportance));

    // popup clicks
    this.elementBtnNew.addEventListener('click', () => this.popupController.showPopup(true));

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (event) => {
      if (event.target === this.popupController.popup) {
        this.popupController.showPopup(false);
      }
    });
  }

  registerEventHandlersPerTask(newTask, taskId) {
    // register event listener for task
    newTask.querySelector('[data-list-btn-edit]').addEventListener('click', () => this.popupController.showPopup(true, taskId));

    newTask.querySelector('[data-list-btn-finish]').addEventListener('click', () => {
      this.taskService.changeFinish(taskId);
      this.showTaskList();
    });
  }

  showTaskList(elementId = this.lastSortElementId) {
    let taskArray = this.taskService.getTaskList();

    switch (this.filterFinish) {
      case 1:
        taskArray = taskArray.filter((task) => task.finish === true);
        break;
      case 2:
        taskArray = taskArray.filter((task) => task.finish === false);
        break;
    }

    switch (elementId) {
      case this.elementBtnDueDate:
        taskArray.sort((t1, t2) => (t1.dueDate - t2.dueDate));
        break;
      case this.elementBtnCreateDate:
        taskArray.sort((t1, t2) => (t1.createDate - t2.createDate));
        break;
      case this.elementBtnImportance:
        taskArray.sort((t1, t2) => (t2.importance - t1.importance));
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

  sortTaskList(elementId) {
    if (elementId === this.elementBtnFinish) {
      // btn filterFinish is additional for the sort btn
      switch (this.filterFinish) {
        case 0: // show only finished
          this.elementBtnFinish.innerHTML = 'nur erledigte';
          this.elementBtnFinish.classList.add('current');
          this.filterFinish = 1;
          break;
        case 1: // show only not finished
          this.elementBtnFinish.innerHTML = 'nur offene';
          this.elementBtnFinish.classList.add('current');
          this.filterFinish = 2;
          break;
        case 2: // no filter
          this.elementBtnFinish.innerHTML = 'alle';
          this.elementBtnFinish.classList.remove('current');
          this.filterFinish = 0;
          break;
      }
    } else {
      this.lastSortElementId = elementId;
      this.elementBtnDueDate.classList.remove('current');
      this.elementBtnCreateDate.classList.remove('current');
      this.elementBtnImportance.classList.remove('current');
      elementId.classList.add('current');
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
      this.taskService.loadData();
      this.sortTaskList(this.elementBtnDueDate);
  }
}

new MainController().initialize();
