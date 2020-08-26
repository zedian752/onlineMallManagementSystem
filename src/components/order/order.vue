<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card shadow="never">
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="ordersInfo.orderslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单标号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="70px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" align="center" width="80px">
            <template v-slot="scope"><el-tag :type="scope.row.pay_status==='1'?'success':'danger'">{{scope.row.pay_status==='1'?'已付款':'未付款'}}</el-tag></template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="75px"></el-table-column>
        <!-- 时间格式处理通过在main.js创建全局过滤器解决 -->
        <el-table-column label="下单时间" prop="create_time" width="150px">
          <template v-slot="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <!-- 修改地址 -->
            <el-tooltip effect="dark" content="修改订单" placement="bottom" :enterable="false">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                @click="showEditAddressInfoDialog(scope.row.order_id)"
              ></el-button>
            </el-tooltip>
            <!-- 查看物流信息按钮 -->
            <el-tooltip effect="dark" content="物流信息" placement="bottom" :enterable="false">
              <el-button
                size="small"
                type="success"
                icon="el-icon-truck"
                @click="showProgressInfoDialog(scope.row.order_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 用户信息分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="ordersInfo.total"
        background
      ></el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <editAddressDialog :propisEditAddressDialogVisible.sync="isEditAddressDialogVisible" :orderId="editAddressId"></editAddressDialog>
    <!-- 物流信息对话框 -->
    <showProgressDialog :propisShowProgressDialogVisible.sync="isShowProgressDialogVisible" :orderId="orderId"></showProgressDialog>
  </div>
</template>

<script>
import editAddressDialog from './dialog/editAddressDialog'
import showProgressDialog from './dialog/showProgressDialog'
export default {
    components:{editAddressDialog,showProgressDialog},
    data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: { query: "", pagenum: 1, pagesize: 5 }, //pagenum 当前页码 pagesize 每页显示多少个数据
      // 用于渲染的用户信息
      ordersInfo: { orderslist: [], total: 0 },
      //控制是否显示修改地址信息对话框
      isEditAddressDialogVisible: false,
      //控制是否显示物流信息对话框
      isShowProgressDialogVisible: false,
      // 用户id,传递进修改地址信息子组件内使用
      editAddressId: undefined,
      // 物流订单号,传递进显示物流信息子组件内使用
      orderId: undefined,
    };
  },
  created() {
    // 刷新商品列表
    this.getOrdersList();
  },
  methods: {
    //获取商品列表
    async getOrdersList() {
        var tmp;
      const { data: res } = tmp=await this.$axios.get("orders", {
        params: this.queryInfo,
      });
      console.log(tmp)

      //商品信息
      this.ordersInfo.orderslist = res.data.goods;
      console.log(this.ordersInfo.orderslist);
      //商品总数
      this.ordersInfo.total = res.data.total;
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
    },
    // 分页器监听函数且刷新当前显示用户信息
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrdersList();
    },
    // 监听页码值改变且刷新当前显示用户信息
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrdersList();
    },
    // 获取待修改用户id传进子组件中然后显示编辑地址对话框
    showEditAddressInfoDialog(addressId) {
      this.editAddressId = addressId;
      this.isEditAddressDialogVisible = true;
    },
    // 显示物流信息对话框
    showProgressInfoDialog(orderId){
        console.log(orderId)
        this.orderId = orderId;
        this.isShowProgressDialogVisible = true;
    }

  },
  watch: {},
};
</script>