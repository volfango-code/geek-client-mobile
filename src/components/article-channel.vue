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
        <a class="edit" @click="isEdit=!isEdit" :class="{active:isEdit}" href="javascript:;"> {{isEdit?'完成':'编辑'}}</a>
      </div>
      <div class="body">
        <a href="javascript:;"
        :class="{'active':activeIndex === index}"
        v-for="(channel,index) in allChannels"
        :key="channel.id"
        @click="enterChannel(index)">{{channel.name}}
          <GeekIcon
            v-show="isEdit && index!==0 && index!== activeIndex"
            name="tag-close"
            @click.native.stop="delChannel(channel.id)">
          </GeekIcon>
        </a>
      </div>
      <div class="head" style="margin-top:12px">
        <h3>频道推荐</h3>
      </div>
      <div class="body">
        <a @click="addChannel(channel)" href="javascript:;" v-for="channel in optionalChannels" :key="channel.id">+ {{channel.name}}</a>
      </div>
    </div>
  </van-popup>
</template>
<script>
import GeekIcon from '@/components/geek-icon'
import { getAllChannels, delChannel, addChannel } from '@/api/channel'
export default {
  name: 'ArticleChannel',
  data () {
    return {
      allChannels: [],
      // 是否编辑
      isEdit: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    channels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    optionalChannels () {
      // 如果在allChannels中找不到的频道说明是可选的
      return this.channels.filter(item => !this.allChannels.find(c => {
        // console.log(c.name)
        return c.id === item.id
      }))
    }
  },
  watch: {
    allChannels: {
      immediate: true,
      handler (val) {
        this.$emit('channelsTemp', val)
      }
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    // 获取所有频道
    async getAllChannels () {
      const channels = await getAllChannels()
      this.allChannels = channels
    },
    // 进入频道
    enterChannel (index) {
      // 隐藏频道弹出层
      this.$emit('input', false)
      // 传递频道索引进行频道切换
      this.$emit('update:activeIndex', index)
    },
    // 删除频道
    async delChannel (id) {
      // 调用删除频道API
      await delChannel(id)
      // 删除成功，更新数据
      const index = this.allChannels.findIndex(item => item.id === id)
      this.allChannels.splice(index, 1)
    },
    // 添加频道
    async addChannel (channel) {
      // 1. 使用重置式添加频道数据，准备重置式的数据
      const newMyChannels = []
      this.allChannels.forEach((c, i) => {
        // 推荐是固定的，不参与操作排除掉
        if (i !== 0) {
          newMyChannels.push({
            id: c.id,
            name: c.name,
            seq: i
          })
        }
      })
      console.log(newMyChannels)
      newMyChannels.push({ ...channel, seq: newMyChannels.length + 1 })
      // 2. 去做添加频道操作
      await addChannel(newMyChannels)
      // 3. 成功：更新我的频道
      this.allChannels.push(channel)
    }
  },
  components: {
    GeekIcon
  }
}
</script>
<style scoped lang="less">
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
.van-popup{
  width: 100%;
  height: 100%;
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
  }
}
</style>
