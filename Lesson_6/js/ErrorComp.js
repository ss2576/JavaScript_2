Vue.component('errors', {
    props: ['error'],
    data() {
        return {
        }
    },
    template: `
    <div class="errorBlock" v-show="error"> Server error have happened. </div>
    `
});
