import {Task} from './task.js';

export class TaskManager {
  constructor() {
    this.taskArray = [];

    //add tasks
    this.editTask(new Task(1, 'Projektarbeit 1', 'Bis am 26. Juni muss die Projektarbeit 1 abgegeben sein!', new Date('2021-05-22'), new Date('2021-06-27'), 5, false));
    this.editTask(new Task(2, 'Projektarbeit 2', 'Mal damit beginnen', new Date('2021-05-10'), new Date('2021-05-23'), 3, true));   
    this.editTask(new Task(3, 'Projektarbeit 3', 'Mal damit beginnen', new Date('2021-05-10'), new Date('2021-05-24'), 3, true));      
    this.editTask(new Task(4, 'Projektarbeit 4', 'Mal damit beginnen', new Date('2021-05-10'), new Date('2021-05-25'), 3, true)); 
    this.editTask(new Task(5, 'Projektarbeit 5', 'Mal damit beginnen', new Date('2021-05-10'), new Date('2021-05-26'), 3, true)); 
    this.editTask(new Task(6, 'Mama anrufen', 'Und mal wieder fragen, wie es ihr geht', new Date(), new Date('2021-05-27'), 4, false));    
  }

  getTasksAll() {
    return this.taskArray;
  }

  getTasksOnlyFinished() {
    return this.taskArray.filter(task => task.finished === true);
  }

  getTasksSortedByCreateDate() {
    return this.taskArray.sort((t1, t2) => (t2.createDate - t1.createDate));
  }

  getTasksSortedByDueDate() {
    return this.taskArray.sort((t1, t2) => (t1.dueDate - t2.dueDate));
  }

  getTasksSortedByImportance() {
    return this.taskArray.sort((t1, t2) => (t2.importance - t1.importance));
  }

  // methods
  editTask(task) {
    let taskIndex = this.getTaskIndex(task);
    if (taskIndex >= 0 ) {
      this.taskArray.splice(taskIndex, 1, task);
    } else {
      this.taskArray.push(task);
    }
  }

  deleteTask(task) {
    let taskIndex = this.getTaskIndex(task);
    if (taskIndex >= 0 ) {
      this.taskArray.splice(taskIndex, 1);
    }
  }

  changeFinished(id) {
    let task = this.getTask(id);
    task.finished = !task.finished
    this.editTask(task);
  }

  getTask(id) {
    return this.taskArray.find((task) => parseInt(id) === parseInt(task.id));
  }

  getTaskIndex(task) {
    return this.taskArray.findIndex((element) => element.id === task.id)
  }

  getNextId() {
    return this.taskArray.length + 1;
  }
}