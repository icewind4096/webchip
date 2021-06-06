<template>
  <div>
    <!-- 面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区  -->
    <el-card class="">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table border stripe :data="userData.users">
        <el-table-column label="序号" type="index" header-align="center" align="center" width="60px"/>
        <el-table-column prop="username" label="姓名" width="180"/>
        <el-table-column prop="email" label="电子邮箱" width="180"/>
        <el-table-column prop="mobile" label="电话"/>
        <el-table-column prop="role_name" label="角色"/>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!-- 修改用户 -->
            <el-tooltip content="修改" placement="bottom" effect="dark" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除用户 -->
            <el-tooltip content="删除" placement="bottom" effect="dark" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 分配用户角色 -->
            <el-tooltip content="分配权限" placement="bottom" effect="dark" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="roleUser(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        :current-page="pagination.page"
        :total="pagination.total"
        :page-size="pagination.size"
        :page-sizes="[5, 10, 20]"
        layout="sizes, prev, pager, next, jumper, ->, total"
        @current-change="changeCurrentPage"
        @size-change="changePageSize"/>
    </el-card>

    <!-- 用户对话框 -->
    <el-dialog :title="userDialog.title" :close-on-click-modal="false" :visible.sync="userDialog.visible" @close="userDialogClose" width="450px">
      <!-- 内容主体区域 -->
      <el-form ref="userFormRef" :model="userForm" :rules="userFormRule" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" :disabled="userDialog.mode === 'edit'" style="width: 140px"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password" v-show="userDialog.mode !== 'edit'">
          <el-input v-model="userForm.password" style="width: 140px"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" style="width: 240px"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userForm.mobile" style="width: 140px"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="userFormOk">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 权限分配对话框 -->
    <el-dialog title="分配权限" :close-on-click-modal="false" :visible.sync="userRoleDialog.visible" @close="setRightDialogClose" width="50%">
      <!-- 内容主体区域 -->
      <el-form ref="RoleDialogRef">
        <p>当前用户: {{userRoleDialog.userName}}</p>
        <p>当前角色: {{userRoleDialog.role}}</p>
        <p>分配新角色:
          <el-select v-model="userRoleDialog.currentRoleId" placeholder="请选择">
            <el-option
              v-for="item in userRoleDialog.roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="userRoleDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="UserRoleDialogOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱规则
    var validateEMail = (rule, value, callback) => {
      const regEMail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEMail.test(value)) {
        return callback()
      } else {
        return callback(new Error('错误的邮箱地址'))
      }
    }
    // 验证手机号码规则
    var validateMobile = (rule, value, callback) => {
      const regMboile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regMboile.test(value)) {
        return callback()
      } else {
        return callback(new Error('错误的手机号码'))
      }
    }
    return {
      // 用户列表查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 分页
      pagination: {
        total: 0, // 总记录数
        page: 1, // 页码
        size: 5 // 每页记录数
      },
      userData: {},
      userRoleDialog: {
        visible: false,
        id: '',
        userName: '',
        role: '',
        currentRoleId: '',
        roles: []
      },
      userDialog: {
        title: '',
        visible: false,
        mode: ''
      },
      userForm: {
        id: 0,
        userName: '',
        password: '',
        email: '',
        mobile: ''
      },
      userFormRule: {
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度至少为6个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: validateEMail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      this.queryInfo.pagenum = this.pagination.page
      this.queryInfo.pagesize = this.pagination.size

      const response = await this.$http.get('users', { params: this.queryInfo })
      if (response.data.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userData = response.data.data

      this.pagination.total = this.userData.total
    },
    // 改编页码
    changeCurrentPage (page) {
      this.pagination.page = page
      this.getUserList()
    },
    // 改变每页记录数
    changePageSize (size) {
      this.pagination.size = size
      this.getUserList()
    },
    // 改变用户状态
    async userStateChange (userInfo) {
      const response = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (response.data.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('修改用户状态失败')
      }
      return this.$message.success('修改用户状态成功')
    },
    // 添加用户
    addUser () {
      this.userDialog.visible = true
      this.userDialog.mode = 'add'
      this.userDialog.title = '添加用户'
    },
    // 修改用户
    async editUser (userId) {
      const response = await this.$http.get(`users/${userId}`)
      const data = response.data
      if (data.meta.status === 200) {
        this.userForm.id = userId
        this.userForm.password = '123456'
        this.userForm.userName = data.data.username
        this.userForm.mobile = data.data.mobile
        this.userForm.email = data.data.email

        this.userDialog.visible = true
        this.userDialog.mode = 'edit'
        this.userDialog.title = '修改用户'
      } else {
        this.$message.error('获取用户数据失败')
      }
    },
    // 删除用户
    async deleteUser (userId) {
      const confirmData = await this.$confirm('是否删除当前用户信息，一经删除将无法恢复？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err
      })

      if (confirmData !== 'confirm') {
        this.$message.info('删除用户取消!')
      } else {
        const response = await this.$http.delete(`users/${userId}`)
        const data = response.data
        if (data.meta.status === 200) {
          this.$message.success('删除用户成功!')
          this.pagination.page = 1
          this.getUserList()
        } else {
          this.$message.success('删除用户失败!')
        }
      }
    },
    // 用户对话框关闭
    userDialogClose () {
      this.$refs.userFormRef.resetFields()

      this.userForm.id = 0
      this.userForm.password = ''
      this.userForm.userName = ''
      this.userForm.mobile = ''
      this.userForm.email = ''
    },
    // 用户对户框点击确定按钮
    userFormOk () {
      this.$refs.userFormRef.validate(async (valid) => {
        if (valid) {
          if (this.userDialog.mode === 'add') {
            const response = await this.$http.post('users', {
              username: this.userForm.userName,
              password: this.userForm.password,
              email: this.userForm.email,
              mobile: this.userForm.mobile
            })
            const data = response.data
            if (data.meta.status !== 201) {
              return this.$message.error('添加用户失败')
            }
            this.$message.success('添加用户成功')
          } else {
            const response = await this.$http.put(`users/${this.userForm.id}`, {
              email: this.userForm.email,
              mobile: this.userForm.mobile
            })
            const data = response.data
            if (data.meta.status !== 200) {
              return this.$message.error('修改用户失败')
            }
            this.$message.success('修改用户成功')
          }
          this.userDialog.visible = false
          this.getUserList()
        }
      })
    },
    // 分配角色对话框
    async roleUser (row) {
      // 获取角色列表
      const response = await this.$http.get('roles')
      const data = response.data
      if (data.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }

      this.userRoleDialog.id = row.id

      this.userRoleDialog.roles = data.data

      this.userRoleDialog.userName = row.username
      this.userRoleDialog.role = row.role_name
      this.userRoleDialog.currentRoleId = ''

      this.userRoleDialog.visible = true
    },
    async UserRoleDialogOk () {
      if (!this.userRoleDialog.currentRoleId) {
        return this.$message.error('用户未分配角色，请选择新角色')
      }

      const response = await this.$http.put(`users/${this.userRoleDialog.id}/role`, {
        rid: this.userRoleDialog.currentRoleId
      })

      const data = response.data
      if (data.meta.status !== 200) {
        return this.$message.error('分配用户角色失败')
      }
      this.$message.success('分配用户角色成功')

      this.getUserList()

      this.userRoleDialog.visible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
