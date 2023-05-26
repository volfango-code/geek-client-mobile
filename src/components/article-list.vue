<template>
    <div class="article-list" ref="ArticleList" @scroll="rememberScroll">
       <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
          <van-list  v-model="loading" :finished="finished" @load="onLoad()" finished-text="没有更多了">
            <article-item v-for="article in articles" :key="article.id" :article="article"/>
          </van-list>
       </van-pull-refresh>
    </div>
</template>

<script>
import ArticleItem from '@/components/article-item'
import { getArticles } from '@/api/article'
export default {
  name: 'ArticleList',
  props: {
    channelId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 正在加载
      loading: false,
      // 数据全部加载完毕
      finished: false,
      // 文章列表
      articles: [],
      // 正在刷新
      refreshing: false,
      // 时间戳
      timestamp: +new Date(),
      // 阅读位置
      scrollTop: 0
    }
  },
  components: {
    ArticleItem
  },
  methods: {
    // 上拉加载
    async onLoad () {
      // 获取文章列表数据
      const [err, res] = await getArticles({
        channel_id: this.channelId,
        timestamp: this.timestamp
      })
      if (err) return console.log(err)
      if (res.data.pre_timestamp) {
        // 如果有时间戳就更新，用于下一次请求使用
        this.timestamp = res.data.pre_timestamp
      } else {
        // 时间戳为空说明数据已经全部加载完成
        this.finished = true
      }
      // 将数据追加到列表中
      this.articles.push(...res.data.results)
      // 加载完成
      this.loading = false
    },
    // 下拉刷新
    async onRefresh () {
      // 更新时间戳
      this.timestamp = +new Date()
      // 获取文章列表数据
      const [err, res] = await getArticles({
        channel_id: this.channelId,
        timestamp: this.timestamp
      })
      if (err) return console.log(err)
      // 刷新完成
      this.refreshing = false
      // 重置为可以上拉加载数据
      this.finished = false
      // 替换列表
      this.articles = res.data.results
    },
    rememberScroll () {
      this.scrollTop = this.$refs.ArticleList.scrollTop
    }
  },
  activated () {
    // 组件被激活时还原阅读位置
    this.$refs.ArticleList.scrollTop = this.scrollTop
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 100%;
  overflow-y: auto;
  padding: 0 16px;
}
</style>
