/* eslint-disable no-nested-ternary */
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
        this.elementBtnFinish.addEventListener("click", () => this.prepFilter());
        this.elementBtnDueDate.addEventListener("click", () => this.prepSort(this.elementBtnDueDate));
        this.elementBtnCreateDate.addEventListener("click", () => this.prepSort(this.elementBtnCreateDate));
        this.elementBtnImportance.addEventListener("click", () => this.prepSort(this.elementBtnImportance));

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
        newTask.querySelector("[data-list-btn-finish]").addEventListener("click", async () => {
            const updatedTask = task;
            updatedTask.finish = !updatedTask.finish;
            await taskService.updateFinish(updatedTask);
            this.showTasks(true);
        });
    }

    async showTasks(reloadFromDB = false) {
        if (reloadFromDB) {
            await this.loadData();
        }
        let showArray;

        switch (this.lastFilterFinish) {
            case 1:
                showArray = this.taskArrayfromDB.filter((task) => task.finish === false);
                break;
            case 2:
                showArray = this.taskArrayfromDB.filter((task) => task.finish === true);
                break;
            case 0: default:
                showArray = this.taskArrayfromDB;
                break;
        }

        switch (this.lastOrderBy) {
            case "dueDate":
                showArray.sort((t1, t2) => (t1.dueDate > t2.dueDate ? 1 : t1.dueDate < t2.dueDate ? -1 : 0));
                break;
            case "createDate":
                showArray.sort((t1, t2) => (t1.createDate > t2.createDate ? 1 : t1.createDate < t2.createDate ? -1 : 0));
                break;
            case "importance":
                showArray.sort((t1, t2) => t2.importance - t1.importance);
                break;
            default:
                // unsorted > default sorting from Array
                break;
        }

        this.elementIdTaskList.innerHTML = "";

        if (showArray.length === 0) {
            const newElementTask = document.createElement("div");
            newElementTask.innerHTML = "Es sind keine Tasks zum Anzeigen verf??gbar";
            this.elementIdTaskList.appendChild(newElementTask);
        } else {
            showArray.forEach((task) => {
                const newElementTask = document.createElement("div");
                newElementTask.classList.add("show_task");
                newElementTask.innerHTML = this.htmlTemplateShowTask({
                    duedate: task.finish ? {} : this.htmlDueDate(task.dueDate),
                    title: task.title,
                    importance: Array(task.importance).fill("???").join(""),
                    _id: task._id,
                    finish: task.finish ? { checked: "checked", text: "erledigt" } : { checked: "", text: "noch zu erledigen" },
                    descr: task.descr,
                });
                this.registerEventHandlersPerTask(newElementTask, task);
                this.elementIdTaskList.appendChild(newElementTask);
            });
        }
    }

    prepFilter() {
        switch (this.lastFilterFinish) {
            case 0: // show only not finished
                this.elementBtnFinish.innerHTML = "nur offene";
                this.elementBtnFinish.classList.add("current");
                this.lastFilterFinish = 1;
                break;
            case 1: // show only finished
                this.elementBtnFinish.innerHTML = "nur erledigte";
                this.elementBtnFinish.classList.add("current");
                this.lastFilterFinish = 2;
                break;
            case 2: default: // no filter
                this.elementBtnFinish.innerHTML = "alle";
                this.elementBtnFinish.classList.remove("current");
                this.lastFilterFinish = 0;
                break;
        }
        this.showTasks();
    }

    prepSort(orderByElementId) {
        this.elementBtnDueDate.classList.remove("current");
        this.elementBtnCreateDate.classList.remove("current");
        this.elementBtnImportance.classList.remove("current");
        // eslint-disable-next-line default-case
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
            return { class: "dueDate-tolate", text: "??berf??llig seit " + Math.abs(Math.round(dueDiff)) + " Tagen" };
        // eslint-disable-next-line no-else-return
        } else if (dueDiff < 0) {
            return { class: "dueDate-tolate", text: "??berf??llig seit gestern" };
        } else if (dueDiff < 1) {
            return { class: "dueDate-short", text: "heute f??llig" };
        } else if (dueDiff < 2) {
            return { class: "dueDate-short", text: "morgen f??llig" };
        } else if (dueDiff < 5) {
            return { class: "dueDate-easy", text: "demn??chst f??llig am " + stringDate };
        } else {
            return { class: "dueDate-easy", text: "erst f??llig am " + stringDate };
        }
    }

    async initialize() {
        this.initEventHandlers();
        await this.loadData();
        this.showTasks();
    }
}

new MainController().initialize();
