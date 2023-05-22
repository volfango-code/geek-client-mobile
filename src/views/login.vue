<template>
  <div class="login-page">
    <div class="back">
      <!-- .native绑定组件的原生事件，属于组件根元素 -->
      <!-- $router.back() 返回上一次访问路由，forward go -->
      <geek-icon @click.native="$router.back()" name="esay-close"></geek-icon>
    </div>
    <h3 class="title">短信登录</h3>
    <!-- 表单 -->
    <van-form class="form" ref="form">
      <van-field placeholder="请输入手机号"  v-model="form.mobile" :rules="rules.mobile"></van-field>
      <van-field placeholder="请输入验证码" v-model="form.code" :rules="rules.code">
        <template #button>
          <span class="send" @click="send">{{second===0 ? '发送验证码':`${second}秒后获取`}}</span>
        </template>
      </van-field>
    </van-form>
    <van-button @click="login">登录</van-button>
  </div>
</template>
<script>
import GeekIcon from '@/components/geek-icon'
import to from 'await-to-js'
import { userLogin, sendMessage } from '@/api/index'
export default {
  name: 'LoginPage',
  data () {
    return {
      second: 0,
      timer: null,
      form: {
        mobile: '13811111111',
        code: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不对' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码是6个数字' }
        ]
      }
    }
  },
  methods: {
    // 登录
    async login () {
      // 表单校验，vant格式校验错误也抛异常，用to处理一下
      const [error] = await to(this.$refs.form.validate())
      if (error) return
      // 发送登录请求
      const [err, res] = await userLogin(this.form)
      // 登录成功
      if (!err) {
        // 登录成功，保存token
        this.$store.commit('user/setToken', res.data.token)
        // 回跳token失效页或主页
        this.$router.push(this.$route.query.returnUrl || '/')
      } else {
        // 提示错误信息
        this.$toast.fail(err.response.data.message)
      }
    },
    // 短信发送
    async send () {
      // 如果还在倒计时，不发送
      if (this.second > 0) return
      // 校验手机号
      const [error] = await to(this.$refs.form.validate('mobile'))
      if (error) return
      // 发送短信
      const [err] = await sendMessage(this.form.mobile)
      if (err) return console.log(err)
      // 发送成功，开始一分钟倒计时
      this.second = 60
      // 开启定时器
      this.timer = setInterval(() => {
        this.second--
        // 清除定时器
        if (this.second <= 0) clearInterval(this.timer)
      }, 1000)
    }
  },
  components: {
    GeekIcon
  },
  beforeDestroy () {
    // 组件销毁前清除定时器
    if (this.timer) clearInterval(this.timer)
  }
}
</script>
<style scoped lang="less">
.login-page {
  padding: 0 32px;
  .back {
    height: 60px;
    display: flex;
    align-items: center;
    .geek-icon {
      font-size: 20px;
      color: #ccc;
      position: relative;
      left: -15px;
    }
  }
  .title {
    font-size: 22px;
    line-height: 1;
    padding: 30px 0;
  }
  .van-cell {
    padding: 20px 0;
    &::after{
      left: 0;
      right: 0;
    }
  }
  .van-button {
    width: 100%;
    margin-top: 40px;
    height: 50px;
    color: #fff;
    font-size: 16px;
    border: none;
    background: linear-gradient(to right,#FF9999,#FFA179);
  }
}
  .send{
    font-size: 12px;
    color: #A5A6AB;
  }
</style>
