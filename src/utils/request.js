import axios from 'axios'
import store from '@/store'
import router from '@/router'
import to from 'await-to-js'

import { refreshTokenAPI } from '@/api/user'

// 为了能单独维护axios的配置，提取一个请求工具模块

// 创建axios实例并配置
export const baseURL = 'http://geek.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  // 获取token
  const token = store.state.user.token
  // 如果有token就配置到请求头里携带到服务器
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, err => Promise.reject(err))

// 响应拦截器
instance.interceptors.response.use(res => res.data, async err => {
  // token失效
  if (err.response && err.response.status === 401) {
    // 刷新token
    const [err, res] = await to(refreshTokenAPI(store.state.user.refreshToken))
    // 刷新失败
    if (err) {
      // 清除token
      store.commit('user/setToken', '')
      // 跳转到登录页，并将失效时的页面地址作为参数传递给login，在用户重新登录时进行回跳
      router.push('/login?returnUrl=' + encodeURIComponent(router.currentRoute.fullPath))
    } else {
      // 刷新成功，更新token
      store.commit('user/setToken', res.data.token)
      // 重新发送一下失败的请求
      return instance(err.config)
    }
  }
  return Promise.reject(err)
})

// 导出axios实例调用接口的函数，返回值promise
export default ({ url, method = 'get', params, data, headers }) => {
  const promise = instance({ url, method, params, data, headers })
  return to(promise)
}
