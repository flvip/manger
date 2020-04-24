<template>
  <el-card class="box-card">
    <MyBread level1="商品管理" level2="商品列表"></MyBread>
    <el-row class="searchRow">
      <el-col>
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
          clearable
          @clear="loadgoodsList()"
        >
          <el-button slot="append" icon="el-icon-search" @click="handelSearch"></el-button>
        </el-input>
        <el-button type="success" plain class="addBtn" @click="addGood">添加商品</el-button>
        <el-button type="success" @click="exportExcel()">导出全部</el-button>
      </el-col>
    </el-row>
    <el-table id="out-table" class="table" :data="goodsList" style="width: 100%" stripe border>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="#" width="66"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name" width="240px"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
      <el-table-column label="商品数量" prop="goods_number" width="70px"></el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="140px">
        <template slot-scope="goodsList">{{goodsList.row.add_time | fmdate}}</template>
        <!--  //--- scope.row 直接取到该单元格对象，就是数组里的元素对象，即是goodsList[scope.$index]
        //---.create_time 是对象里面的create_time属性的值-->
      </el-table-column>
      <el-table-column label="商品状态" width="80px">
        <template slot-scope="goodsList">
          <el-switch
            @change="changeMsgState(goodsList.row)"
            v-model="goodsList.row.goods_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="role_name" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="handelEditShow(scope.row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
            @click="handelCheckShow(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
            @click="handelDelete(scope.row.goods_id)"
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
      :page-sizes="[5, 20, 50]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form" :rules="formRules" ref="addUserFormRef">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form" :rules="editUserFormRules" ref="editUserFormRef">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit=false">取 消</el-button>
        <el-button type="primary" @click="handelEdit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名：" :label-width="formLabelWidth">{{currentUsername}}</el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              v-for="(item,i) in roleNameArr"
              :key="i"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
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
      pagesize: 5,
      goodsList: [],
      total: "",
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },

      formLabelWidth: "80px",
      currRoleId: -1,
      currentUsername: "",
      roleNameArr: [],
      currUserId: ""
    };
  },
  created() {
    this.gerGoodsList();
  },
  methods: {
    async setRole() {
      //修改用户权限
      const result = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      });
      const {
        meta: { msg }
      } = result.data;
      if (result.status === 200) {
        if (msg === "设置角色成功") {
          this.$message.success(msg);
        } else {
          this.$message.warning(msg);
        }
      }
      this.dialogFormVisibleRole = false;
      console.log(result);
    },
    //分配用户角色
    async handelCheckShow(user) {
      this.currentUsername = user.username;
      this.dialogFormVisibleRole = true;
      //获取所有角色
      const res = await this.$http.get("roles");
      const { data } = res.data;
      this.roleNameArr = data;
      console.log(data);
      //通过id查询角色权限rid
      const res1 = await this.$http.get(`users/${user.id}`);
      const { id, rid } = res1.data.data;
      this.currRoleId = rid;
      //通过rid查询角色权限
      this.currUserId = id;
    },
    async changeMsgState(user) {
      // console.log(user);
      // const res = await this.$http.put(
      //   `users/${user.id}/state/${user.mg_state}`
      // );
      // console.log(res);
      const { data: res } = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功！");
    },
    //编辑用户信息
    async handelEdit() {
      console.log(this.form);
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return;
        this.dialogFormVisibleEdit = false;
        const res = await this.$http.put("users/" + this.form.id, this.form);
        const {
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          this.$message.success(msg);
        }
      });
    },
    //弹出用户编辑信息
    handelEditShow(user) {
      this.dialogFormVisibleEdit = true;
      this.form = user;
      console.log(user);
    },
    //删除用户
    handelDelete(goodId) {
      this.$confirm("删除商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete("goods/" + goodId);
          const {
            meta: { msg }
          } = res.data;
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: msg
            });
            this.gerGoodsList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addGood() {
      this.$router.push({name:'Add'});
    },

    //添加用户
    async addUser() {
      // 提交请求前，表单预验证
      this.$refs.addUserFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.form);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        // 隐藏添加用户对话框
        this.dialogFormVisibleAdd = false;
        this.gerGoodsList();
      });
    },
    addUserShow() {
      this.dialogFormVisibleAdd = true;
      this.form = {};
    },
    dialogFormVisible() {
      this.dialogFormVisibleAdd = false;
    },
    //重新加载
    loadgoodsList() {
      this.gerGoodsList();
    },
    //搜索用户
    handelSearch() {
      this.gerGoodsList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.gerGoodsList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.gerGoodsList();
    },
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
    async gerGoodsList() {
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get("goods", {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      console.log(res);
      const {
        data: { total, goods },
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.goodsList = goods;
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
.pagination {
  margin-top: 10px;
}
</style>