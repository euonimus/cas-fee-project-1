import Task from './task.js';

export default class TaskManager {
  constructor() {
    this.taskArray = [];

    //add tasks
    this.editTask(new Task(1, 'Projektarbeit 1', 'Bis am 26. Juni muss die Projektarbeit 1 abgegeben sein!', new Date('2021-05-22'), new Date('2021-06-27'), 5, false));
    this.editTask(new Task(2, 'Projektarbeit 1 beginnen', 'Mal damit beginnen', new Date('2021-05-10'), new Date('2021-05-24'), 3, true));        
    this.editTask(new Task(3, 'Mama anrufen', 'Und mal wieder fragen, wie es ihr geht', new Date(), new Date('2021-06-01'), 4, false));    
  }

  getAllTasks() {
    return this.taskArray;
  }

  getOnlyFinished() {
    return this.taskArray.filter(task => task.finished === true);
  }

  getSortedByCreateDate() {
    return this.taskArray.sort((t1, t2) => (t2.createDate - t1.createDate));
  }

  getSortedByDueDate() {
    return this.taskArray.sort((t1, t2) => (t1.dueDate - t2.dueDate));
  }

  getSortedByImportance() {
    return this.taskArray.sort((t1, t2) => (t2.importance - t1.importance));
  }

  // methods
  editTask(task) {
    let taskIndex = this.taskArray.findIndex((element) => element.id === task.id);
    if (taskIndex >= 0 ) {
      this.taskArray.splice(taskIndex, 1, task);
    } else {
      this.taskArray.push(task);
    }
  }

  deleteTask(task) {
    let taskIndex = this.taskArray.findIndex((element) => element.id === task.id);
    if (taskIndex >= 0 ) {
      this.taskArray.splice(taskIndex, 1);
    }
  }

  changeFinished(id) {
    let task = this.getTask(id);
    task.finished = !task.finished;
    this.editTask(task);
  }

  getTask(id) {
    return this.taskArray.find((task) => parseInt(id) === parseInt(task.id));
  }

  getNextId() {
    return this.taskArray.length + 1;
  }
}