<template>
  <van-popup
    :value="value"
    @click-close-icon="$emit('input', false)"
    closeable
    position="left"
    @closed="isEdit = false"
  >
    <div class="article-channel">
      <div class="head">
        <h3>我的频道<small>点击进入频道</small></h3>
        <a class="edit" href="javascript:;" @click="isEdit = !isEdit">{{isEdit?'完成':'编辑'}}</a>
      </div>
      <div class="body">
        <a href="javascript:;"
            :class="{active:activeIndex === index}"
            v-for="(channel,index) in userChannels"
            :key="channel.id"
            @click="updateAndClose(index)">
             {{channel.name}}<geek-icon @click.native.stop="delChannel(channel.id)" v-show="isEdit && index!==0 && index!== activeIndex" name="tag-close"></geek-icon>
        </a>
      </div>
      <div class="head" style="margin-top:12px">
        <h3>频道推荐</h3>
      </div>
      <div class="body">
        <a href="javascript:;" @click="addChannel(channel)" v-for="channel in recommendChannel" :key="channel.id">+ {{channel.name}}</a>
      </div>
    </div>
  </van-popup>
</template>
<script>
import { addChannelAPI, delChannelAPI } from '@/api/channel'
import GeekIcon from '@/components/geek-icon.vue'
export default {
  name: 'ArticleChannel',
  data () {
    return {
      // 是否编辑
      isEdit: false
    }
  },
  props: {
    // 频道弹出层的显示隐藏
    value: {
      type: Boolean,
      default: false
    },
    // 所有频道
    channels: {
      type: Array,
      default: () => []
    },
    // 用户频道
    userChannels: {
      type: Array,
      default: () => []
    },
    // 导航索引
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    updateAndClose (index) {
      // 更新导航索引
      this.$emit('update:activeIndex', index)
      // 关闭频道弹层
      this.$emit('input', false)
    },
    // 添加频道
    async addChannel (channel) {
      // 处理频道数据
      const userChannelTemp = []
      this.userChannels.forEach((item, index) => {
        userChannelTemp.push({
          id: item.id,
          name: item.name,
          seq: index
        })
        console.log(index)
      })
      userChannelTemp.push({ ...channel, seq: userChannelTemp.length })
      console.dir(userChannelTemp)
      // 调用接口更新频道数据
      await addChannelAPI(userChannelTemp)
      this.$emit('update:userChannels', userChannelTemp)
    },
    // 删除频道
    async delChannel (id) {
      await delChannelAPI(id)
      // 数据是更新了，但是页面是没刷新的，临时操作数组让页面更新
      const userChannelRender = [...this.userChannels]
      const index = userChannelRender.findIndex(item => item.id === id)
      userChannelRender.splice(index, 1)
      this.$emit('update:userChannels', userChannelRender)
    }
  },
  computed: {
    recommendChannel () {
      return this.channels.filter(item => !(this.userChannels.some(c => item.id === c.id)))
    }
  },
  components: {
    GeekIcon
  }
}
</script>

<style scoped lang="less">
.van-popup {
  width: 100%;
  height: 100%;
  ::v-deep .van-popup__close-icon {
    font-size: 20px;
    right: 12px;
    top: 12px;
  }
}
.article-channel {
  margin-top: 44px;
}
.article-channel {
  margin-top: 44px;
  .head {
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    justify-items: center;
    padding-bottom: 12px;
    h3 {
      font-size: 16px;
      color: #333;
      margin: 0;
      small {
        font-size: 12px;
        color: #999;
        margin-left: 10px;
      }
    }
    .edit {
      float: right;
      height: 22px;
      width: 52px;
      line-height: 22px;
      text-align: center;
      color: #DE644B;
      border-radius: 11px;
      border: 1px solid #DE644B;
      font-size: 12px;
      &.active {
        color: #fff;
        background: #DE644B;
      }
    }
  }
  .body {
    padding: 0 6px 0 16px;
    a {
      position: relative;
      .geek-icon {
        position: absolute;
        top: -5px;
        right: -5px;
        line-height: 1;
      }
      display: inline-block;
      padding: 0 8px;
      font-size:14px;
      color: #3A3948;
      background: #F7F8FA;
      height: 36px;
      line-height: 36px;
      min-width: 78px;
      margin-right: 10px;
      margin-bottom: 12px;
      border-radius: 18px;
      text-align: center;
      &.active {
        color: @geek-color;
      }
    }
  }
}
</style>
