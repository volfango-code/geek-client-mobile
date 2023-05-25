import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'

// 使用相对时间插件
dayjs.extend(relativeTime)
// 设置语言
dayjs.locale('zh-cn')
export const timePlugin = {
  install (Vue) {
    // 相对时间（过滤器）
    Vue.filter('relativeTime', (value) => {
      return dayjs(value).toNow()
    })
  }
}
export const highlight = {
  install (Vue) {
    // 解析code标签，代码高亮（指令）
    Vue.directive('highlight', (el) => {
      const codeList = el.querySelectorAll('pre code')
      codeList.forEach(code => {
        hljs.highlightElement(code)
      })
    })
  }
}
