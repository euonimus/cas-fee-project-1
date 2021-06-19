/* global moment, giveDate */
import Task from "../task.js";
import { taskService } from "../services/task-service.js";

export default class popupController {
    constructor(mainController) {
        this.mainController = mainController;
        this.tmp_importance = undefined;
        this.task = undefined;
        this.popup = document.querySelector("[data-popup]");
        this.elementH2 = document.querySelector("[data-popup-h2]");
        this.elementForm = document.querySelector("[data-popup-form]");
        this.elementTitle = document.querySelector("[data-popup-title]");
        this.elementDescr = document.querySelector("[data-popup-descr]");
        this.elementDueDate = document.querySelector("[data-popup-duedate]");
        this.elementDueDate.min = giveDate(-30);
        this.elementDueDate.max = giveDate(2, "years");
        this.elementFinish = document.querySelector("[data-popup-finish]");
        this.elementCreateDate = document.querySelector("[data-popup-createdate]");

        this.elementPopupImportance = document.querySelector("[data-popup-importance]");
        this.elementPopupImportanceValues = document.querySelectorAll("[data-popup-importance-value]");

        this.elementPopupBtnSave = document.querySelector("[data-popup-btn-save]");
        this.elementPopupBtnCancle = document.querySelector("[data-popup-btn-cancle]");
        this.elementPopupBtnDelete = document.querySelector("[data-popup-btn-delete]");

        this.initEventHandlers();
    }

    initEventHandlers() {
        this.elementPopupBtnCancle.addEventListener("click", () => this.showPopup(false));
        this.elementPopupImportance.addEventListener("click", (event) =>
            this.updateAndDisplayImportance(Number(event.target.dataset.popupImportanceValue))
        );
        this.elementPopupBtnSave.addEventListener("click", async () => {
            if (this.elementForm.checkValidity()) {
                this.mapData();
                if (this.task._id === undefined) {
                    await taskService.createTask(this.task);
                } else {
                    await taskService.updateTask(this.task);
                }
                this.mainController.showTasks(loadfromDB = true);
                this.showPopup(false);
            }
        });

        // explanation!!!
        // to use checkValidity() we need a form, but we don't want to submit or reload the page > suppression submit
        this.elementForm.addEventListener("submit", (event) => event.preventDefault());

        this.elementPopupBtnDelete.addEventListener("click", async () => {
            await taskService.deleteTask(this.task._id);
            this.mainController.showTasks(true);
            this.showPopup(false);
        });
    }

    async showPopup(display, id = 0) {
        if (display) {
            if (id != 0) {
                this.elementH2.innerHTML = "Bearbeite diesen Task";
                this.elementPopupBtnDelete.classList.remove("invisible");
                this.task = await taskService.getTask(id);
            } else {
                this.elementH2.innerHTML = "Erstelle einen neuen Task";
                this.elementPopupBtnDelete.classList.add("invisible");
                this.task = new Task();
            }
            this.elementTitle.value = this.task.title;
            this.elementDescr.value = this.task.descr;
            this.elementDueDate.value = moment(this.task.dueDate).format("YYYY-MM-DD");
            this.elementFinish.checked = this.task.finish;
            this.elementCreateDate.innerHTML = moment(this.task.createDate).format("DD.MM.YYYY");
            this.updateAndDisplayImportance(this.task.importance);
            this.popup.classList.remove("invisible");
        } else {
            this.popup.classList.add("invisible");
        }
    }

    mapData() {
        this.task.title = this.elementTitle.value;
        this.task.descr = this.elementDescr.value;
        this.task.dueDate = this.elementDueDate.valueAsDate;
        this.task.finish = this.elementFinish.checked;
        this.task.importance = this.tmp_importance;
    }

    updateAndDisplayImportance(importance) {
        this.tmp_importance = importance;
        this.elementPopupImportanceValues.forEach((element, index) =>
            index < importance ? element.classList.add("chosen") : element.classList.remove("chosen")
        );
    }
}
