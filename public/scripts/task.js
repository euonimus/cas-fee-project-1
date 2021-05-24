export default class Task {
  constructor(id, title ="", descr ="", createDate = new Date(), dueDate = new Date(), importance = 3, finished = false) {
    this.id = id;
    this.title = title;
    this.descr = descr;
    this.createDate = createDate;
    this.dueDate = dueDate;
    this.importance = importance;
    this.finished = finished;
  }
}