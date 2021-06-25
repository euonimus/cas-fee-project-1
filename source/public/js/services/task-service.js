import { httpService } from "./http-service.js";

class TaskService {
    async getTasks() {
        return httpService.ajax("GET", "/tasks", undefined);
    }

    async getTask(id) {
        return httpService.ajax("GET", `/tasks/${id}`);
    }

    async createTask(task) {
        return httpService.ajax("POST", `/tasks`, { task });
    }

    async deleteTask(id) {
        return httpService.ajax("DELETE", `/tasks/${id}`);
    }

    async updateTask(task) {
        return httpService.ajax("PATCH", `/tasks/${task._id}`, { task });
    }

    async updateFinish(task) {
        return httpService.ajax("PATCH", `/tasks/${task._id}/${task.finish}`);
    }
}
// eslint-disable-next-line import/prefer-default-export
export const taskService = new TaskService();
