import express from "express";
import { taskController } from "../controller/taskController.js";

const router = express.Router();
router.get("/tasks", taskController.getTasks.bind(taskController));
router.get("/tasks/:id/", taskController.getTask.bind(taskController));
router.post("/tasks", taskController.createTask.bind(taskController));
router.delete("/tasks/:id/", taskController.deleteTask.bind(taskController));
router.patch("/tasks/:id/", taskController.updateTask.bind(taskController));
router.patch("/tasks/:id/:finish", taskController.updateFinish.bind(taskController));

export default router;
