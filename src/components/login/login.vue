<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      :label-position="labelPosition"
      label-width="50px"
      :model="formData"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password" @keyup.enter.native="handleLogin"></el-input>
      </el-form-item>
      <el-button class="login-btn" type="primary" @click="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "top",
      formData: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    //找到异步操作有结果的代码，前面加await，同时接收异步操作的结果res
    //找到距离异步操作有结果的代码最近的方法前面加async
    async handleLogin() {
      const res = await this.$http.post("login", this.formData);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //保存token
        localStorage.setItem('user-token',data.token)
        console.log(data);
        
        this.$router.push({ path: "/" });
        this.$message({
          message: msg,
          type: "success"
        });
      } else {
        this.$message.error(msg);
      }
    }
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
.login-wrap .login-form {
  width: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
}
.login-wrap .login-btn {
  width: 100%;
}
</style>