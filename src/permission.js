import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
const whiteList = ['/login', '/404']
// 前置守卫
router.beforeEach((to, from, next) => {
  // 通过

  // 开启进度条
  nprogress.start()
  // 判断有没有token
  if (store.getters.token) {
    // 存在token,如果是登录页就直接去主页
    if (to.path === '/login') {
      // 跳转到主页
      next('/') // 中转到主页
      // next（地址）并没有执行后置守卫
      nprogress.done()
    } else {
      next() // 放行
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login') // 中转到登录页
      nprogress.done()
    }
  }
  next()
})
// 后置守卫
router.afterEach(() => {
  // 关闭进度条
  nprogress.done()
})
