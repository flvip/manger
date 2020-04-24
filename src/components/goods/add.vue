<template>
  <el-card>
    <MyBread level1="商品管理" level2="添加商品"></MyBread>
    <el-alert title="添加商品信息" type="success" center show-icon></el-alert>
    <el-steps :active="active-0" finish-status="success" align-center style="margin-top: 20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <el-form
      label-position="top"
      label-width="80px"
      :model="form"
      style="height:500px;overflow:auto;"
    >
      <el-tabs tab-position="left" v-model="active" @tab-click="handleClick()">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input-number
              v-model="form.goods_price"
              controls-position="right"
              @change="handleChange"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input-number
              v-model="form.goods_weight"
              controls-position="right"
              @change="handleChange"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input-number
              v-model="form.goods_number"
              controls-position="right"
              @change="handleChange"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="商品参数">
            <el-cascader
              clearable
              expandTrigger="hover"
              v-model="selectedOptions"
              :options="options"
              :props="defaultProp"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1,index) in arrDyparams" :key="index">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox
                border
                :label="item2"
                v-for="(item2,index) in item1.attr_vals"
                :key="index"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item
            :label="item1.attr_name"
            v-for="(item1,index) in arrStaticparams"
            :key="index"
          >
            <el-input v-model="item1.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" class="addbtn" @click="addGoods()">添加商品</el-button>
            <quillEditor v-model="form.goods_introduce"></quillEditor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      selectedOptions: [1, 3, 6],
      options: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      arrDyparams: [],
      arrStaticparams: [],
      headers: { Authorization: localStorage.getItem("token") }
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    async addGoods() {
      this.form.goods_cat = this.selectedOptions.join(",");
      let arr1 = this.arrDyparams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });

      let arr2 = this.arrStaticparams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      this.form.attrs = [...arr1, ...arr2];

      const { data: res } = await this.$http.post("goods", this.form);
      if (res.meta.status !== 201) return this.$message.error("添加商品失败！");
      this.$message.success("添加商品成功!");
      this.$router.push("/goods");
    },
    handleRemove(file) {
      let index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });

      this.form.pics.splice(index, 1);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleSuccess(response) {
      this.form.pics.push({
        pic: response.data.tmp_path
      });
    },
    async handleClick() {
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择三级分类");
          return;
        }
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        this.arrDyparams = res.data.data;
        this.arrDyparams.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
      } else if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择三级分类");
          return;
        }
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        this.arrStaticparams = res.data.data;
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
.addbtn {
  margin: 10px 0;
}
.ql-editor {
  min-height: 300px;
}
</style>