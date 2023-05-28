import request from '@/utils/request'
import store from '@/store'

// 获取所有频道
export const getAllChannels = () => {
  return request({ url: 'v1_0/channels' })
}

// 获取用户频道
export const getUserChannel = async () => {
  // 如果未登录就获取本地存储数据
  if (!store.state.user.token) {
    const localData = JSON.parse(localStorage.getItem('geek-client-mobile-channels')) || []
    // 本地有数据就直接返回
    if (localData.length) {
      return localData
    } else {
      // 没有数据就获取线上数据保存到本地
      const [, res] = await getAllChannels()
      localStorage.setItem('geek-client-mobile-channels', JSON.stringify(res.data.channels))
      return res.data.channels
    }
  } else {
    // 已登录，获取用户频道数据
    const [, res] = await request({ url: 'v1_0/user/channels' })
    return res.data.channels
  }
}

// 添加用户频道
export const addChannelAPI = async userChannel => {
  // 如果未登录就添加到本地存储
  if (!store.state.user.token) {
    const localData = JSON.parse(localStorage.getItem('geek-client-mobile-channels')) || []
    // 最后的频道就是要更新的
    const { id, name } = userChannel[userChannel.length - 1]
    // 追加到数组并存储到本地
    localData.push({ id, name })
    localStorage.setItem('geek-client-mobile-channels', JSON.stringify(localData))
  } else {
    // 已登录，发送请求更新频道数据
    await request({
      url: 'v1_0/user/channels',
      method: 'put',
      data: {
        channels: userChannel
      }
    })
  }
}

// 删除频道
export const delChannelAPI = async id => {
  // 如果未登录，删除本地存储中的数据
  if (!store.state.user.token) {
    const localData = JSON.parse(localStorage.getItem('geek-client-mobile-channels')) || []
    const index = localData.findIndex(item => item.id === id)
    localData.splice(index, 1)
    localStorage.setItem('geek-client-mobile-channels', JSON.stringify(localData))
  } else {
    // 已登录，发送请求删除频道数据
    await request({
      url: 'v1_0/user/channels/' + id,
      method: 'delete'
    })
  }
}
