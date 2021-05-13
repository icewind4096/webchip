<template>
  <el-container class="homeContainer">
    <!-- 头部区域 -->
    <el-header>Header</el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 左侧边栏区域 -->
      <el-aside width="200px">Aside</el-aside>
      <!-- 右侧主题区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>

</script>

<style lang="less" scoped>
.homeContainer{
  height: 100%;
}

.el-header{
  background-color: #373d41;
}

.el-aside{
  background-color: #333744;
}

.el-main{
  background-color: #EAEDF1;
}

</style>
