const API =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

// Переделать в ДЗ
let getRequest = url => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          reject("Error");
        } else {
          resolve(xhr.responseText);
        }
      }
    };
    xhr.send();
  });
};

getRequest(`${API}/catalogData.json`)
  .then(result => console.log(JSON.parse(result)))
  .catch(error => `Error: ${error}`);

class ProductItem {
  constructor(product, img = "img/default.jpg") {
    this.title = product.product_name;
    this.price = product.price;
    this.id = product.id_product;
    this.img = img;
  }

  render() {
    return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.title}</h3>
                    <p>${this.price} \u20bd</p>
                    <button class="buy-btn" data-id="${this.id}">Купить</button>
                </div>
            </div>`;
  }
}

class ProductList {
  constructor(container = ".products") {
    this.container = container;
    this.goods = [];
    this.allProducts = [];
    this._getProducts().then(data => {
      this.goods = [...data];
      this._render();
    });
  }

  _getProducts() {
    return fetch(`${API}/catalogData.json`)
      .then(result => result.json())
      .catch(error => {
        console.log("Error: ", error);
      });
  }

  _render() {
    const block = document.querySelector(this.container);

    for (let product of this.goods) {
      const productObject = new ProductItem(product);
      this.allProducts.push(productObject);
      block.insertAdjacentHTML("beforeend", productObject.render());
    }
  }
}

class ProductCart {
  constructor() {
    // this.userID = userID; // идентификатор пользователя или сеанса, добавить позже
    this.goods = []; // массив покупок
    this.total = 0; // общая сумма товаров, пока под вопросом, возможно не нужна.
    this._renderCart();
  }

  _addProduct(product) {
    // Добавление в корзину или увеличение кол-ва товара в корзине
    let index = this.goods.findIndex(
      element => element[0].id_product === product.id_product
    );

    if (index === -1) {
      this.goods.push([product, 1]);
    } else {
      this.goods[index][1]++;
    }
    this._renderCart();
  }

  _removeProduct(product) {
    // Уменьшение кол-ва товара в корзине. Если кол-во равно 0, то товар убирается из корзины.
    let index = this.goods.findIndex(
      element => element[0].id_product === product.id_product
    );
    if (this.goods[index][1] === 1) {
      this._deleteProduct(product);
    } else {
      this.goods[index][1]--;
    }
    this._renderCart();
  }

  _deleteProduct(product) {
    // Убрать товар из корнизы полностью (все кол-во).
    this.goods.splice(
      this.goods.findIndex(
        element => element[0].id_product === product.id_product
      ),
      1
    );
    this._renderCart();
  }

  _calcTotal() {
    this.total = 0;
    this.goods.forEach(element => {
      this.total += element[0].price * element[1];
    });
    return this.total;
  }

  _renderCart() {
    var cartBlock = document.querySelector(".cart-block");
    cartBlock.innerHTML = "";
    if (this.goods.length != 0) {
      cartBlock.innerHTML += `Ваши покупки: <hr>`;
      var htmlStr = "";
      for (let i = 0; i < this.goods.length; i++) {
        htmlStr += `<div class="cart-item"><div class="cart-item_desc"><p>${
          this.goods[i][0].product_name
        }: ${this.goods[i][0].price * this.goods[i][1]}
          </p></div><div class="cart-item-btnblock"><button class="add-btn" data-id="${
            this.goods[i][0].id_product
          }">+</button><button class="rem-btn" data-id="${
          this.goods[i][0].id_product
        }">-</button><button class="del-btn" data-id="${
          this.goods[i][0].id_product
        }">x</button></div></div>`;
      }
      cartBlock.innerHTML += htmlStr;
      cartBlock.innerHTML += `<hr> Итоговая сумма: ${this._calcTotal()}`;
    } else cartBlock.innerHTML += `<p>Ваша корзина пуста :(</p>`;
  }
}

class Listeners { // Класс обработчиков событий.
  constructor(list, cart) {
    this.allProducts = document.querySelector(".products");
    this.cartBtn = document.querySelector(".btn-cart");
    this.cartBody = document.querySelector(".cart-block");
    this.list = list;
    this.cart = cart;
    this._init();
  }

  _init() {
    this._listenerForCartBody();
    this._listenerForCartItems();
    this._listenerForProducts();
  }

  _listenerForCartBody() {
    this.cartBtn.addEventListener("click", () => {
      document.querySelector(".cart-block").classList.toggle("invisible");
    });
  }

  _listenerForProducts() {
    this.allProducts.addEventListener("click", evt => {
      // Добавление в корзину или увеличение кол-ва товара в корзине по нажатию кнопки "Купить"
      if (evt.target.classList.contains("buy-btn")) {
        this.list.goods.forEach(element => {
          if (element.id_product === +evt.target.dataset["id"]) {
            this.cart._addProduct(element);
          }
        });
      }
    });
  }

  _listenerForCartItems() {
    this.cartBody.addEventListener("click", evt => {
      // Увеличение кол-ва товара в корзине
      if (evt.target.classList.contains("add-btn")) {
        this.list.goods.forEach(element => {
          if (element.id_product === +evt.target.dataset["id"]) {
            this.cart._addProduct(element);
          }
        });
      } else if (evt.target.classList.contains("rem-btn")) {
        // Уменьшение кол-ва товара в корзине. Если кол-во равно 0, то товар убирается из корзины.
        this.list.goods.forEach(element => {
          if (element.id_product === +evt.target.dataset["id"]) {
            this.cart._removeProduct(element);
          }
        });
      } else if (evt.target.classList.contains("del-btn")) {
        // Убрать товар из корнизы полностью (все кол-во).
        this.list.goods.forEach(element => {
          if (element.id_product === +evt.target.dataset["id"]) {
            this.cart._deleteProduct(element);
          }
        });
      }
    });
  }
}

window.onload = () => {
  const list = new ProductList();
  let cart = new ProductCart();
  let listeners = new Listeners(list, cart);
};
