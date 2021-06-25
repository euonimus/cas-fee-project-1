import Datastore from "nedb-promise";

export class TaskStore {
    constructor(db) {
        this.db = db || new Datastore({ filename: "./data/tasks.db", autoload: true });
    }

    async all() {
        return this.db.find({});
    }

    async get(id) {
        return this.db.findOne({ _id: id });
    }

    async add(task) {
        return this.db.insert(task);
    }

    async delete(id) {
        return this.db.remove({ _id: id });
    }

    async update(task) {
        return this.db.update(
            { _id: task._id },
            { $set: { title: task.title, descr: task.descr, dueDate: task.dueDate, importance: task.importance, finish: task.finish } },
        );
    }

    async updateFinish(id, finish) {
        // eslint-disable-next-line object-shorthand
        return this.db.update({ _id: id }, { $set: { finish: finish } });
    }
}

export const taskStore = new TaskStore();
