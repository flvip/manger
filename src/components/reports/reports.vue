<template>
  <el-card>
    <MyBread level1="数据统计" level2="数据报表"></MyBread>
    <div id="main" style="width: 800px;height:600px;"></div>
  </el-card>
</template>

<script>
var echarts = require("echarts");

// 基于准备好的dom，初始化echarts实例

export default {
  mounted() {
    this.userEchart();
  },
  methods: {
    async userEchart() {
      var myChart = echarts.init(document.getElementById("main"));
      // 绘制图表
      const res = await this.$http.get(`reports/type/1`);
      let option2 = res.data.data;
      let option1 = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };
      let option = {...option1, ...option2};
      myChart.setOption(option);
    }
  }
};
</script>

<style>
</style>