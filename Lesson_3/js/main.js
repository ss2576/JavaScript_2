const DEFAULT_IMAGE = 'img/default.jpg';
const API = `https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses`;



class Products {
    constructor(container = `.products`) {
        this.container = container;
        this.data = [];
        this.allProduct = [];
        this._getProducts()
            .then(() => this._render());
        this._init();
    }
    _getProducts() {
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .then(data => {
                this.data = [...data];
            })
            .catch(error => console.log(error));
    }
    _render() {
        const block = document.querySelector(this.container);
        for (let item of this.data) {
            const product = new ProductItem(item);
            this.allProduct.push(product);
            block.insertAdjacentHTML('beforeend', product.render());
        }
    }
    _init() {
        document.querySelector(this.container).addEventListener('click', event => {
            if (event.target.classList.contains('buy-btn')) {
                const id = +event.target.dataset['id'];
                cart.addItem(this.getItemById(id)); //Не продумал этот момент. Как лучше указать на экземпляр другого класса, если в этом классе нет ссылок на него? Через структуру-карту?
            }
        });
    }
    getItemById(id) {
        return this.allProduct.find(elem => elem.id_product === id);
    }
    totalPrice() {
        let totalPrice = 0;
        for (let item of this.data) {
            if (typeof(item.price) == 'number') {
                totalPrice += item.price;
            }
        }
        return totalPrice;
    }
}

class ProductItem {
    constructor(item) {
        this.id_product = item.id_product;
        this.product_name = item.product_name;
        this.price = item.price;
        if (item.image) {
            this.image = 'img/' + item.image;
        } else {
            this.image = DEFAULT_IMAGE;
        }

    }
    render() {
        return `<div class="product-item" data-id="${this.id_product}">
                    <img src="${this.image}" alt="" class="product-item__img">
                    <h3>${this.product_name}</h3>
                    <p>${this.price ? this.price : 'Цена не указана'} ${typeof(this.price) == 'number' ? 'р.' : ''}</p>
                    <button class="buy-btn btn" data-id="${this.id_product}">Купить</button>
                </div>`
    }
}

class Cart {
    constructor(cartDiv = `.cart`) {
        this.items = []; //Массив с добавленными в корзину товарами (объекты класса CartItem)
        this.totalPrice = 0; //Общая стоимость корзины
        this.totalCount = 0; //Общее кол-во товаров в корзине
        this.cartDiv = cartDiv; //Указатель на див с содержимым корзины.
        this._setCart()
            .then(() => this._render())
            .then(() => this._init());
    }
    requestJson(url) {
        return fetch(url)
            .then(result => result.json())
            .catch(error => console.log(error));
    }
    _setCart() {
        return fetch(`${API}/getBasket.json`)
            .then(result => result.json())
            .then(inCart => {
                this.totalPrice = inCart.amount;
                this.totalCount = inCart.countGoods;
                for (let item of inCart.contents) {
                    this.items.push(new CartItem(item.id_product, item.product_name, item.price, item.quantity));
                }
            })
            .catch(error => console.log(error));
    }
    _render() {
        const block = document.querySelector(`.cart-content`);
        let totalPrice = 0;
        let totalCount = 0;
        block.innerHTML = '';
        for (let item of this.items) {
            block.insertAdjacentHTML('beforeend', item.render());
            totalCount += item.quantity;
            totalPrice += item.price * item.quantity;
        }
        this.totalPrice = totalPrice;
        this.totalCount = totalCount;
        document.querySelector('#cartTotalCount').textContent = this.totalCount;
        document.querySelector('#cartTotalPrice').textContent = this.totalPrice;
    }
    _update(cartItem, newFlag = false) {
        if (newFlag) {
            const block = document.querySelector(`.cart-content`);
            block.insertAdjacentHTML('beforeend', cartItem.render());
        } else if (cartItem) {
            const block = document.querySelector(`.cart-element[data-id="${cartItem.id_product}"]`);
            block.querySelector(`.cart-quantity`).textContent = cartItem.quantity;
            block.querySelector(`.cart-posPrice`).textContent = cartItem.price * cartItem.quantity;
        }
        let totalPrice = 0;
        let totalCount = 0;
        this.items.forEach(item => {
            totalCount += item.quantity;
            totalPrice += item.price * item.quantity;
        })
        this.totalPrice = totalPrice;
        this.totalCount = totalCount;
        document.querySelector('#cartTotalCount').textContent = this.totalCount;
        document.querySelector('#cartTotalPrice').textContent = this.totalPrice;
    }
    _init() {
        document.querySelector(this.cartDiv).addEventListener('click', event => {
            if (event.target.classList.contains('btn-plus')) {
                this.requestJson(`${API}/addToBasket.json`).then(data => {
                    if (data.result) {
                        const id = +event.target.dataset['id'];
                        this.items[this.getItemById(id)].plusCount();
                        this._update(this.items[this.getItemById(id)]);
                    }
                });
            } else if (event.target.classList.contains('btn-minus')) {
                this.requestJson(`${API}/deleteFromBasket.json`).then(data => {
                    if (data.result) {
                        const id = +event.target.dataset['id'];
                        if (this.items[this.getItemById(id)].minusCount()) {
                            this._update(this.items[this.getItemById(id)]);
                        } else {
                            this.deleteItem(this.getItemById(id));
                            this._update();
                        }
                    }
                });
            } else if (event.target.classList.contains('btn-delete')) {
                this.requestJson(`${API}/deleteFromBasket.json`).then(data => {
                    if (data.result) {
                        const id = +event.target.dataset['id'];
                        this.deleteItem(this.getItemById(id));
                        this._update();
                    }
                });
            } else if (event.target.classList.contains('btn-clear')) {
                this.requestJson(`${API}/deleteFromBasket.json`).then(data => {
                    if (data.result) {
                        this.clear();
                    }
                });
            }
        });
        document.querySelector(`.btn-cart`).addEventListener('click', event => {
            document.querySelector(this.cartDiv).classList.toggle('invisible');
        });
    }
    clear() {
        this.items.forEach((item, i) => {
            this.deleteItem(i);
        });
        for (let item of this.items) {
            this.deleteItem(this.items.indexOf(item));
        }
        this._update();
    }
    addItem(item) {
        this.requestJson(`${API}/addToBasket.json`)
            .then(data => {
                if (data.result) {
                    let find = this.items.find(elem => elem.id_product === item.id_product); //Опять указатель на экземпляр другого класса :(
                    if (find) {
                        find.plusCount();
                        this._update(find);
                    } else {
                        let newItem = new CartItem(item.id_product, item.product_name, item.price);
                        this.items.push(newItem);
                        this._update(newItem, true);
                    }
                }
            });
    }
    deleteItem(index) {
        document.querySelector(`.cart-element[data-id="${this.items[index].id_product}"]`).remove();
        this.items.splice(index, 1);
    }
    getItemById(id) {
        let index = null;
        this.items.forEach((item, i) => {
            if (item.id_product == id) {
                index = i;
            }
        });
        return index;
    }
}

class CartItem {
    constructor(id_product, product_name, price, quantity) {
        this.id_product = id_product;
        this.product_name = product_name;
        this.price = price;
        this.quantity = quantity ? quantity : 1;
    }
    plusCount() {
        this.quantity++;
    }
    minusCount() {
        this.quantity--;
        return this.quantity;
    }
    render() {
        return `<div class="cart-row cart-element" data-id="${this.id_product}">
                    <div>${this.product_name}</div>
                    <div class="cart-price">${this.price}</div>
                    <div>
                        <i class="fas fa-plus btn-plus text-hover" data-id="${this.id_product}"></i>
                        <div class="cart-quantity">${this.quantity}</div>
                        <i class="fas fa-minus btn-minus text-hover" data-id="${this.id_product}"></i>
                    </div>
                    <div class="cart-posPrice">${this.price*this.quantity}</div>
                    <div class="btn btn-delete" data-id="${this.id_product}">Удалить</div>
                </div>`;
    }
}

const products = new Products();
const cart = new Cart();