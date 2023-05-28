<template>
  <div class="home-page">
    <!-- 顶部导航 -->
    <van-tabs animated v-model="activeIndex">
      <van-tab v-for="channel in userChannels" :title="channel.name" :key="channel.id" @>
        <ArticleList :channelId="channel.id"/>
      </van-tab>
    </van-tabs>
    <!-- 搜索、频道 -->
    <div class="btn-wrapper">
      <geekIcon name="search"></geekIcon>
      <geekIcon name="channel" @click.native="showChannel=true"></geekIcon>
    </div>
    <!-- 频道弹出层 -->
    <ArticleChannel v-model="showChannel" :channels="channels" :activeIndex.sync="activeIndex" :userChannels.sync="userChannels"/>
  </div>
</template>

<script>
import geekIcon from '@/components/geek-icon'
import ArticleList from '@/components/article-list'
import { getAllChannels, getUserChannel } from '@/api/channel'
import ArticleChannel from '@/components/article-channel.vue'
export default {
  name: 'HomePage',
  data () {
    return {
      // 所有频道
      channels: [],
      // 用户频道
      userChannels: [],
      // 控制频道弹出层的显示隐藏
      showChannel: false,
      // 导航索引
      activeIndex: 0
    }
  },
  components: {
    geekIcon,
    ArticleList,
    ArticleChannel
  },
  async created () {
    const [, res] = await getAllChannels()
    this.channels = res.data.channels
    this.userChannels = await getUserChannel()
  },
  watch: {

  }

}
</script>

<style lang="less" scoped>
::v-deep .van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  .van-tabs__line {
    background: @geek-color;
    height: 2px;
    width: 32px;
  }
  .van-tab {
    color: #9EA1AE;
  }
  .van-tab--active {
    font-size: 18px;
    color: #333;
  }
  .van-tabs__wrap {
    padding-right: 86px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  .van-tab__pane {
    height: 100%;
  }
}

.home-page {
  .btn-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    width: 86px;
    height: 44px;
    background: #fff;
    display: flex;
    align-items: center;
    .geek-icon {
      flex: 1;
      text-align: center;
      font-size: 18px;
    }
    &::before {
      content: "";
      width: 20px;
      height: 44px;
      position: absolute;
      left: -20px;
      top: 0;
      background: linear-gradient(to right, rgba(255,255,255,0), #fff);
    }
  }
}
</style>
