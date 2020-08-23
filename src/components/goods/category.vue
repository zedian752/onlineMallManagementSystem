<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="isAddCategoryDialogVisible=true">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="catelist"
        style="width: 100%;margin-bottom: 20px;"
        row-key="cat_id"
        border
        :lazy="true"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="index" label="#" width="180"></el-table-column>
        <el-table-column prop="cat_name" label="分类名词" width="180"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="180">
          <template v-slot="scope">
            <el-tag
              :class="scope.row.cat_deleted?'el-icon-close':'el-icon-check'"
              :type="scope.row.cat_deleted?'danger':'success'"
            ></el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序" width="180">
          <template v-slot="scope">
            <el-tag
              :type="scope.row.cat_level===0?'':scope.row.cat_level===1?'success':'warning'"
            >{{scope.row.cat_level===0?'一级':scope.row.cat_level===1?'二级':'三级'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 编辑分类 -->
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="editCategoryById(scope.row.cat_id)"
            ></el-button>
            <!-- 删除分类 -->
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.cat_id,scope.row.cat_name)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <AddCategoryDialog
      ref="addCategoryDialogRef"
      :propisAddCategoryDialogVisible.sync="isAddCategoryDialogVisible"
      @getCategoriesList="getCategoriesList()"
    ></AddCategoryDialog>
    <!-- 编辑分类对话框 -->
    <editCategoryDialog :propisEditCategoryDialogVisible.sync="isEditCategoryDialogVisible" :editCategoryId="editCategoryId" 
      @getCategorysList="onEditCategoryInfo()"
    > </editCategoryDialog>
  </div>
</template>

<script>
import AddCategoryDialog from "./dialog/addCategoryDialog";
import editCategoryDialog from "./dialog/editCategoryDialog";
export default {
  data() {
    return {
      queryInfo: { type: 3, pagenum: 1, pagesize: 5 },
      // 商品分类的数据列表
      catelist: [],
      // 总数据条数
      total: undefined,
      //添加分类对话框是否显示
      isAddCategoryDialogVisible: false,
      //编辑分类对话框是否显示
      isEditCategoryDialogVisible: false,
      //用于编辑分类名称的id
      editCategoryId: undefined,
    };
  },
  components: { AddCategoryDialog, editCategoryDialog },
  created() {
    this.getCategoriesList();
  },
  methods: {
    async getCategoriesList() {
      const { data: res } = await this.$axios.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取商品信息失败");
      }
      //获取商品信息
      this.catelist = res.data.result;
      //获取总数信息
      this.total = res.data.total;
    },
    // 分页器监听函数且刷新当前商品信息
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategoriesList();
    },
    // 监听页码值改变且刷新当前商品信息
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCategoriesList();
    },
    //根据分类id删除分类
    removeUserById(cateId, cateName) {
      this.$confirm(`此操作将永久删除该分类\"${cateName}\"是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 进行删除
          const { data: res } = await this.$axios.delete(
            "categories/" + cateId
          );
          if (res.meta.status === 200) {
            this.$message.success("删除成功");
            //刷新分类列表
            this.getCategoriesList();
            //刷新级联分类器
            this.$refs.addCategoryDialogRef.getParentCateList();
          } else {
            this.$message.warning("删除失败!");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //根据id编辑分类名称
    editCategoryById(cateId) {
      this.editCategoryId = cateId;
      this.isEditCategoryDialogVisible = true;
    },
    // 在更新分类信息后
    onEditCategoryInfo(){
        //刷新卡片视图信息
        this.getCategoriesList();
        //刷新级联选择器信息
        this.$refs.addCategoryDialogRef.getParentCateList();
    }
  },
};
</script>