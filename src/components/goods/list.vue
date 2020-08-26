 <template>
  <!-- 面包屑导航区域 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
        <el-col :span="4">
          <el-button type="primary" @click="gotoAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="goodsInfo.goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品id" prop="goods_id" width="50px"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="75px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="75px"></el-table-column>
        <!-- 时间格式处理通过在main.js创建全局过滤器解决 -->
        <el-table-column label="创建时间" prop="add_time" width="150px"><template v-slot="scope">{{scope.row.add_time|dateFormat}}</template></el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改商品信息" placement="bottom" :enterable="false">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                @click="showEditGoodsInfoDialog(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除商品" placement="bottom" :enterable="false">
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="removeGoodsById(scope.row.goods_id)"
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
        :total="goodsInfo.total"
        background
      ></el-pagination>
    </el-card>

  </div>
</template>


<script>

export default {
  components: {

    
  },
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: { query: "", pagenum: 1, pagesize: 5 }, //pagenum 当前页码 pagesize 每页显示多少个数据
      // 用于渲染的用户信息
      goodsInfo: { goodslist: [], total: 0 },
      //控制是否显示修改用户信息对话框
      isEditGoodsDialogVisible: false,
      //控制是否显示分配角色信息对话框
      isAssignRoleDialogVisible: false,
      // 用户id,传递进修改用户信息子组件内使用
      editGoodsId:undefined,
      // 用户id,传递进修改用户角色子组件内使用
      assignRoleInfo:undefined
    };
  },
  created() {
    // 刷新商品列表
    this.getGoodsList();

  },
  methods: {
    //获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$axios.get("goods", {
        params: this.queryInfo,
      });
      //商品信息   
      this.goodsInfo.goodslist = res.data.goods;
      //商品总数
      this.goodsInfo.total = res.data.total;
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
    },
    // 分页器监听函数且刷新当前显示用户信息
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 监听页码值改变且刷新当前显示用户信息
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    //根据商品id删除商品
    removeGoodsById(GoodsId) {
      this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 进行删除
          const { data: res } = await this.$axios.delete("Goods/" + GoodsId);
          if (res.meta.status === 200) {
            this.$message.success("删除成功");
            //刷新用户列表
            this.getGoodsList();
          } else {
            this.$message.warning("删除失败!");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 获取待修改用户id传进子组件中然后显示编辑用户信息对话框
    showEditGoodsInfoDialog(GoodsId) {
      this.editGoodsId=GoodsId;
      this.isEditGoodsDialogVisible = true;
    },
    // 获取待修改用户id传进子组件然后显示分配用户角色信息对话框    
      showAssignRoleDialog(goodsInfo) {
      this.assignRoleInfo=goodsInfo;
      this.isAssignRoleDialogVisible = true;
    },
    // 跳转到新增商品页面
    gotoAddPage(){
      this.$router.push('/goods/add')
    }
  },
  watch: {},
};
</script>
<style>
</style>