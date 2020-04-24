<template>
<el-breadcrumb separator-class="el-icon-arrow-right" class="mybread">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
  <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>

</el-breadcrumb>
</template>

<script>
  export default {
    name: "MyBread",
    props:["level1","level2"]
  }
</script>

<style scoped>
  .mybread{
    margin-bottom: 10px;
  }
</style>