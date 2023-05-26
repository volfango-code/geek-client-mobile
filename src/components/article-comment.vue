<template>
  <div class="article-comment">
    <!-- 全部评论 -->
    <van-sticky offset-top="11.73333vw">
      <div class="title van-hairline--bottom">
        <span>全部评论 ({{currentArticle.comm_count}})</span>
        <span>{{currentArticle.like_count}} 点赞</span>
      </div>
    </van-sticky>
    <!-- 评论列表 -->
    <div class="list">
      <van-list v-model="loading" :finished="finished" finished-text="没有评论了" @load="onLoad">
          <div class="item van-hairline--bottom" v-for="comment in comments" :key="comment.com_id">
            <van-image round width="10vw" height="10vw" :src="comment.aut_photo"/>
            <div class="info">
              <p>
                <span class="name">{{comment.aut_name}}</span>
                <span class="zan">{{comment.like_count}} <geek-icon :name="comment.is_liking?'like-sel':'like2'" /></span>
              </p>
              <p class="cont">{{comment.content}}</p>
              <p>
                <span class="reply" @click="clickReply(comment)">{{comment.reply_count}}回复 <i class="van-icon van-icon-arrow"></i></span>
                <span class="time">{{comment.pubdate | relativeTime}}</span>
              </p>
            </div>
          </div>
      </van-list>
    </div>
    <!-- 底部工具 -->
     <div class="footer van-hairline--top">
      <div class="input" @click="showInput=true"><i class="van-icon van-icon-edit"></i></div>
      <div class="btn" @click="$emit('click-comment')">
        <geek-icon name="comment"></geek-icon><p>评论</p>
        <i v-if="currentArticle.comm_count">{{currentArticle.comm_count}}</i>
      </div>
      <div class="btn" @click="likeArticle">
        <geek-icon :name="currentArticle.attitude === 1? 'like-sel':'like'"></geek-icon><p>点赞</p>
      </div>
      <div class="btn" @click="collectArticle">
        <geek-icon :name="currentArticle.is_collected?'collect-sel':'collect'"></geek-icon>
        <p>收藏</p>
      </div>
      <div class="btn"><geek-icon name="share"></geek-icon><p>分享</p></div>
    </div>
    <!-- 回复弹层 -->
    <van-popup v-model="reply.open" position="right" @closed="currentComment={}">
      <!-- 头 -->
      <van-nav-bar left-arrow @click-left="reply.open=false" :title="`${currentComment.reply_count}`+'条回复'" />
      <div class="reply-wrapper list">
         <van-list :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有回复了" @load="loadReply">
            <!-- 列表 -->
            <div class="item van-hairline--bottom" v-for="reply in reply.list" :key="reply.com_id">
              <van-image round width="10vw" height="10vw" :src="reply.aut_photo"/>
              <div class="info">
                <p>
                  <span class="name">{{reply.aut_name}}</span>
                  <span class="zan">{{reply.like_count}} <geek-icon name="like2" /></span>
                </p>
                <p class="cont">{{reply.content}}</p>
                <p><span class="time" style="margin-left:0">{{reply.pubdate | relativeTime}}</span></p>
              </div>
            </div>
         </van-list>
      </div>
      <!-- 底 -->
      <div class="footer van-hairline--top" style="position:static">
        <div class="input big" @click="showInput = true"><i class="van-icon van-icon-edit"></i></div>
        <div class="btn">
          <geek-icon name="collect"></geek-icon><p>收藏</p>
        </div>
        <div class="btn"><geek-icon name="share"></geek-icon><p>分享</p></div>
      </div>
    </van-popup>
    <!-- 评论&回复 -->
    <van-popup v-model="showInput" position="bottom">
      <van-nav-bar left-arrow @click-left="showInput=false" :title="currentComment.com_id?'回复评论':'评论文章'" right-text="发表" @click-right="submit"/>
      <van-field
        v-model="text"
        rows="3"
        autosize
        type="textarea"
        maxlength="100"
        :placeholder="currentComment.com_id?`@${currentComment.aut_name}`:'请输入评论'"
        show-word-limit
      />
    </van-popup>
  </div>
</template>
<script>
import GeekIcon from '@/components/geek-icon'
import { getCommentsByArticle, likeArticle, collectArticle, getReplyByComment, commentOrReply } from '@/api/article'
export default {
  name: 'ArticleComment',
  data () {
    return {
      // 是否加载完成
      loading: false,
      // 数据是否全部加载完毕
      finished: false,
      // 根据last_id决定下一页请求的数据
      offset: null,
      // 评论数据
      comments: [],
      // 当前文章，props修改不了copy一份
      currentArticle: this.article,
      // 当前评论
      currentComment: {},
      // 回复
      reply: {
        open: false,
        loading: false,
        finished: false,
        offset: null,
        list: []
      },
      // 显示输入弹框
      showInput: false,
      // 评论内容
      text: ''
    }
  },
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    GeekIcon
  },
  methods: {
    async onLoad () {
      // 获取评论数据
      const [, res] = await getCommentsByArticle(this.currentArticle.art_id, this.offset)
      // 如果last_id与end_id一致，说明没有数据了
      console.log(this.currentArticle)
      if (res.data.last_id === res.data.end_id) {
        // 加载完毕
        this.finished = true
      } else {
        // 记录last_id，用于下次请求
        this.offset = res.data.last_id
      }
      // 将数据追加到评论数组中
      this.comments.push(...res.data.results)
      // 加载完成
      this.loading = false
    },
    // 点赞&取消点赞
    async likeArticle () {
      if (this.currentArticle.attitude === 1) {
        const [err] = await likeArticle(this.currentArticle.art_id, false)
        if (err) return this.$toast.fail('操作失败！')
        this.currentArticle.attitude = -1
        this.currentArticle.like_count--
        this.$toast.success('不赞了')
      } else {
        const [err] = await likeArticle(this.currentArticle.art_id, true)
        if (err) return this.$toast.fail('操作失败！')
        this.currentArticle.attitude = 1
        this.currentArticle.like_count++
        this.$toast.success('已赞')
      }
    },
    // 收藏&取消收藏
    async collectArticle () {
      console.log(this.article)
      const [err] = await collectArticle(this.currentArticle.art_id, !this.currentArticle.is_collected)
      if (err) return this.$toast.fail('操作失败')
      this.currentArticle.is_collected = !this.currentArticle.is_collected
      if (this.currentArticle.is_collected) this.$toast.success('收藏成功')
      else this.$toast.success('已取消收藏')
    },
    // 点击回复按钮
    clickReply (comment) {
      // 记录当前评论
      this.currentComment = comment
      // 评论弹框
      this.reply.open = true
      // 加载中
      this.reply.loading = true
      // 重置
      this.reply.list = []
      // 重置请求参数
      this.reply.offset = null
      // 开始加载
      this.loadReply()
    },
    // 加载回复
    async loadReply () {
      // 获取回复数据
      const [, res] = await getReplyByComment(this.currentComment.com_id, this.reply.offset)
      // 追加到数组中
      this.reply.list.push(...res.data.results)
      // 判断数据是否已经全部加载完毕
      if (res.data.last_id === res.data.end_id) {
        this.reply.finished = true
      } else {
        // 记录last_id，用于下次请求
        this.reply.offset = res.data.last_id
      }
      // 加载完成
      this.reply.loading = false
    },
    // 发布评论或回复
    async submit () {
      // 根据currentComment.com_id判断用户是评论还是回复，评论操作currentComment没有com_id，因为回复弹层被关闭时会清空currentComment
      if (!this.currentComment.com_id) {
        // 如果没有输入内容
        if (!this.text) return this.$toast.fail('请输入评论')
        // 发送评论请求
        const [err, res] = await commentOrReply(this.article.art_id, this.text)
        if (err) return this.$toast.fail('评论失败')
        // 评论成功
        // 将评论插入到数组中
        this.comments.unshift(res.data.new_obj)
        // 文章评论条数+1
        this.currentArticle.comm_count++
        // 关闭弹框
        this.showInput = false
        // 清空输入框
        this.text = ''
        // 提示发布成功
        this.$toast.success('发送成功')
      } else {
        // 回复
        // 如果没有输入内容
        if (!this.text) return this.$toast.fail('请输入回复')
        // 发送评论请求
        const [err, res] = await commentOrReply(this.currentComment.com_id, this.text, this.article.art_id)
        if (err) return this.$toast.fail('回复失败')
        // 回复成功
        // 将回复插入到数组中
        this.reply.list.unshift(res.data.new_obj)
        // 文章评论条数+1
        this.currentArticle.comm_count++
        // 评论回复条数+1
        this.currentComment.reply_count++
        // 关闭弹框
        this.showInput = false
        // 清空输入框
        this.text = ''
        // 提示发布成功
        this.$toast.success('回复成功')
      }
    }
  },
  // 默认加载评论，否则点击评论按钮滚动位置不准确
  created () {
    this.loading = true
    this.onLoad()
  }
}
</script>
<style scoped lang="less">
.article-comment {
  .title {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    background: #fff;
    span {
      font-size: 16px;
      &:last-child {
        color: #ccc;
        font-size: 14px;
      }
    }
  }
  .list {
    padding: 0 16px;
    .item {
      display: flex;
      padding: 10px 0;
      .info {
        padding-left: 10px;
        flex: 1;
        p {
          margin: 0;
          .name {
            font-size: 16px;
          }
          .zan {
            font-size: 14px;
            float: right;
            color: #999;
            .geek-icon {
              font-size: 12px;
              position: relative;
              top: -1px;
            }
          }
          &.cont {
            font-size: 14px;
            color: #666;
            padding: 10px 0;
            word-break: break-all;
            padding-right: 40px;
          }
          .reply {
            min-width: 60px;
            height: 24px;
            text-align: center;
            line-height: 28px;
            font-size: 12px;
            background: @geek-gray-color;
            display: inline-block;
            border-radius: 14px;
            color: #666;
            .van-icon {
              position: relative;
              top: 1px;
            }
          }
          .time {
            font-size: 12px;
            color: #999;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
 .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 50px;
    background: #fff;
    display: flex;
    width: 100%;
    align-items: center;
    .input {
      &.big{
        width: 260px;
      }
      margin-left: 10px;
      width: 200px;
      height: 34px;
      background: @geek-gray-color;
      border-radius: 17px;
      line-height: 36px;
      padding-left: 10px;
      .van-icon {
        color: #999;
      }
    }
    .btn {
      flex: 1;
      text-align: center;
      position: relative;
      p {
        margin: 0;
        font-size: 10px;
      }
      .geek-icon {
        font-size: 18px;
      }
      i {
        height: 16px;
        min-width: 16px;
        padding: 0 3px;
        background: @geek-color;
        color: #fff;
        font-size: 10px;
        position: absolute;
        right: 0;
        top: -4px;
        line-height: 16px;
        border-radius: 8px;
        font-style: normal;
      }
    }
  }
  .van-popup {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .reply-wrapper {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
</style>
