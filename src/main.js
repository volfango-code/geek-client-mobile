import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from 'vant'
import 'vant/lib/index.css'
import timePlugin from './components/index'

Vue.config.productionTip = false
Vue.use(vant)
Vue.use(timePlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
