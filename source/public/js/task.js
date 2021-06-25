/* global giveDate */
export default class Task {
  constructor(title = '', descr = '', dueDate = giveDate(3), importance = 3, finish = false) {
    this._id = undefined;
    this.title = title;
    this.descr = descr;
    this.createDate = new Date();
    this.dueDate = new Date(dueDate);
    this.importance = importance;
    this.finish = finish;
  }
}
