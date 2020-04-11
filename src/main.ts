import Vue from 'vue';
import AppError from '@/classes/AppError';
import App from './App.vue';
import router from './router';

window.AppError = AppError;

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
