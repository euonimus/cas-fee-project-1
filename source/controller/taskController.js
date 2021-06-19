import {taskStore} from "../services/taskStore.js";

export class TaskController {
    async getTasks(req, res) {
        res.json(await taskStore.all());
    }

    async getTask(req, res) {
        res.json(await taskStore.get(req.params.id));
    }

    async createTask(req, res) {
        res.json(await taskStore.add(req.body.task));
    }

    async deleteTask(req, res) {
        res.json(await taskStore.delete(req.params.id));
    }

    async updateTask(req, res) {
        res.json(await taskStore.update(req.body.task));
    }

    async updateFinish(req, res) {
        res.json(await taskStore.updateFinish(req.params.id, (req.params.finish === "false") ? false : true)); //cause of req.params.finish is a String
    }
}

export const taskController = new TaskController();
