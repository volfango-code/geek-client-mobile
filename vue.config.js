const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
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
