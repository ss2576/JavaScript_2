const fs = require("fs");

// В файле представлены две реализации механизма отслеживания операций пользователя.
// Затрудняюсь сказать, какая из них лучше.

// ООП реализация
class StatObj {
  constructor(action, name) {
    this.action = action;
    this.name = name;
    this.time = new Date();
    console.log('statobj created');
  }
  statReg() {
    fs.readFile("./server/db/stats.json", "utf-8", (err, data) => {
      let events = JSON.parse(data);
      events.push({
        action: this.action,
        name: this.name,
        time: new Date()
      });
      fs.writeFile("./server/db/stats.json", JSON.stringify(events, null, 4), err => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
}

// Функциональная реализация
const eventReg = (action, name) => {
  fs.readFile("./server/db/stats.json", "utf-8", (err, data) => {
    let events = JSON.parse(data);
    events.push({
      action: action,
      name: name,
      time: new Date()
    });
    fs.writeFile("./server/db/stats.json", JSON.stringify(events, null, 4), err => {
      if (err) {
        console.log(err);
      }
    });
  });
};

module.exports = {
  StatObj,
  eventReg
};