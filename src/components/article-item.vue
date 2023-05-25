<template>
 <div>
  <div class="article-item van-hairline--bottom" @click="$router.push('/article?id='+article.art_id)">
    <p class="title van-multi-ellipsis--l2" :class="{'w66':article.cover.type === 1}">{{article.title}}</p>
    <img v-for="(img,index) in article.cover.images" :src="img" :key="index" alt="" class="img">
    <div class="info">
      <span>{{article.aut_name}}</span>
      <span>{{article.comm_count}}评论</span>
      <span>{{article.pubdate|relativeTime}}</span>
      <GeekIcon name="esay-close" @click.native="print(article)"></GeekIcon>
    </div>
  </div>
 </div>

</template>

<script>
import GeekIcon from '@/components/geek-icon.vue'
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    GeekIcon
  }
}
</script>

<style scoped lang="less">
.article-item {
  padding: 15px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .title {
    width: 100%;
    margin: 0;
    line-height: 22px;
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
    max-height: 44px;
    &.w66 {
      width: 66%;
    }
  }
  .img {
    width: 112px;
    height: 74px;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  .info {
    width: 100%;
    color: #A5A6AB;
    font-size: 12px;
    position: relative;
    span {
      margin-right: 12px;
    }
    .geek-icon {
      float: right;
      font-size: 14px;
    }
  }
}
</style>
