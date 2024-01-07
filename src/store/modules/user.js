import { getToken, setToken, removeToken } from '@/views/utils/auth'
import { login, getUserInfo } from '@/api/user'
const state = {
  token: getToken(), // 缓存读取读取数据
  userInfo: {} // 用户基本资料
}

const mutations = {
  // 修改token,mutation第一个参数是state,第二个是传入的值
  setToken(state, token) {
    state.token = token
    // 同步缓存
    setToken(token)
  },
  removeToken(state) {
    // 删除Vuex的token
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}

const actions = {
  // context上下文，传入参数
  async login(context, data) {
    console.log(data)
    // todo 调用登录接口
    const token = await login(data)
    // 返回一个token
    context.commit('setToken', token)
  },
  // 获取用户的基本资料
  async getUserInfo(context) {
    // 获取资料接口
    const res = await getUserInfo()
    context.commit('setUserInfo', res)
  },
  // 删除token重新登录
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户信息
    context.commit('setUserInfo', {})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
