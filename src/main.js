import Vue from 'vue'
import App from './views/App.vue'
// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// vcharts
import VCharts from 'v-charts'
// router
import router from './router.js'
// ajax
import './api.js'
// config
import { global } from './mixin.js'
import session, { checkSession } from './session.js'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VCharts)
Vue.mixin(global)
Vue.mixin(session)

checkSession().then(() => {
    new Vue({
        router,
        render: h => h(App),
    }).$mount('#app')
}).catch(e => {
    alert(e)
})