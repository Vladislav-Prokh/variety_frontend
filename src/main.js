import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n';
import router from './router';
import  store  from './store/index.js';
import axiosInstance from './axious-conf.js';



const app = createApp(App);
app.config.globalProperties.$axios = axiosInstance;
app.use(i18n);
app.use(router);
app.use(store);
app.mount('#app');