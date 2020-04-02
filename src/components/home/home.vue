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
            <a @click.prevent="handleLogout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu :unique-opened="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <template slot="title">
                  <i class="el-icon-s-custom"></i>
                  <span>用户列表</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-grid"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>角色列表</span>
                </template>
              </el-menu-item>
              <el-menu-item index="2-2">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>权限列表</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-shopping-cart-1"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>商品列表</span>
                </template>
              </el-menu-item>
              <el-menu-item index="3-2">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>分类参数</span>
                </template>
              </el-menu-item>
              <el-menu-item index="3-3">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>商品分类</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-message-solid"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>订单列表</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>数据报表</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <el-table v-loading="loading" :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true,
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      loading: false
    };
  },
  beforeCreate() {
    const token = localStorage.getItem("user-token");
    if (!token) {
      this.$router.push({ name: "login" });
      this.$message.error("token 过期");
    }
  },
  methods: {
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
</style>