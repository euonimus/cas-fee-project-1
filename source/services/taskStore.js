import Datastore from "nedb-promise";
import Task from "../public/js/task.js";

export class TaskStore {
    constructor(db) {
        this.db = db || new Datastore({ filename: "./data/tasks.db", autoload: true });
    }

    async all() {
        return await this.db.find({});
    }

    async get(id) {
        return await this.db.findOne({ _id: id });
    }

    async add(task) {
        return await this.db.insert(task);
    }

    async delete(id) {
        return await this.db.remove({ _id: id });
    }

    async update(task) {
        return await this.db.update(
            { _id: task._id },
            { $set: { title: task.title, descr: task.descr, dueDate: task.dueDate, importance: task.importance, finish: task.finish } }
        );
    }

    async updateFinish(id, finish) {
        return await this.db.update({ _id: id }, { $set: { finish: finish } });
    }
}

export const taskStore = new TaskStore();
