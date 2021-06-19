/* global giveDate */
import { httpService } from "./http-service.js";

class TaskService {
    async getTasks() {
        return await httpService.ajax("GET", "/tasks", undefined);
    }

    async getTask(id) {
        return await httpService.ajax("GET", `/tasks/${id}`);
    }

    async createTask(task) {
        return await httpService.ajax("POST", `/tasks`, { task });
    }

    async deleteTask(id) {
        return await httpService.ajax("DELETE", `/tasks/${id}`);
    }

    async updateTask(task) {
        return await httpService.ajax("PATCH", `/tasks/${task._id}`, { task });
    }

    async updateFinish(task) {
        return await httpService.ajax("PATCH", `/tasks/${task._id}/${task.finish}`);
    }
}

export const taskService = new TaskService();
