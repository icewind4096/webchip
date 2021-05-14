<template>
  <div class="loginContainer">
    <!-- 头像区域-->
    <div class="loginBox">
      <div class="avatarBox">
        <img src="../assets/logo.png"/>
      </div>
      <!-- 登录表单区域-->
      <div>
        <el-form ref="loginFormRef" label-width="0px" class="loginForm" :model="loginForm" :rules="loginFormVaild">
          <!-- 用户名 -->
          <el-form-item prop="userName">
            <el-input prefix-icon="iconfont icon-user" v-model="loginForm.userName"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        userName: 'admin',
        password: '123456'
      },
      loginFormVaild: {
        userName: [
          {
            required: true, message: '请输入用户登录名称', trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度至少为6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          const result = await this.$http.post('login', { username: this.loginForm.userName, password: this.loginForm.password })
          const data = result.data
          if (data.meta.status !== 200) {
            return this.$message.error('登录失败')
          }
          // 弹出登录成功提示框
          this.$message.success('登录成功')
          // 把服务器返回的token保存在客户端的sessionStorage中
          console.log(data)
          window.sessionStorage.setItem('token', data.data.token)
          // 把页面路由到/home
          await this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

.loginContainer {
  height: 100%;
  background-color: #2b4b6b;

  .loginBox {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); //是对应于自己的宽、高的50%

    .avatarBox {
      height: 130px;
      width: 130px;
      border: #eee solid 1px;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}

.loginForm{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content: flex-end;    //置于容器的结尾, 尾对齐
}

</style>
