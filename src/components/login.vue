<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="logo" />
      </div>

      <!-- 登录表单 -->
      <el-form
        :model="loginForm"
        ref="loginFormRef"
        label-width="80px"
        class="login-form"
        :rules="loginFormRules"
      >
        <!-- <el-form ref="loginForm"  label-width="80px" class="login-form" :rules="loginFormRules"> -->
        <!-- username -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item label="密码" prop="password">
          <el-input
            :type="inputPasswordtype"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-password"
          >
            <i @click="switchIsShowPassword()" slot="suffix" class="iconfont icon-showpassword"></i>
          </el-input>
        </el-form-item>
        <!-- button area -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button type="info" @click="reSetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>

export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, message: "长度不小于3位", trigger: "blur" },
        ],
      },
      // 输入框文本类型
      inputPasswordtype: "password",
    };
  },
  methods: {
    switchIsShowPassword() {
      this.inputPasswordtype =
        this.inputPasswordtype === "password" ? "text" : "password";
    },
    reSetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid, object) => {
        if (!valid) return;
        let { data: resData } = await this.$axios.post("login", this.loginForm); //别名+解构赋值
        if (resData.meta.status === 200) { //登录成功
          this.$message({
            message: "登录成功！",
            type: "success",
          });
        window.sessionStorage.setItem('token',resData.data.token)//token保存到sessionStorage
        this.$router.push('/home')
        } else {
          return this.$message({
            message: "用户名或密码错误",
            type: "error",
          });
        }
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.login-container {
  background-color: #bad09e;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.login-box {
  position: relative;
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
}
.avatar-box {
  height: 130px;
  width: 130px;
  padding: 10px;
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 50%;
  box-shadow: 0 0 10px #dddddd;
  transform: translate3d(0, -50%, 0);
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eeeeee;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
  // padding-right: ;
  margin-right: 40px;
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>