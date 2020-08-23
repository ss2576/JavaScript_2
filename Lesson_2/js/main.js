const DEFAULT_IMAGE = 'img/default.jpg';

class Products {
    constructor(container = `.products`) {
        this.container = container;
        this.data = [];
        this.allProduct = [];
        this.init();
    }
    init() {
        this.fetchProducts();
        this.render();
    }
    fetchProducts() {
        this.data = [
            {id: 1, title: 'Notebook', price: 2000, image: ''},
            {id: 2, title: 'Keyboard', price: 200, image: ''},
            {id: 3, title: 'Mouse', price: 47, image: 'mouse.jpg'},
            {id: 4, title: 'Gamepad', price: 87, image: ''},
            {id: 5, title: 'Chair', price: 187, image: ''},
            {id: 6, title: 'Chair 2', image: ''},
            {id: 7, title: 'Chair 3', price: 187},
            {id: 8, title: 'Chair 4', price: null},
        ];
    }
    render() {
        const block = document.querySelector(this.container);
        for (let item of this.data) {
            const product = new ProductItem(item);
            this.allProduct.push(product);
            block.insertAdjacentHTML('beforeend', product.render());
        }
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
        this.id = item.id;
        this.title = item.title;
        this.price = item.price;
        if (item.image) {
            this.image = 'img/' + item.image;
        } else {
            this.image = DEFAULT_IMAGE;
        }

    }
    render() {
        return `<div class="product-item">
                    <img src="${this.image}" alt="" class="product-item__img">
                    <h3>${this.title}</h3>
                    <p>${this.price ? this.price : 'Цена не указана'} ${typeof(this.price) == 'number' ? 'рублей' : ''}</p>
                    <button class="buy-btn btn">Купить</button>
                </div>`
    }
}



const products = new Products();
console.log('цена всех товаров',products.totalPrice(),'рублей');