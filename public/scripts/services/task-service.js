import {TaskStorage} from './data/task-storage.js';
import {Task} from './task.js';

class TaskService {
    constructor(storage) {
        this.storage = storage || new TaskStorage();
        this.taskList = [ ];
    }

    loadData() {
        this.taskList = this.storage.getAll().map(t => new Task(t.id, t.title, t.descr, t.createDate, t.dueDate, t.importance, t.finished));

        if (this.taskList.length === 0) { // initial data seed
            this.taskList.push(new Task(1, 'Projektarbeit 1', 'Bis am 26. Juni muss die Projektarbeit 1 abgegeben sein!', new Date('2021-05-22'), new Date('2021-06-27'), 5, false));
            this.taskList.push(new Task(2, 'Projektarbeit 2', 'Mal damit beginnen', new Date('2021-05-10'), new Date('2021-05-23'), 3, true));   
            this.taskList.push(new Task(3, 'Projektarbeit 3', 'Mal damit beginnen', new Date('2021-05-10'), new Date('2021-05-24'), 3, true));      
            this.taskList.push(new Task(4, 'Projektarbeit 4', 'Mal damit beginnen', new Date('2021-05-10'), new Date('2021-05-25'), 3, true)); 
            this.taskList.push(new Task(5, 'Projektarbeit 5', 'Mal damit beginnen', new Date('2021-05-10'), new Date('2021-05-26'), 3, true)); 
            this.taskList.push(new Task(6, 'Mama anrufen', 'Und mal wieder fragen, wie es ihr geht', new Date(), new Date('2021-05-27'), 4, false));              
            this.save();
        }
    }

    save() {
        this.storage.update(this.taskList.map(t => t.toJSON()));
    }

    getAllTasks() {
        return this.taskList;
    }


    getOnlyFinished() {
        return this.taskList.filter(task => task.finish === true);
    }

    getSortedByCreateDate() {
        return this.taskList.sort((t1, t2) => (t2.createDate - t1.createDate));
    }

    getSortedByDueDate() {
        return this.taskList.sort((t1, t2) => (t1.dueDate - t2.dueDate));
    }

    getSortedByImportance() {
        return this.taskList.sort((t1, t2) => (t2.importance - t1.importance));
    }
    
    changeFinish(id) {
     let task = this.getTask(id);
     task.finish = !task.finish;
     this.editTask(task);
    }

    editTask(task) {
        let taskIndex = this.getTaskIndex(task);
        if (taskIndex >= 0 ) {
            this.taskList.splice(taskIndex, 1, task);
        } else {
            this.taskList.push(task);
        }
    } 

    deleteTask(task) {
        let taskIndex = this.getTaskIndex(task);
        if (taskIndex >= 0 ) {
            this.taskList.splice(taskIndex, 1);
        }
    }

    getTask(id) {
        return this.taskList.find((task) => parseInt(id) === parseInt(task.id));
    }

    getTaskIndex(task) {
        return this.taskList.findIndex((element) => element.id === task.id)
    }

    getNextId() {
        return this.taskList.length + 1;
    }   
}

export const taskService = new TaskService();
