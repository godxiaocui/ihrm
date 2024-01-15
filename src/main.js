import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 注册自定义指令.控制权限功能
Vue.directive('permission', {
  // 会在指令作用的元素再插入dom之后执行
  inserted(el, bingding) {
    // el 是当前指令作用的dom元素的对象
    // button 是v-permission="表达式" 表达式的信息
    // 这路有长链路的时候有可能会有null报错，所以用?.比较好
    console.log(el, bingding)
    // 这里为了获取到再vuex的userinfo下的points属性
    const points = store.state.user.userInfo?.roles?.points || []
    // bingding.value 可以拿到传入的表达式的值
    // v-permission="test" 这里的bingding.value就是等于test
    if (!points.includes(bingding.value)) {
      // 移除元素
      el.remove
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
