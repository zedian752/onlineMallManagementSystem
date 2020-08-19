import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
/*plugin*/
import './plugins/element.js'
/*css */
import './assets/css/global.css'
/*iconFont*/
import  './assets/iconFont/iconfont.css'

Vue.config.productionTip = false
// axios设置拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem("token");
  return config;
})
// axios设置根地址
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$axios=axios;


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
