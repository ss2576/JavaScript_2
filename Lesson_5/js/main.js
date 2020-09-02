const API =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

const app = new Vue({
  el: '#app',
  data: {
    catalogUrl: '/catalogData.json',
    products: [],
    filteredProducts: [],
    imgCatalog: 'https://placehold.it/200x150',
    searchLine: '',
    cart: [],
    isVisibleCart: false,
  },
  methods: {
    getJson(url) {
      return fetch(url)
        .then(result => result.json())
        .catch(error => {
          console.log(error);
        });
    },
    
    addProduct(product) {
      let productIndex = this.cart.findIndex(el => el.id_product === product.id_product);

      if (productIndex != -1) {
        this.cart[productIndex].quantity++;
      } else {
        let cartItem = Object.assign({}, product);
        Vue.set(cartItem, 'quantity', 1);
        this.cart.push(cartItem);
        
      }
    },

    removeProduct(product) {
      let productIndex = this.cart.findIndex(el => el.id_product === product.id_product);

      if (productIndex != -1) {
        if (this.cart[productIndex].quantity > 1) {
          this.cart[productIndex].quantity--;   
        } else {
          this.deleteProduct(product);
        }
      }

    },

    deleteProduct(product) {
      let productIndex = this.cart.findIndex(el => el.id_product === product.id_product);

      if (productIndex != -1) this.cart.splice(productIndex, 1);
    },


    calcCart() {
      return this.cart.reduce((total, el) => total += el.price * el.quantity , 0);
      
    },

    filterGoods() {
      this.filteredProducts = this.products.filter(el =>
        el.product_name.includes(this.searchLine)
      );
    }
  },
  mounted() {
    this.getJson(`${API + this.catalogUrl}`).then(data => {
      for (let el of data) {
        this.products.push(el);
      }
    });
    this.filteredProducts = this.products;
  }
  
});

