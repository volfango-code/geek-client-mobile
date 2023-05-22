<template>
  <div class="app-tabber">
    <van-tabbar route>
      <van-tabbar-item to="/">
        <template #icon="props">
          <GeekIcon :name="props.active ? 'home-sel':'home'"/>
        </template>
        首页
      </van-tabbar-item>
      <van-tabbar-item icon="question-o" to="/question">
        <template #icon="props">
          <GeekIcon :name="props.active ? 'qa-sel':'qa'"/>
        </template>
        问答
      </van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">
        <template #icon="props">
          <GeekIcon :name="props.active ? 'video-sel':'video'"/>
        </template>
        视频
      </van-tabbar-item>
      <van-tabbar-item icon="user-circle-o" to="/user">
        <template #icon="props">
          <GeekIcon :name="props.active ? 'mine-sel':'mine'"/>
        </template>
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import GeekIcon from '@/components/geek-icon'
export default {
  name: 'GeekTabbar',
  data () {
    return {

    }
  },
  components: {
    GeekIcon
  }
}
</script>

<style lang="less" scoped>
.van-tabbar {
  background-color: @geek-gray-color;
  position: static;
}
/deep/ .van-tabbar-item--active {
  color: @geek-color;
  background-color: @geek-gray-color
}
/deep/ .van-tabbar-item__icon {
  font-size: 20px;
}
/deep/ .van-tabbar-item__text {
  font-size: 10px;
}
</style>
