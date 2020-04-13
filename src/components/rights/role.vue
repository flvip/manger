<template>
  <el-card>
    <myBread level1="权限管理" level2="权限列表"></myBread>
    <el-row class="addBtn">
      <el-button type="success" plain @click="addUserShow">添加角色</el-button>
    </el-row>

    <el-table id="out-table" class="table" :data="roleList" style="width: 100%" stripe>
      <el-table-column type="expand" width="55">
        <template slot-scope="scope">
          <el-row v-for="(v1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag type="success" closable @close="handelClose(scope.row,v1.id)">{{v1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(v2,i) in v1.children" :key="i">
                <el-col :span="4">
                  <el-tag closable @close="handelClose(scope.row,v2.id)">{{v2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    type="warning"
                    v-for="(v3,i) in v2.children"
                    :key="i"
                    closable
                    @close="handelClose(scope.row,v3.id)"
                  >{{v3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length===0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="66"></el-table-column>
      <el-table-column prop="roleName" label="角色名" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
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
            @click="handelDelete(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form" :rules="formRules" ref="addRoleFormRef">
        <el-form-item label="角色名" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd=false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form" :rules="formRules" ref="addRoleFormRef">
        <el-form-item label="角色名" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit=false">取 消</el-button>
        <el-button type="primary" @click="handelEdit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRole">
      <el-tree
        :data="roleData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrCheck"
        :props="defaultProps"
        ref="treeRole"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole=false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        roleName: "",
        roleDesc: ""
      },
      roleData: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      arrCheck: [],
      currRoleId: -1
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async editRole() {
      const nodesArr1 = this.$refs.treeRole.getCheckedNodes();
      const nodesArr2 = this.$refs.treeRole.getCheckedKeys();
      let nodesArr = [...nodesArr1, ...nodesArr2];
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: nodesArr.join(",")
      });
      const { msg, status } = res.data.meta;
      if (status === 200) {
        this.$message.success(msg);
        this.getRoleList();
      }

      this.dialogFormVisibleRole = false;
    },
    async handelCheckShow(role) {
      this.dialogFormVisibleRole = true;
      this.currRoleId = role.id;
      const res = await this.$http.get(`rights/tree`);
      this.roleData = res.data.data;
      var tempArr1 = [];
      role.children.forEach(item1 => {
        // tempArr1.push(item1.id);
        item1.children.forEach(item2 => {
          // tempArr1.push(item2.id);
          item2.children.forEach(item3 => {
            tempArr1.push(item3.id);
          });
        });
      });
      this.arrCheck = tempArr1;
      console.log(res);
    },
    async handelClose(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      const { msg, status } = res.data.meta;
      if (status === 200) {
        role.children = res.data.data;
        this.$message.success(msg);
      }
    },
    async handelEdit() {
      const res1 = await this.$http.put(`roles/${this.form.id}`, this.form);
      const { msg, status } = res1.data.meta;
      if (status === 200) {
        this.$message.success(msg);
        this.getRoleList();
        this.dialogFormVisibleEdit = false;
      }
    },
    handelEditShow(role) {
      this.form = role;
      this.dialogFormVisibleEdit = true;
    },
    async handelDelete(id) {
      const res = await this.$http.delete(`roles/${id}`);

      const { msg, status } = res.data.meta;
      if (status === 200) {
        this.$message.success(msg);
        this.getRoleList();
      }
    },
    async addRole() {
      const res = await this.$http.post(`roles`, this.form);
      const { msg, status } = res.data.meta;
      if (status === 201) {
        this.$message.success(msg);
        this.getRoleList();
      }

      this.dialogFormVisibleAdd = false;
    },
    addUserShow() {
      this.dialogFormVisibleAdd = true;
    },
    async getRoleList() {
      const res = await this.$http.get(`roles`);
      console.log(res);
      this.roleList = res.data.data;
      console.log(this.roleList);
    }
  }
};
</script>

<style>
.addBtn {
  margin: 20px 0;
}
.el-row {
  margin: 5px 0;
}
</style>