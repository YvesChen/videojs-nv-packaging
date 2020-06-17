import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Util } from "./assets/util/util";
import { vueVideo } from "./assets/util/video-util/vue-video";
import i18n from  "./assets/util/i18n";
import index from './index';
Vue.use(index);
Vue.prototype.$Util=Util;
Vue.prototype.$vueVideo=vueVideo;
Vue.config.productionTip = false;
new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount("#app");
