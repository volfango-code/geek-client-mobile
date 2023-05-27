import request from '@/utils/request'

// 关注 和 取消关注
export const followAuthor = (author, isFollow) => {
  if (isFollow) {
    return request({
      url: '/v1_0/user/followings',
      method: 'POST',
      data: { target: author }
    })
  } else {
    return request({
      url: '/v1_0/user/followings/' + author,
      method: 'delete'
    })
  }
}

// 获取当前用户信息
export const getUserInfo = () => {
  return request({
    url: '/v1_0/user'
  })
}

// 获取当前用户资料
export const getUserProfile = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}

// 编辑资料-修改头像
export const updateUserPhoto = formData => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: formData
  })
}

// 编辑资料-修改信息
export const updateUserProfile = user => {
  return request({
    url: '/v1_0/user/profile',
    method: 'patch',
    data: user
  })
}

// 编辑资料-修改性别
