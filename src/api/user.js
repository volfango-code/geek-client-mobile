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
