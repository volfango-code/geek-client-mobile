const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '', // 打包结果，希望以File协议（双击打开）， 写成 空字符串，或者 './' 都可以
  productionSourceMap: false, // 取消生成 xxx.map 文件
  // less全局变量
  css: {
    loaderOptions: {
      less: {
        // 这里定义不需要加@，使用的时候需要加@
        globalVars: {
          'geek-color': '#FC6627',
          'geek-gray-color': '#F7F8FA'
        }
      }
    }
  }
})
