import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import router from '@/router/index'
import axios from 'axios'
import moment from 'moment'
// import myHttp from '@/plugins/http.js'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.filter('fmdate',(v)=>{
  return moment(v).format('YYYY-MM-DD')
})
Vue.prototype.$http = axios
Vue.use(ElementUI);

// Vue.use(myHttp)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
