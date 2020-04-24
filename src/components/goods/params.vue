<template>
  <el-card>
    <MyBread level1="商品管理" level2="分类参数"></MyBread>
    <el-alert title="只允许为第三级分类设置参数" type="error" center show-icon></el-alert>
    <el-form class="elForm">
      <el-form-item label="商品参数">
        <el-cascader
          clearable
          :show-all-levels="false"
          expandTrigger="hover"
          v-model="selectedOptions"
          :options="options"
          :props="defaultProp"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>

    <el-tabs v-model="active" type="card" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="danger">设置动态参数</el-button>
        <el-table :data="arrDyparams" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="#" type="index" width="100"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
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
                @click="handelDelete(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-button type="danger">设置静态参数</el-button>
        <el-table :data="arrStaticparams" style="width: 100%">
          <el-table-column label="#" type="index" width="100"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="属性值" prop="attr_vals"></el-table-column>
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
                @click="handelDelete(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      selectedOptions: [],
      options: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      arrDyparams: [],
      arrStaticparams: [],
      active: "1",
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    async handleClose(row, tag) {
      row.attr_vals.splice(this.dynamicTags.indexOf(tag), 1);
      let putData = {
        attr_name: row.attr_name,
        attr_sel: "many",
        attr_vals: row.attr_vals.join(",")
      };
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${row.attr_id}`,
        putData
      );
      console.log(res);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleInputConfirm(row) {
      let inputValue = this.inputValue;
      if (inputValue) {
        row.attr_vals.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
      let putData = {
        attr_name: row.attr_name,
        attr_sel: "many",
        attr_vals: row.attr_vals.join(",")
      };
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${row.attr_id}`,
        putData
      );
      console.log(res);
    },
    async handleClick() {
      if (this.active === "2") {
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          this.arrStaticparams = res.data.data;
        }
      }
    },
    async handleChange() {
      
      if (this.selectedOptions.length === 3) {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        this.arrDyparams = res.data.data;
        this.arrDyparams.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
        this.dynamicTags = this.arrDyparams[0].attr_vals;
        this.handleClick()
      }
    },
    async getCategories() {
      const res = await this.$http.get(`categories/?type=3`);
      this.options = res.data.data;
    }
  }
};
</script>

<style>
.elForm {
  margin-top: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
  margin-top: 5px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>