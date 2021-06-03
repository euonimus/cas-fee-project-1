import TaskStorage from './data/task-storage.js';
import Task from './task.js';

class TaskService {
    constructor(storage) {
        this.storage = storage || new TaskStorage();
        this.taskList = [];
    }

    loadData() {
        this.taskList = this.storage.getAll().map(t => new Task(t.id, t.title, t.descr, t.createDate, t.dueDate, t.importance, t.finish));

        if (this.taskList.length === 0) { // initial data seed
            this.taskList.push(new Task(1, 'Projektarbeit', 'Bis am 26. Juni muss die Projektarbeit 1 abgegeben sein!', new Date('2021-05-19'), new Date('2021-06-27'), 5, false));
            this.taskList.push(new Task(2, 'dummy 1', 'Lorem ipsum dolor', new Date('2021-05-10'), new Date('2021-05-23'), 3, true));
            // this.taskList.push(new Task(3, 'dummy 2', 'Lorem ipsum dolor', new Date('2021-05-11'), new Date('2021-05-24'), 3, true));
            // this.taskList.push(new Task(4, 'dummy 3', 'Lorem ipsum dolor', new Date('2021-05-12'), new Date('2021-05-25'), 3, true));
            // this.taskList.push(new Task(5, 'dummy 4', 'Lorem ipsum dolor', new Date('2021-05-13'), new Date('2021-05-26'), 3, true));
            this.taskList.push(new Task(10, 'Mama anrufen', 'Und mal wieder fragen, wie es ihr geht', new Date(), new Date('2021-05-27'), 4, false));
            this.save();
        }
    }

    save() {
        this.storage.update(this.taskList.map(t => t.toJSON()));
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
        return this.taskList.find((task) => parseInt(id) === parseInt(task.id));
    }

    getTaskIndex(task) {
        return this.taskList.findIndex((element) => element.id === task.id);
    }

    getNewId() {
        return this.taskList.reduce((acc, task) => acc = acc > task.id ? acc : task.id, 0) + 1;
    }
}

export const taskService = new TaskService();
