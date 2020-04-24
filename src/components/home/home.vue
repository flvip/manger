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
      <el-aside class="aside" :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togleCollapse">|||</div>
        <el-menu 
        class="menu"
          :unique-opened="true"
          :router="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
        >
          <el-submenu :index="item1.order" v-for="item1 in menuList" :key="item1.id">
            <template slot="title">
              <i :class="iconObj[item1.id]"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item
              :index="item2.path"
              v-for="item2 in item1.children"
              :key="item2.id"
              @click="saveNavState('/' + item2.path)"
            >
              <template slot="title">
                <i :class="iconObj[item2.id]"></i>
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
      menuList: [],
      iconObj: {
        "125": "el-icon-s-custom",
        "103": "el-icon-user",
        "101": "el-icon-shopping-cart-2",
        "102": "el-icon-s-comment",
        "145": "el-icon-s-data",
        "110": "el-icon-user-solid",
        "111": "el-icon-s-tools",
        "112": "el-icon-setting",
        "104": "el-icon-shopping-cart-full",
        "115": "el-icon-shopping-cart-full",
        "121": "el-icon-shopping-cart-full",
        "107": "el-icon-message-solid",
        "146": "el-icon-s-marketing"
      },
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    // 保存连接的激活地址
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
    },
    togleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
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
  width: 50px;
  height: 50px;
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

.main {
  background-color: #e9eef3;
}
.avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.toggle-button {
  height: 40px;
  background-color: #4a5064;
  font-size: 18px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>