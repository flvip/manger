<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <img class="logo_img" src="../../assets/img/logo.jpg" alt="无法显示图片" srcset />
          </div>
        </el-col>
        <el-col :span="8" class="middle_text">
          <h3>后台管理系统</h3>
        </el-col>
        <el-col :span="8">
          <div class="logout">
            <el-dropdown>
              <span class="el-dropdown-link">
                <img class="avatar" src="../../assets/img/avatar.gif" alt="无法显示图片" srcset />
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <a href="/">返回主页</a>
                </el-dropdown-item>
                <el-dropdown-item>
                  <a @click.prevent="handleLogout">退出</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" :width="asideWidth">
        <el-button type="success" plain @click="isCollapse=!isCollapse">展开</el-button>
        <el-menu :unique-opened="true" :router="true" :collapse="isCollapse">
          <el-submenu :index="item1.order" v-for="item1 in menuList" :key="item1.id">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="item2 in item1.children" :key="item2.id">
              <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      loading: false,
      asideWidth: "200px",
      menuList: []
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    handleLogout() {
      localStorage.clear();
      this.$message({
        message: "退出成功",
        type: "success"
      });
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  background-color: #b3c0d1;
}
/* 头部样式 */
.header {
  background-color: #b3c0d1;
  color: #fff;
}
.logo_img {
  width: 60px;
}
.middle_text {
  text-align: center;
}
.logout {
  line-height: 60px;
  text-align: right;
  margin-top: 10px;
}
.logout a {
  cursor: pointer;
}
/* 头部样式 */
.aside {
  background-color: #d3dce6;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.main {
  background-color: #e9eef3;
}
.avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
</style>