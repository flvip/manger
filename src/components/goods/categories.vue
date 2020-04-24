<template>
  <el-card>
    <MyBread level1="商品管理" level2="商品分类"></MyBread>
    <el-button type="success" @click="handleAdd()">添加分类</el-button>
    <el-table id="out-table" class="table" :data="cateList" style="width: 100%" stripe>
      <el-table-column type="index" label="#" width="66"></el-table-column>
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        folderIcon
      ></el-tree-grid>
      <el-table-column prop="cat_level" label="等级" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level===0">一级</span>
          <span v-else-if="scope.row.cat_level===1">二级</span>
          <span v-else-if="scope.row.cat_level===2">三级</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted===false">有效</span>
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
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
            @click="handelDelete(scope.row.cat_id)"
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
      :page-sizes="[10, 20, 50]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form" :rules="formRules" ref="addRoleFormRef">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader
            clearable
            expandTrigger="hover"
            v-model="selectedOptions"
            :options="options"
            :props="defaultProp"
            @change="handleChange"
            filterable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd=false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑分类" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form" :rules="formRules" ref="addRoleFormRef">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader
            clearable
            expandTrigger="hover"
            v-model="selectedOptions"
            :options="options"
            :props="defaultProp"
            @change="handleChange"
            filterable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit=false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
var ElTreeGrid = require("element-tree-grid");
export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      pagenum: 1,
      pagesize: 10,
      cateList: [],
      total: "",
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      form: {
        cat_id: -1,
        cat_name: "",
        cat_level: -1
      },
      selectedOptions: [],
      options: [],
      defaultProp: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true
      }
    };
  },
  created() {
    this.gerCateList();
  },
  methods: {
    handelEditShow(row) {
      console.log(row);
      this.form.cat_name = row.cat_name;

      this.dialogFormVisibleEdit = true;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.gerCateList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.gerCateList();
    },
    async handelDelete(id) {
      const res = await this.$http.delete(`categories/${id}`);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.gerCateList();
      }
    },
    async addCate() {
      if (this.selectedOptions.length > 0) {
        this.form.cat_pid = this.selectedOptions[
          this.selectedOptions.length - 1
        ];
        this.form.cat_level = this.selectedOptions.length;
      } else {
        // 父级分类的Id
        this.form.cat_pid = 0;
        // 当前分类的等级
        this.form.cat_level = 0;
      }
      this.dialogFormVisibleAdd = false;
      const res = await this.$http.post(`categories`, this.form);

      const {
        meta: { msg }
      } = res.data;
      if (res.status === 200) {
        this.$message.success(msg);
      }
      this.form = {};
      this.gerCateList();
    },
    handleAdd() {
      this.dialogFormVisibleAdd = true;
      this.getCategories();
    },
    async gerCateList() {
      const res = await this.$http.get("categories", {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.cateList = res.data.data.result;
      this.total = res.data.data.total;
    },
    async getCategories() {
      const res = await this.$http.get(`categories/?type=2`);
      this.options = res.data.data;
    }
  }
};
</script>

<style>
.pagination {
  margin-top: 10px;
}
</style>