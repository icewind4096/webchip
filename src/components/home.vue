<template>
  <el-container class="homeContainer">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/mlogo.png" alt=""/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>

    <!-- 页面主题区域 -->
    <el-container>
      <!-- 左侧边栏区域 -->
      <el-aside :width="asideWidth">
        <!-- 设置菜单栏是否全部展开 -->
        <div class="toggleMenuButton" @click="toggleMenu">|||</div>
        <!-- 左侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true" :collapse="menuCollapse" :collapse-transition="collapeTransition" :router="routerEn" :default-active="activatePath" >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id.toString()" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.iconFontName"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + item.path" v-for="item in item.children" :key="item.id" @click="saveActiveIndexToStorage('/' + item.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧主题区域 -->
      <el-main>
        <!-- 路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      asideWidth: '200px',
      menuCollapse: false,
      collapeTransition: false,
      routerEn: true,
      activatePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activatePath = window.sessionStorage.getItem('activatePath')
  },
  mounted () {
  },
  methods: {
    logOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取全部菜单项
    async getMenuList () {
      const response = await this.$http.get('menus')
      const data = response.data
      if (data.meta.status !== 200) { return this.$message.error(data.meta.msg) }
      this.menuList = data.data
      this.menuList[0].iconFontName = 'iconfont icon-user'
      this.menuList[1].iconFontName = 'iconfont icon-tijikongjian'
      this.menuList[2].iconFontName = 'iconfont icon-shangpin'
      this.menuList[3].iconFontName = 'iconfont icon-danju'
      this.menuList[4].iconFontName = 'iconfont icon-baobiao'
    },
    // 展开/折叠菜单栏
    toggleMenu () {
      this.menuCollapse = !this.menuCollapse
      if (this.menuCollapse) {
        this.asideWidth = '64px'
      } else {
        this.asideWidth = '200px'
      }
    },
    // 保存当前激活菜单的index到sessionstage
    saveActiveIndexToStorage (activatePath) {
      window.sessionStorage.setItem('activatePath', activatePath)
      this.activatePath = activatePath
    }
  }
}
</script>

<style lang="less" scoped>
.homeContainer{
  height: 100%;
}

.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between; //space-between 在两个子元素下 可以实现左右对齐的效果
  padding-left: 0;
  align-items: center;
}

.el-header div{
  display: flex;
  align-items: center;
}

.el-header span{
  color: #fff;
  font-size: 20px;
  margin-left: 15px;
}

.el-aside{
  background-color: #333744;
  //不加此样式，菜单右侧不对齐
  .el-menu {
    border-right: none;
  }
}

.toggleMenuButton{
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  background-color: #4a5064;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-main{
  background-color: #EAEDF1;
}

.iconfont{
  padding-right: 10px;
}

</style>
