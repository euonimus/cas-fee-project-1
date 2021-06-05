/* global giveDate */
export default class Task {
  constructor(id, title = '', descr = '', createDate = giveDate(), dueDate = giveDate(3), importance = 3, finish = false) {
    this.id = id;
    this.title = title;
    this.descr = descr;
    this.createDate = new Date(createDate);
    this.dueDate = new Date(dueDate);
    this.importance = importance;
    this.finish = finish;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      descr: this.descr,
      createDate: this.createDate,
      dueDate: this.dueDate,
      importance: this.importance,
      finish: this.finish,
    };
  }
}
