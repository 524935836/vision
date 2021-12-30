import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入全局样式
import '@/assets/css/global.less'
// 引入图标字体
import './assets/font/iconfont.css'
// 对服务器进行WebSocket连接
import SocketService from '@/utils/socket_service'
SocketService.Instance.connect()
// 注册全局对象
Vue.prototype.$socket = SocketService.Instance

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'

Vue.prototype.$http = axios
// 在vue的原型中绑定echarts
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
