import './polyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router/index'
import { store } from "./store/store.js";
import axios from "axios"
import miniToastr from 'mini-toastr'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

Vue.use(BootstrapVue)

Vue.prototype.$axios = axios;
axios.defaults.baseURL = "https://frontend-excercise.dt.timlabtesting.com/ops";

Vue.prototype.$toast = miniToastr
const toastTypes = {
  success: 'success',
  error: 'error',
  info: 'info',
  warn: 'warn'
};
miniToastr.init({types: toastTypes})
Vue.use(miniToastr);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
