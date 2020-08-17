import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import './plugins/element.js'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
