<template>
  <el-card class="card">
    <myBread level1="权限管理" level2="角色列表"></myBread>
    <el-table :data="roleList" border style="width: 100%" class="rightsTable" stripe>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="等级">
        <template slot-scope="scope">
          <span v-if="scope.row.level=='0'">一级</span>
          <span v-if="scope.row.level=='1'">二级</span>
          <span v-if="scope.row.level=='2'">三级</span>
        </template>'
        '
        '
        '' '
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleList: []
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const res = await this.$http.get(`rights/list`);
      console.log(res);
      this.roleList = res.data.data;
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.rightsTable {
  margin-top: 15px;
  overflow: auto;
}
</style>