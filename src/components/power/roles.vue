<template>
  <div>
    <!-- 面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>校色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区  -->
    <el-card class="">
      <!-- 添加角色按钮去  -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域  -->
      <el-table border stripe :data="power.roles">
        <!-- 展开列 type="expand" -->
        <el-table-column label="" type="expand" header-align="center" align="center" width="60px">
          <template slot-scope="scope">
            <el-row :class="['borderBottom', i1 === 0 ? 'borderTop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id" >
              <!--渲染一级权限-->
              <el-col :span="5" >
                <el-tag closable type="primary" @close="deleteRoleById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"/>
              </el-col>
              <!--渲染二/三级权限-->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'borderTop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id" >
                  <!--渲染二级权限-->
                  <el-col :span="6">
                    <el-tag closable type="success" @close="deleteRoleById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"/>
                  </el-col>
                  <!--渲染三级权限-->
                  <el-col :span="18">
                    <el-tag closable type="warning" :class="[i3 === 0 ? '' : 'borderTop']" v-for="(item3, i3) in item2.children" :key="item3.id" @close="deleteRoleById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" header-align="center" align="center" width="60px"/>
        <el-table-column prop="roleName" label="角色名称" width="180"/>
        <el-table-column prop="roleDesc" label="角色描述" width="180"/>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <!-- 修改用户 -->
            <el-tooltip content="修改" placement="bottom" effect="dark" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            </el-tooltip>
            <!-- 删除用户 -->
            <el-tooltip content="删除" placement="bottom" effect="dark" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-tooltip>
            <!-- 分配用户角色 -->
            <el-tooltip content="分配权限" placement="bottom" effect="dark" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限分配对话框 -->
    <el-dialog title="分配权限" :close-on-click-modal="false" :visible.sync="setRightDialog.visible" @close="setRightDialogClose" width="50%">
      <!-- 内容主体区域 -->
      <el-form ref="setRightDialogRef">
        <el-tree ref="rightDialogTreeRef" show-checkbox node-key="id" :data="rightsDialog.data" :props="rightsDialog.defaultProps" :default-checked-keys="rightsDialog.defaultKey">
        </el-tree>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      viewType: 'list',
      power: {
        roles: []
      },
      setRightDialog: {
        visible: false
      },
      rightsDialog: {
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        roleId: '',
        data: {},
        defaultKey: []
      }
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    addRole () {

    },
    async getRoles () {
      const response = await this.$http.get('roles')
      const data = response.data
      if (data.meta.status !== 200) {
        return this.$message.error('获取角色数据失败')
      }
      this.power.roles = data.data
    },
    async deleteRoleById (role, rightId) {
      const confirmData = await this.$confirm('是否删除当前用户角色数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err
      })

      if (confirmData !== 'confirm') {
        return this.$message.info('删除用户取消!')
      }

      const response = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      const data = response.data
      if (data.meta.status !== 200) {
        return this.$message.error('删除权限数据失败')
      }

      role.children = data.data
    },
    // 通过递归的形式，获取角色下得三级权限ID,并保持到数组中
    getLastKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLastKeys(item, arr))
    },
    // 分配权限对话框
    async showSetRightDialog (row) {
      this.rightsDialog.roleId = row.id
      console.log(row.id)

      // 以树形方式，获取全部权限数据
      const response = await this.$http.get('rights/tree')
      if (response.data.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightsDialog.data = response.data.data

      this.rightsDialog.defaultKey = []
      this.getLastKeys(row, this.rightsDialog.defaultKey)

      this.setRightDialog.visible = true
    },
    // 关闭分配权限对话框
    setRightDialogClose () {
    },
    // 点击确定关闭权限对话框
    async setRightDialogOk () {
      const checkeds = [...this.$refs.rightDialogTreeRef.getCheckedKeys(),
        ...this.$refs.rightDialogTreeRef.getHalfCheckedKeys()]
      const ids = checkeds.join(',')

      const response = await this.$http.post(`roles/${this.rightsDialog.roleId}/rights`, { rids: ids })
      const data = response.data
      if (data.meta.status !== 200) {
        return this.$message.error('角色授权失败')
      }
      this.$message.success('角色授权成功')
      this.getRoles()
      this.setRightDialog.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}

.borderTop{
  border-top: solid 1px #eee;
}

.borderBottom{
  border-bottom: solid 1px #eee;
}

.vcenter{
  display: flex;
  align-items: center;
}
</style>
