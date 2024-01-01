import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
const state = {
  token: getToken() // 缓存读取读取数据
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
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
