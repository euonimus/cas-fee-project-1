/* global giveDate */
import TaskStorage from './data/task-storage.js';
import Task from './task.js';

export default class TaskService {
    constructor(storage) {
        this.storage = storage || new TaskStorage();
        this.taskList = [];
    }

    loadData() {
        this.taskList = this.storage.getAll().map((t) => new Task(t.id, t.title, t.descr, t.createDate, t.dueDate, t.importance, t.finish));

        if (this.taskList.length === 0) { // initial data seed
            this.taskList.push(new Task(1, 'Projektarbeit', 'Bis am 26. Juni muss die Projektarbeit 1 abgegeben sein!', giveDate(-2), giveDate(30), 5, false));
            this.taskList.push(new Task(2, 'dummy 1', 'Lorem ipsum dolor', giveDate(-1), giveDate(3), 3, true));
            this.taskList.push(new Task(10, 'Mama anrufen', 'Und mal wieder fragen, wie es ihr geht', giveDate(-3), giveDate(4), 4, false));
            this.save();
        }
    }

    save() {
        this.storage.update(this.taskList.map((t) => t.toJSON()));
    }

    getTaskList() {
        return this.taskList;
    }

    changeFinish(id) {
     const task = this.getTask(id);
     task.finish = !task.finish;
     this.editTask(task);
    }

    editTask(task) {
        const taskIndex = this.getTaskIndex(task);
        if (taskIndex >= 0) {
            this.taskList.splice(taskIndex, 1, task);
        } else {
            this.taskList.push(task);
        }
    }

    deleteTask(task) {
        const taskIndex = this.getTaskIndex(task);
        if (taskIndex >= 0) {
            this.taskList.splice(taskIndex, 1);
        }
    }

    getTask(id) {
        return this.taskList.find((task) => Number(id) === Number(task.id));
    }

    getTaskIndex(task) {
        return this.taskList.findIndex((element) => element.id === task.id);
    }

    getNewId() {
        return Math.max.apply(null, this.taskList.map((task) => task.id)) + 1;
    }
}
