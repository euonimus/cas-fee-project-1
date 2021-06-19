/* global moment, Handlebars */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["htmlDueDate"] }] */
import { taskService } from "../services/task-service.js";
import PopupController from "./popup-controller.js";

class MainController {
    constructor() {
        this.popupController = new PopupController(this);
        this.taskArrayfromDB = [];
        this.lastOrderBy = undefined;
        this.lastFilterFinish = 0;

        // ElemendIds
        this.elementIdTaskList = document.querySelector("[data-list]");
        this.elementBtnFinish = document.querySelector("[data-list-btn-finish]");
        this.elementBtnDueDate = document.querySelector("[data-list-btn-dueDate]");
        this.elementBtnCreateDate = document.querySelector("[data-list-btn-createDate]");
        this.elementBtnImportance = document.querySelector("[data-list-btn-importance]");
        this.elementBtnNew = document.querySelector("[data-list-btn-new]");
        this.elementBtnEdit = document.querySelector("[data-list-btn-edit]");


        this.htmlTemplateShowTask = Handlebars.compile(document.querySelector("#tasks-template").innerHTML);
    }

    initEventHandlers() {
        this.elementBtnFinish.addEventListener("click", () => this.prep_filter());
        this.elementBtnDueDate.addEventListener("click", () => this.prep_sort(this.elementBtnDueDate));
        this.elementBtnCreateDate.addEventListener("click", () => this.prep_sort(this.elementBtnCreateDate));
        this.elementBtnImportance.addEventListener("click", () => this.prep_sort(this.elementBtnImportance));

        // popup clicks
        this.elementBtnNew.addEventListener("click", () => this.popupController.showPopup(true));

        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener("click", (event) => {
            if (event.target === this.popupController.popup) {
                this.popupController.showPopup(false);
            }
        });
    }

    async loadData() {
        this.taskArrayfromDB = await taskService.getTasks();
    }

    registerEventHandlersPerTask(newTask, task) {
        // register event listener for task
        newTask.querySelector("[data-list-btn-edit]").addEventListener("click", () => this.popupController.showPopup(true, task._id));
        newTask.querySelector("[data-list-btn-finish]").addEventListener("click", async() => {
            task.finish = !task.finish;
            await taskService.updateFinish(task);
            this.showTasks(true);
        });
    }

    async showTasks(reloadFromDB = false) {
        if (reloadFromDB) {
            await this.loadData();
        }
        let showArray = this.taskArrayfromDB;

        switch (this.lastFilterFinish) {
            case 1:
                showArray = this.taskArrayfromDB.filter((task) => task.finish === true);
                break;
            case 2:
                showArray = this.taskArrayfromDB.filter((task) => task.finish === false);
                break;
        }

        switch (this.lastOrderBy) {
            case "dueDate":
                showArray.sort((t1, t2) => {
                    return t1.dueDate > t2.dueDate ? 1 : t1.dueDate < t2.dueDate ? -1 : 0;
                });
                break;
            case "createDate":
                showArray.sort((t1, t2) => {
                    return t1.createDate > t2.createDate ? 1 : t1.createDate < t2.createDate ? -1 : 0;
                });
                break;
            case "importance":
                showArray.sort((t1, t2) => t2.importance - t1.importance);
                break;
        }

        this.elementIdTaskList.innerHTML = "";

        if (showArray.length === 0) {
            const newElementTask = document.createElement("div");
            newElementTask.innerHTML = "<p>Es sind keine Tasks zum Anzeigen verfügbar";
            this.elementIdTaskList.appendChild(newElementTask);
        } else {
            showArray.forEach((task) => {
                const newElementTask = document.createElement("div");
                newElementTask.classList.add("show_task");
                newElementTask.innerHTML = this.htmlTemplateShowTask({
                    duedate: task.finish ? {} : this.htmlDueDate(task.dueDate),
                    title: task.title,
                    importance: Array(task.importance).fill("⚡").join(""),
                    _id: task._id,
                    finish: task.finish ? { checked: "checked", text: "erledigt" } : { checked: "", text: "noch zu erledigen" },
                    descr: task.descr,
                });
                this.registerEventHandlersPerTask(newElementTask, task);
                this.elementIdTaskList.appendChild(newElementTask);
            });
        }
    }

    prep_filter() {
        switch (this.lastFilterFinish) {
            case 0: // show only finished
                this.elementBtnFinish.innerHTML = "nur erledigte";
                this.elementBtnFinish.classList.add("current");
                this.lastFilterFinish = 1;
                break;
            case 1: // show only not finished
                this.elementBtnFinish.innerHTML = "nur offene";
                this.elementBtnFinish.classList.add("current");
                this.lastFilterFinish = 2;
                break;
            case 2: // no filter
                this.elementBtnFinish.innerHTML = "alle";
                this.elementBtnFinish.classList.remove("current");
                this.lastFilterFinish = 0;
                break;
        }
        this.showTasks();
    }

    prep_sort(orderByElementId) {
        this.elementBtnDueDate.classList.remove("current");
        this.elementBtnCreateDate.classList.remove("current");
        this.elementBtnImportance.classList.remove("current");
        switch (orderByElementId) {
            case this.elementBtnDueDate:
                this.lastOrderBy = "dueDate";
                break;
            case this.elementBtnCreateDate:
                this.lastOrderBy = "createDate";
                break;
            case this.elementBtnImportance:
                this.lastOrderBy = "importance";
                break;
        }
        orderByElementId.classList.add("current");
        this.showTasks();
    }

    htmlDueDate(dueDate) {
        const dueDiff = moment.duration(moment(dueDate).diff(moment().startOf("day"))).asDays();
        const stringDate = moment(dueDate).format("DD.MM.YY");

        if (dueDiff < -1) {
            return { class: "dueDate-tolate", text: "überfällig seit " + Math.abs(Math.round(dueDiff)) + " Tagen" };
        } else if (dueDiff < 0) {
            return { class: "dueDate-tolate", text: "überfällig seit gestern" };
        } else if (dueDiff < 1) {
            return { class: "dueDate-short", text: "heute fällig" };
        } else if (dueDiff < 2) {
            return { class: "dueDate-short", text: "morgen fällig" };
        } else if (dueDiff < 5) {
            return { class: "dueDate-easy", text: "demnächst fällig am " + stringDate };
        } else {
            return { class: "dueDate-easy", text: "erst fällig am " + stringDate };
        }
    }

    async initialize() {
        this.initEventHandlers();
        await this.loadData();
        this.showTasks();
    }
}

new MainController().initialize();
