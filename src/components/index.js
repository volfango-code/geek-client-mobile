import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 使用相对时间插件
dayjs.extend(relativeTime)
// 设置语言
dayjs.locale('zh-cn')
export default {
  install (Vue) {
    // 扩展Vue功能
    Vue.filter('relativeTime', (value) => {
      return dayjs(value).toNow()
    })
  }
}
