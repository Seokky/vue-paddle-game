import Vue from 'vue';
import AppError from '@/classes/AppError';
import App from './App.vue';
import router from './router';
import store from './store';

window.AppError = AppError;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
