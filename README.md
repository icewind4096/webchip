# webchip

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

15课

#套路

###样式
1. 必须定义全局样式规则, 位于src/assets/css/global.css
```css
html, body, #app{
    height: 100%;       // 高为100%
    margin: 0;          // 无外边距 
    padding: 0;         // 无内边距
}
```
2. 在main.js中使用import导入全局样式表
```js
import './assets/css/global.css'  // 导入全局样式表
```

###引入字体库
1. 在main.js中导入字体样式表
```js
// 导入全局字体库
import './assets/fonts/iconfont.css'
```
###引用Element组件
1. 安装 npm i element-ui -S
2. 在main.js中导入组件文件 
```js
import './plugins/element.js'
```
2. 在plugins目录中，在element.js中导入需要使用的组件
```js
import { Button, Form, FormItem, Input } from 'element-ui'
```
3. 注册需要使用的组件
```js
 Vue.use(Form)
 Vue.use(FormItem)
 Vue.use(Input)
``` 
4. 坑点
Message的使用方式和其他的组件使用方式不一样，需要挂载到VUE中使用, 使用的原理和使用axios一致
```js
   Vue.prototype.$message = Message
   此时可以使用this.$message访问Message组件
```   

###路由

####规则
>位于router/index.js中
```js
import Login from '../components/login' //需要路由到的组件

const routes = [
// 重定向规则
{ path: '/', redirect: '/login' },      //默认无url，重定向到/login
{ path: '/login', component: Login }    //url=login，使用login组件
]
```
#####子路由规则
1. 定义子路由
```js
const routes = [
  // 子路由规则，访问了/home，此时会重定向到/welcome页面
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome }
    ]
  }
]
```
2. 在对应的html中，放置路由占位符
```html
  <!-- 右侧主题区域 -->
  <el-main>
    <!-- 路由占位符 用于子路由-->
    <router-view></router-view>
  </el-main>
```

3. 在el-Menu中，设置router属性为true
```html
    <el-menu router="true" >
```

4.修改el-menu-item 的index属性为目标路由地址
```html
    设置index的值为目标路由地址, "/"必须有，否则和路由配置对不上
    <el-menu-item :index="/xxx">
```
####守护
如果某一个url需要登录或者其他特殊条件才可以访问，则使用导航守卫实现
```js
// 挂载路由导航守卫
// to 将要访问的路径
// from 由那个路径跳转而来
// next是一个函数,表示放行
//   next() 放行
//   next(url) 强制跳转的路径
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next

  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')

  next()
})
```


###使用axios，发送ajax请求
1. 在main.js中导入axios
```js
//导入axios
import axios from 'axios'
```
2. 挂载axios到vue
```js
//设置axios请求的根路径
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
//挂载axios到vue
  Vue.prototype.$http = axios
```
3. 配置axios的请求拦截器
此示例是为header部分，添加了一个Authorization字段，字段值为sessionStorage中取出的token字段
```js
  axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    //必须return config
    return config
})
```

###数据本地持久化
```js
// 把服务器返回的token保存在客户端的sessionStorage中
  window.sessionStorage.setItem('键值', 需要保存的数据)
```

###路由页面
```js
this.$router.push('你需要路由跳转的地址')
```

###element ui使用
####table
1. 自动序号 
```html
<el-table-column label="此列为序号" type="index"/>
```
2. 展开列, 在此列出现一个 '>' , 表示可以展开
```html
<el-table-column label="此列可以展开" type="expand"/>
```
