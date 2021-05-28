export class Task {
  constructor(id, title ="", descr ="", createDate = new Date(), dueDate = new Date(), importance = 3, finish = false) {
    this.id = id;
    this.title = title;
    this.descr = descr;
    this.createDate = createDate;
    this.dueDate = dueDate;
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
      finish: this.finish
    };
  }
}