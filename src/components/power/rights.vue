<template>
  <div>
    <!-- 面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区  -->
    <el-card class="">
      <!-- 用户列表区域 -->
      <el-table border stripe :data="power.rights">
        <el-table-column label="序号" type="index" header-align="center" align="center" width="60px"/>
        <el-table-column prop="authName" label="权限名称" width="180"/>
        <el-table-column prop="path" label="路径" width="180"/>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'" type="primary">一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      viewType: 'list',
      power: {
        rights: []
      }
    }
  },
  created () {
    this.getRights()
  },
  methods: {
    async getRights () {
      const response = await this.$http.get(`rights/${this.viewType}`)
      const data = response.data
      if (data.meta.status !== 200) {
        return this.$message.error('获取用户权限列表失败')
      }
      this.power.rights = data.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
