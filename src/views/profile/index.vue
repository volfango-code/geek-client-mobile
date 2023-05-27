<template>
  <div class='user-profile-page'>
    <van-nav-bar left-arrow @click-left="$router.back()" title="个人信息"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center @click="showPhoto=true">
        <van-image
          slot="default"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="昵称" :value="user.name || '未填写'" @click="openNamePopup"/>
    </van-cell-group>
    <van-cell-group style="margin-top:12px">
      <van-cell is-link title="性别" :value="user.gender?'女':'男'" @click="showGender=true"/>
      <van-cell is-link title="生日" :value="user.birthday || '未填写'" @click="openBirthdayPopup"/>
    </van-cell-group>
    <div class="logout">
      <span @click="logout">退出登录</span>
    </div>
    <!-- 修改头像-弹出层 -->
    <van-action-sheet
      v-model="showPhoto"
      :actions="[{ name: '拍照', value: 0 },{ name: '本地选择', value: 1 }]"
      @select="onPhotoSelect"
      cancel-text="取消"
    />
    <input @change="updatePhoto" type="file" ref="file" style="display:none">
    <!-- 修改昵称 -->
    <van-popup class="my-popup" v-model="showName" position="right">
      <van-nav-bar
        left-arrow
        @click-left="showName=false"
        right-text="保存"
        title="修改昵称"
        @click-right="saveName"
      />
      <van-field v-model="name"></van-field>
    </van-popup>
    <!-- 修改性别 -->
    <van-action-sheet
      v-model="showGender"
      :actions="[{ name: '男', value: 0 }, { name: '女', value: 1 }]"
      @select="saveGender"
      cancel-text="取消"
    />
    <!-- 修改生日 -->
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        v-model="birthday"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthday=false"
        @confirm="saveBirthday"
      />
    </van-popup>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
export default {
  name: 'UserProfilePage',
  data () {
    return {
      user: {},
      // 修改头像
      showPhoto: false,
      // 修改用户昵称
      showName: false,
      name: '',
      // 修改用户性别
      showGender: false,
      // 修改生日
      showBirthday: false,
      birthday: new Date(),
      minDate: new Date('1960-01-01'),
      maxDate: new Date()
    }
  },
  created () {
    this.initData()
  },
  methods: {
    async initData () {
      // 获取当前用户资料
      const [, res] = await getUserProfile()
      this.user = res.data
    },
    // 退出登录
    logout () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '您确认退出吗？',
        theme: 'round-button'
      }).then(() => {
        // 清除token
        this.$store.commit('user/setToken', '')
        // 重定向到首页
        this.$router.push('/')
        // 提示退出成功
        this.$toast.success('已退出')
      }).catch(e => { console.log(e) })
    },
    // 选择头像
    onPhotoSelect (type) {
      // 拍照-0 本地选择-1
      if (type.value === 1) {
        // 触发文件上传控件，关闭弹框
        this.$refs.file.click()
        this.showPhoto = false
      }
    },
    // 上传头像
    async updatePhoto () {
      // 获取上传头像
      const file = this.$refs.file.files[0]
      // 包装成一个formData对象
      const formData = new FormData()
      formData.append('photo', file)
      // 发送上传请求
      const [err, res] = await updateUserPhoto(formData)
      if (err) return this.$toast.fail('上传失败')
      // 上传成功，显示头像，提示完成
      this.user.photo = res.data.photo
      this.$toast.success('上传成功')
    },
    // 弹出昵称修改弹框
    openNamePopup () {
      // 显示修改弹框
      this.showName = true
      // 显示当前用户昵称以供修改
      this.name = this.user.name
    },
    // 修改昵称
    async saveName () {
      // 没有输入昵称
      if (!this.name) return this.$toast.fail('请输入昵称')
      // 发送请求
      const [err] = await updateUserProfile({ name: this.name })
      if (err) return this.$toast.fail('修改失败')
      // 修改昵称成功，显示昵称，关闭弹框，提示成功
      this.user.name = this.name
      this.showName = false
      this.$toast.success('修改成功')
    },
    // 修改性别
    async saveGender (type) {
      // 发送请求
      const [err] = await updateUserProfile({ gender: type.value })
      if (err) return this.$toast.fail('修改失败')
      // 修改成功，更新性别，关闭弹框，显示成功
      this.user.gender = type.value
      this.showGender = false
      this.$toast.success('修改成功')
    },
    // 弹出生日修改弹框
    openBirthdayPopup () {
      this.showBirthday = true
      // 将当前用户的生日回填到日期控件，供用户修改
      this.birthday = new Date(this.user.birthday)
    },
    // 修改生日
    async saveBirthday () {
      // 转换日期格式
      const date = dayjs(this.birthday).format('YYYY-MM-DD')
      const [err] = await updateUserProfile({ birthday: date })
      if (err) return this.$toast.fail('修改失败')
      // 修改成功，更新生日，关闭弹框，提示成功
      this.user.birthday = date
      this.showBirthday = false
      this.$toast.success('修改成功')
    }
  }
}
</script>
<style lang="less" scoped>
.user-profile-page {
  background: #f8f8f8;
  .van-image {
    display: block;
    float: right;
    width: 30px;
    height: 30px;
  }
  .van-cell__title {
    width: 50px;
    flex: none;
  }
}
.logout {
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 30px;
  width: 100%;
  color: @geek-color;
}
.my-popup {
  width: 100%;
  height: 100%;
  /deep/ .van-nav-bar__text {
    color: @geek-color;
  }
  /deep/ .van-field__control {
    background: @geek-gray-color;
    padding: 10px;
    border-radius: 4px;
  }
}
</style>
