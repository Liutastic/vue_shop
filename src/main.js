import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'


import VueQuillEditor from "vue-quill-editor/src";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function(originVal){
    const dt = new Date(originVal)

    const year = dt.getFullYear()
    const month = (dt.getMonth() + 1 + '').padStart(2, '0')
    const day = (dt.getDate()+'').padStart(2, '0')

    const hour = (dt.getHours()+'').padStart(2, '0')
    const minute = (dt.getMinutes()+'').padStart(2, '0')
    const second = (dt.getSeconds()+'').padStart(2, '0')

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})

Vue.prototype.$http = axios
//config是请求的对象，包含很多属性
axios.interceptors.request.use(config => {
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    //必须返回config
    return config
})
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
