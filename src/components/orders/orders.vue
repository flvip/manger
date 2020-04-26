<template>
  <el-card>
    <MyBread level1="订单管理" level2="订单列表"></MyBread>
    <el-table :data="orderList" style="width: 100%" class="rightsTable" stripe>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="160"></el-table-column>
      <el-table-column prop="level" label="是否付款" width="160">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status=='0'">已付款</el-tag>
          <el-tag v-if="scope.row.pay_status=='1'">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="160"></el-table-column>
      <el-table-column prop="create_time" label="下单时间"></el-table-column>
      <el-table-column prop="path" label="操作">
         <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="handelEditShow(scope.row)"
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
      :page-sizes="[15, 20, 30]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

   <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="formRules" ref="addRoleFormRef">
          <el-form-item label="省市区">
          <el-cascader
            clearable
            expandTrigger="hover"
            v-model="selectedOptions"
            :options="cityData"
            :props="defaultProp"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import cityData from './cityData'
export default {
  data() {
    return {
      orderList: [],
      pagenum:1,
      pagesize:15,
      total:"",
      form:{},
      dialogFormVisible:false,
      options:[],
      selectedOptions:[],
      cityData:[]
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
     handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getOrderList();
    },
    handelEditShow(){
      this.cityData=cityData
      this.dialogFormVisible=true
    },
    async getOrderList() {
      const res = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      console.log(res);
      const {goods,total}=res.data.data
      this.orderList = goods;
      this.total=total
      console.log(this.orderList)
    }
  }
};
</script>

<style>
.pagination{
  margin-top: 10px;
}
</style>