import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000

})// 创建一个axios 实例
// 新建一个请求拦截器
// 拦截器两个参数成功1 失败2
service.interceptors.request.use((config) => {
  // 注入token
  // 这里这么写是错误的 this.$store.getters 因为这里不是组件内部，所以可以用store引入的方式
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, (error) => {
  // 失败执行promise
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use((res) => {
  // axios 默认有data
  const { data, message, success } = res.data
  if (success) {
    return data
  } else {
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async(error) => {
  // error.message
  // token超市
  if (error.response.status === 401) {
    Message({ type: 'warn', message: 'token 超时' })
    // 删除token操作,一定要切记action是一个promise
    await store.dispatch('user/logout')// 退出登录
    // 跳转登录页面
    router.push('/login')
    return Promise.reject(error)
  }
  // 这里这么写也是错的this.$message(参考this.$store.getters) 不在组件内所以可以用Message引入的方式
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})
export default service
