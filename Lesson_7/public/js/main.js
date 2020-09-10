const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
const ProdAPI = 'http://localhost:3000/api/products';// Почему ругается, если ставить https://
const CartAPI = 'http://localhost:3000/api/cart';

const app = new Vue({
    el: '#app',
    methods: {
        getJson(url){
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    this.$refs.error.setError(error);
                })
        },
        postJson(url, product) {
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(product)
            })
            .catch(error => {
                this.$refs.error.setError(error);
            })
        },
        putJson(url, quantity) {
            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8' // Не понял, как передать просто число
                },
                body: JSON.stringify({"quantity" : quantity}) // Можно переадвать сразу весь объект корзины с кол-вом
            })
            .catch(error => {
                this.$refs.error.setError(error);
            })
        },
        deleteJson(url) {
            return fetch(url, {
                method: 'DELETE',
            })
            .catch(error => {
                this.$refs.error.setError(error);
            })
        }
    }
});