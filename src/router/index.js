import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'

Vue.use(VueRouter)

const routes = [
  // 重定向规则
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/users',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
// to 将要访问的路径
// from 由那个路径跳转而来
// next是一个函数,表示放行
//   next() 放行
//   next(url) 强制跳转的路径
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()

  const token = window.sessionStorage.getItem('token')

  if (!token) return next('/login')

  next()
})

export default router
