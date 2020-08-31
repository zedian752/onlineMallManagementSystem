import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import axios from 'axios'
/*plugin*/
// import './plugins/element.js'
/*css */
import './assets/css/global.css'
/*iconFont*/
import  './assets/iconFont/iconfont.css' 
// 富文本编辑器
// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)
// 网页加载进度条
import nProgress from 'nprogress/nprogress'
import 'nprogress/nprogress.css'
// 
Vue.config.productionTip = false
// axios设置request拦截器
axios.interceptors.request.use(config=>{
  nProgress.start();
  config.headers.Authorization=window.sessionStorage.getItem("token");
  return config;
})
// axios设置根地址
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

// axios设置response拦截器
axios.interceptors.response.use(config=>{
  nProgress.done();
  return config;
})
debugger
Vue.prototype.$axios=axios;
// 全局过滤器//用于商品列表的时间格式处理
Vue.filter('dateFormat',function(originVal){
  const date = new Date(originVal);
  const years = date.getFullYear();
  const months = (date.getMonth()+1+'').padStart(2,'0');
  const days = (date.getDate()+'').padStart(2,'0');
  const hours = (date.getHours()+'').padStart(2,'0');
  const minutes = (date.getMinutes()+'').padStart(2,'0');
  const seconds = (date.getSeconds()+'').padStart(2,'0');
  return `${years}-${months}-${days} ${hours}-${minutes}-${seconds}`;
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
