Vue.component("filters", {
  data() {
    return {
      userSearch: "",
    };
  },
  mounted() {
    this.productsAPI = this.$root.$refs.products;
	},
  template: `
    <form action="#" class="search-form" @submit.prevent="productsAPI.filter(userSearch)">
            <input type="text" class="search-field" v-model="userSearch" />
            <button class="btn-search" type="submit">
              <i class="fas fa-search"></i>
            </button>
          </form>  
    `
});
