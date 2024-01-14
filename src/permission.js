import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { asyncRoutes } from '@/router' // 到处动态路由
const whiteList = ['/login', '/404']
// 前置守卫
router.beforeEach(async(to, from, next) => {
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
      // 将获取权限放在这里比较好，不用每个地方都获取一遍权限
      // 判断是否获取过资料
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        // 动态路由中获取到角色有的权限
        const filterRoutes = asyncRoutes.filter(item => {
          return roles.menus.includes(item.name)
        })
        // 重新设置路由
        store.commit('user/setRoutes', filterRoutes)
        // console.log(filterRoutes)
        // 添加路由信息
        // 404要在最后这个也不管，就是这么写的
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        // router添加路由值，需要转发一下
        // 目的是让路由拥有信息，你不要管直接抄就可以
        next(to.path)
      } else {
        next() // 放行
      }
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
