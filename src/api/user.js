import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 调用接口
export function getUserInfo() {
  return request({
    url: '/sys/profile'
  })
}
