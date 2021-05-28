export class TaskStorage {
    constructor() {
        const task = JSON.parse(localStorage.getItem('taskStorage_v1') || "[ ]");
        this.task = task;
        localStorage.setItem('taskStorage_v1', JSON.stringify(task));
    }

    getAll() {
        return this.task;
    }

    update(task) {
        localStorage.setItem('taskStorage_v1', JSON.stringify(this.task));
        return this.task;
    }
}