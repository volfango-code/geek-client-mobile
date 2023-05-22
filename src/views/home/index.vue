<template>
  <div class="home-page">
    <!-- 顶部导航 -->
    <van-tabs animated>
      <van-tab v-for="channel in channels" :title="channel.name" :key="channel.id">
        <ArticleList :channelId="channel.id"/>
      </van-tab>
    </van-tabs>
    <!-- 搜索、频道 -->
    <div class="btn-wrapper">
      <geekIcon name="search"></geekIcon>
      <geekIcon name="channel"></geekIcon>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
import geekIcon from '@/components/geek-icon'
import ArticleList from '@/components/article-list.vue'
export default {
  name: 'HomePage',
  data () {
    return {
      channels: []
    }
  },
  components: {
    geekIcon,
    ArticleList
  },
  async created () {
    // 获取所有频道
    const [err, res] = await getAllChannels()
    if (!err) this.channels = res.data.channels
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
