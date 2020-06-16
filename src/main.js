import Vue from 'vue';
import App from './App.vue';
const VueRouter = require('vue-router');

import MoorUI from './index.js'
Vue.use(MoorUI)
Vue.use(VueRouter)
new Vue({
    el: '#app',
    render: h => h(App)
})
