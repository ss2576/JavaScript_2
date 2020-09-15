Vue.component("cart", {
  data() {
    return {
      imgCart: "https://placehold.it/50x100",
      cartItems: [],
      showCart: false
    };
  },
  methods: {
    addProduct(product) {
      let find = this.cartItems.find(
        el => el.id_product === product.id_product
      );
      if (find) {
        find.quantity++;
        this.$parent.putJson(`${CartAPI}/${find.id_product}`, find.quantity);
      } else {
        let prod = Object.assign({ quantity: 1 }, product);
        this.cartItems.push(prod);
        this.$parent.postJson(`${CartAPI}`, prod);
      }
    },
    remove(item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.$parent.putJson(`${CartAPI}/${item.id_product}`);
      } else {
        this.cartItems.splice(this.cartItems.indexOf(item), 1);
        // this.$parent.deleteJson(`${CartAPI}/${item.id_product}`, item);
        this.$parent.deleteJson(`${CartAPI}/${item.id_product}`);
      }
    }
  },
  mounted() {
    this.$parent.getJson(`${CartAPI}`).then(data => {
      for (let el of data.contents) {
        this.cartItems.push(el);
      }
    });
  },
  template: `
        <div>
            <button class="btn-cart" type="button" @click="showCart = !showCart">Корзина</button>
            <div class="cart-block" v-show="showCart">
                <p v-if="!cartItems.length">Корзина пуста</p>
                <cart-item class="cart-item" 
                v-for="item of cartItems" 
                :key="item.id_product"
                :cart-item="item" 
                :img="imgCart"
                @remove="remove">
                </cart-item>
            </div>
        </div>`
});

Vue.component("cart-item", {
  props: ["cartItem", "img"],
  template: `
                <div class="cart-item">
                    <div class="product-bio">
                        <img :src="img" alt="Some image">
                        <div class="product-desc">
                            <p class="product-title">{{cartItem.product_name}}</p>
                            <p class="product-quantity">Количество: {{cartItem.quantity}}</p>
                            <p class="product-single-price">{{cartItem.price}}₽ за единицу</p>
                        </div>
                    </div>
                    <div class="right-block">
                        <p class="product-price">{{cartItem.quantity*cartItem.price}}₽</p>
                        <button class="del-btn" @click="$emit('remove', cartItem)">&times;</button>
                    </div>
                </div>
    `
});