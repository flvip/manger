<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchRow">
      <el-col>
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
          clearable
          @clear="loadUsersList()"
        >
          <el-button slot="append" icon="el-icon-search" @click="handelSearch"></el-button>
        </el-input>
        <el-button type="success" plain class="addBtn" @click="addUserShow">添加用户</el-button>
        <el-button type="success" @click="exportExcel()">导出全部</el-button>
      </el-col>
    </el-row>
    <el-table id="out-table" class="table" :data="usersList" style="width: 100%" stripe border>
      <el-table-column type="index" label="#" width="66"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="usersList">{{usersList.row.create_time | fmdate}}</template>
        <!--  //--- scope.row 直接取到该单元格对象，就是数组里的元素对象，即是usersList[scope.$index]
        //---.create_time 是对象里面的create_time属性的值-->
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="usersList">
          <el-switch
          @change="changeMsgState(usersList.row)"
            v-model="usersList.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="role_name" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="handelEditShow(scope.row)"
          ></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
            @click="handelDelete(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
    class="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit=false">取 消</el-button>
        <el-button type="primary" @click="handelEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      usersList: [],
      total: "",
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "80px"
    };
  },
  created() {
    this.gerUsersList();
  },
  methods: {
      //修改用户状态
     async changeMsgState(user){
         console.log(user)
         const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
          const {
        meta: { msg }
      } = res.data;
         if(res.status===200){
             this.$message.success(msg);
         }
         console.log(res)
      },
    //编辑用户信息
    async handelEdit() {
      this.dialogFormVisibleEdit = false;
      console.log(this.form);
      const res = await this.$http.put("users/" + this.form.id, this.form);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
    },
    //弹出用户编辑信息
    handelEditShow(user) {
      this.dialogFormVisibleEdit = true;
      this.form = user;
      console.log(user);
    },
    //删除用户
    handelDelete(userId) {
      this.$confirm("删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete("users/" + userId);
          console.log(res);
          const {
            meta: { msg }
          } = res.data;
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: msg
            });
            this.gerUsersList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addUserShow() {
      this.dialogFormVisibleAdd = true;
      this.form = {};
    },
    //添加用户
    async addUser() {
      const res = await this.$http.post("users", this.form);
      this.dialogFormVisibleAdd = false;
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 201) {
        this.form = {};

        this.$message.success(msg);
        console.log(data);
        this.gerUsersList();
      } else {
        this.$message.warning("添加失败");
      }
    },
    dialogFormVisible() {
      this.dialogFormVisibleAdd = false;
    },
    //重新加载
    loadUsersList() {
      this.gerUsersList();
    },
    //搜索用户
    handelSearch() {
      this.gerUsersList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize=val
       this.gerUsersList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum=val
       this.gerUsersList();
    },
    //导出数据
    exportExcel() {
      this.pagesize = 30; //表格长度变长
      this.currentPage = 1;
      this.$nextTick(function() {
        let wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
        /* get binary string as output */
        let wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "表格名字.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        // this.pagesize = 2; //表格还原

        return wbout;
      });
    },
    //`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
    //获取用户
    async gerUsersList() {
      const AUTH_TOKEN = localStorage.getItem("user-token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get("users", {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      console.log(res);
      const {
        data: { total, users },
        meta: { status }
      } = res.data;

      if (status === 200) {
        this.usersList = users;
        this.total = total;
        // this.$message(msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.searchRow {
  margin-top: 20px;
}
.inputSearch {
  width: 300px;
}
.addBtn {
  margin-left: 5px;
}
.table {
  margin-top: 10px;
}
.pagination{
    margin-top: 10px;
}
</style>