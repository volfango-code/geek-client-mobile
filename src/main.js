import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from 'vant'
import 'vant/lib/index.css'
import { timePlugin, highlight } from './components/index'
import '@/assets/styles/index.less'

Vue.config.productionTip = false
Vue.use(vant)
Vue.use(timePlugin)
Vue.use(highlight)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
