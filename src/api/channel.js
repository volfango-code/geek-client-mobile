import request from '@/utils/request'
import store from '@/store'

// 测试单开一个接口，channels要拿到最新的数据才行
export const getAllChannelsTest = () => {
  return request({ url: 'v1_0/user/channels' })
}

// 获取所有频道
export const getAllChannels = async () => {
  // 如果未登录，获取本地存储的数据
  if (!store.state.user.token) {
    const localData = JSON.parse(localStorage.getItem('geek-client-mobile-channels')) || []
    // 如果本地存储有数据，用本地存储数据
    if (localData.length) {
      return localData
    } else {
      // 本地没有数据，请求数据并存储到本地
      const [, res] = await request({ url: 'v1_0/user/channels' })
      localStorage.setItem('geek-client-mobile-channels', JSON.stringify(res.data.channels))
      console.log(res.data.channels)
      return res.data.channels
    }
  } else {
    // 已登录，请求数据
    const [, res] = await request({ url: 'v1_0/user/channels' })
    console.log(res)
    return res.data.channels
  }
}

// 删除频道
export const delChannel = async id => {
  // 未登录，获取本地存储数据
  if (!store.state.user.token) {
    const localData = JSON.parse(localStorage.getItem('geek-client-mobile-channels')) || []
    // 根据频道id删除频道
    const index = localData.findIndex(item => item.id === id)
    localData.splice(index, 1)
    // 重新存储
    localStorage.setItem('geek-client-mobile-channels', JSON.stringify(localData))
  } else {
    // 已登录，发送请求删除频道
    await request({
      url: '/v1_0/user/channels/' + id,
      method: 'delete'
    })
  }
}

// 添加频道
export const addChannel = async (allChannels) => {
  // 未登录
  if (!store.state.user.token) {
    // 获取本地存储数据
    const localData = JSON.parse(localStorage.getItem('geek-client-mobile-channels')) || []
    // 最后一项就是要更新的
    console.log(allChannels[allChannels.length - 1])
    const { id, name } = allChannels[allChannels.length - 1]
    // 追加新频道
    localData.push({ id, name })
    // 存储本地
    localStorage.setItem('geek-client-mobile-channels', JSON.stringify(localData))
  } else {
    await request({
      url: '/v1_0/user/channels',
      method: 'put',
      data: { channels: allChannels }
    })
  }
}
