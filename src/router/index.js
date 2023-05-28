import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 解决重复导航一个地址报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 路由懒加载
const Tabbar = () => import('@/components/tabbar')
const Home = () => import('@/views/home')
const Question = () => import('@/views/question')
const Video = () => import('@/views/video')
const User = () => import('@/views/user')
const UserProfile = () => import('@/views/profile')
const UserChat = () => import('@/views/user/chat')
const Artcile = () => import('@/views/article')
const Login = () => import('@/views/login')

const routes = [
  // 一级路由，使用命名视图实现共同布局的复用
  { path: '/', components: { default: Home, tabbar: Tabbar } },
  { path: '/question', components: { default: Question, tabbar: Tabbar } },
  { path: '/video', components: { default: Video, tabbar: Tabbar } },
  { path: '/user', components: { default: User, tabbar: Tabbar } },
  { path: '/user/profile', component: UserProfile },
  { path: '/user/chat', component: UserChat },
  { path: '/article', component: Artcile },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  routes
})

// 导航守卫，使用前置导航守卫拦截未登录却访问用户页面的情况
router.beforeEach((to, from, next) => {
  // 获取token
  const token = store.state.user.token
  // 没登录却访问user下的路由
  if (!token && to.path.startsWith('/user')) {
    // 重定向到登录页，将用户想请求的路由通过参数传递给login，用于在完成登录时回跳
    return next('/login?returnUrl=' + encodeURIComponent(to.fullPath))
  }
  // 其他情况放行
  next()
})

export default router
