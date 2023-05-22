import request from '@/utils/request'

// 登录
export const userLogin = (data) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data
  })
}

// 发送验证码
export const sendMessage = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}
