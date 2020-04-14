<template>
  <div class="login-wrap">
    <el-form
      ref="loginFormRef"
      :model="formData"
      :rules="loginFormRules"
      label-width="60px"
      class="login_form"
       :label-position="labelPosition"
    >
     <h2>用户登录</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="formData.username" prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
      </el-form-item>
      <el-form-item class="btns">
       <el-button class="login-btn" type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "top",
      formData: {
        username: "admin",
        password: "123456"
      },
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名的长度在2～10个字",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "用户密码的长度在6～18个字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleLogin() {
      // 表单预验证
      // valid：bool类型
      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid);
        // console.log(valid)
        if (!valid) return;
        const res = await this.$http.post("login", this.formData);
        const {
          data,
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          //保存token
          window.localStorage.setItem("token", data.token);
          console.log(data);
          this.$router.push({ path: "/users" });
          this.$message({
            message: msg,
            type: "success"
          });
        } else {
          this.$message.error(msg);
        }
      });
    }

    //找到异步操作有结果的代码，前面加await，同时接收异步操作的结果res
    //找到距离异步操作有结果的代码最近的方法前面加async
    // async handleLogin() {
    //   const res = await this.$http.post("login", this.formData);
    //   const {
    //     data,
    //     meta: { msg, status }
    //   } = res.data;
    //   if (status === 200) {
    //     //保存token
    //     window.localStorage.setItem('token', data.token)
    //     console.log(data);
    //     this.$router.push({ path: "/users" });
    //     this.$message({
    //       message: msg,
    //       type: "success"
    //     });
    //   } else {
    //     this.$message.error(msg);
    //   }
    // }
    // handleLogin() {
    //   this.$http.post("login", this.formData).then(res => {
    //     console.log(res);
    //     const {
    //       data,
    //       meta: { msg, status }
    //     } = res.data;
    //     if (status === 200) {
    //         console.log(data)
    //       this.$router.push({ path: "/" });
    //       this.$message({
    //         message: msg,
    //         type: "success"
    //       });
    //     } else {
    //       this.$message.error(msg);
    //     }
    //   });
    // }
  }
};
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap h2 {
  text-align: center;
}

.login-wrap .login_form {
  width: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
}
.login-wrap .login-btn {
  width: 100%;
}

</style>