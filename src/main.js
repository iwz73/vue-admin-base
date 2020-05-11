/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-19 21:54:17
 * @LastEditTime: 2020-05-08 16:40:16
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import Viewer from 'viewerjs'

import '@/styles/index.scss' // global css
import './assets/css/layout.scss'
import App from './App'
import store from './store'
import router from './router'
import './directives'
import '@/icons' // icon
import '@/permission' // permission control
// import VueSocketIO from 'vue-socket.io'
// import '@/assets/font-awesome/css/font-awesome.css'
import '@/assets/font/iconfont.css'
import '@/assets/css/articleoutline.css'
import '@/assets/css/autoc.css'

// import Autoc from '@/utils/autoc.js'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
import Print from 'vue-print-nb'
import vueJsonp from 'vue-jsonp'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// import vueXlsxTable from 'vue-xlsx-table'
// Vue.use(vueXlsxTable, { rABS: false })
// Vue.use(Autoc)

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI)
const viewerOption = {
  inline: false,
  title: false,
  fullscreen: false,
  rotatable: true,
  scalable: false,
  zIndex: 99999
}
Vue.use(Print)
// Vue.use(new VueSocketIO({
//   debug: true,
//   // 服务器端地址
//   connection: 'http://localhost:5000'
// }))
Vue.use(vueJsonp)

Vue.prototype.Viewer = Viewer
// Vue.prototype.Autoc = Autoc

Viewer.setDefaults(viewerOption)



Vue.config.productionTip = false

// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: h => h(App)
// })

// 预渲染
new Vue({
  router,
  store,
  mounted() {
    document.dispatchEvent(new Event('render-event'))
  },
  render: h => h(App)
}).$mount('#app')
