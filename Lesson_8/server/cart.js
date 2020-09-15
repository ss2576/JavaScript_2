const statTracker = require('./stat_tracker.js');

const add = (cart, req) => {
  cart.contents.push(req.body);
  statTracker.eventReg("add", req.body.product_name); // Трэкинг через функцию
  return JSON.stringify(cart, null, 4);
};
const change = (cart, req) => {
  const find = cart.contents.find(el => el.id_product === +req.params.id);
  find.quantity = req.body.quantity;
  new statTracker.StatObj('change', find.product_name).statReg(); // Трэкинг через объект
  return JSON.stringify(cart, null, 4);
};
const del = (cart, req) => {
  const find = cart.contents.findIndex(el => el.id_product === +req.params.id);
  statTracker.eventReg("delete", cart.contents[find].product_name); // Трэкинг через функцию
  cart.contents.splice(find, 1);
  return JSON.stringify(cart, null, 4);
};

module.exports = {
  add,
  change,
  del
};