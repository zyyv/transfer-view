import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import { AxiosPlugin } from './utils/axios'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/main.css'

Vue.use(ElementUI)
Vue.use(AxiosPlugin, { baseURL: 'http://localhost:8080' })

new Vue({
  render: (h) => h(App)
}).$mount('#app')
