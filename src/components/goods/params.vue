<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        effect="dark"
        show-icon
        :closable="false"
      ></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
        </el-col>
        <el-col>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            @change="parentCateChanged"
            :props="cascaderProp"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-row>
        <!-- 标签页区域 -->
        <el-tabs type="border-card" v-model="tabsActiveName" @tab-click="onTabsClick">
          <!-- 添加动态参数面板 -->
          <el-tab-pane label="动态参数" name="many">
            <el-button
              :disabled="selectedKeys.length?false:true"
              type="primary"
              @click="isAddParamDialogVisible=true"
            >添加参数</el-button>
            <el-table border stripe :data="manyTableData">
              <!-- 展开行 用于显示商品tags -->
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag
                    v-for="(item,index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    @close="onTagClose(scope.row,index)"
                  >{{item}}</el-tag>
                  <!-- 增加tag的文本框和按钮 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="addNewTag(scope.row)"
                    @blur="addNewTag(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showAddTagInput(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <!-- 索引 -->
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作" prop="attr_name">
                <template v-slot="scope">
                  <!-- 编辑分类 -->
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditParamDialog(scope.row)"
                  >修改</el-button>
                  <!-- 删除属性 -->
                  <el-button
                    @click="showDeleteParamDialog(scope.row)"
                    size="small"
                    type="danger"
                    icon="el-icon-delete"
                  >刪除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 添加静态参数面板 -->
          <el-tab-pane label="静态属性" name="only">
            <el-button
              :disabled="selectedKeys.length?false:true"
              type="primary"
              @click="isAddParamDialogVisible=true"
            >添加属性</el-button>
            <el-table border stripe :data="onlyTableData">
              <!-- 展开行 用于显示商品tags -->
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag
                    v-for="(item,index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    @close="onTagClose(scope.row,index)"
                  >{{item}}</el-tag>
                  <!-- 增加tag的文本框和按钮 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="addNewTag(scope.row)"
                    @blur="addNewTag(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showAddTagInput(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <!-- 索引 -->
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作" prop="attr_name">
                <template v-slot="scope">
                  <!-- 编辑分类 -->
                  <el-button
                    @click="showEditParamDialog(scope.row)"
                    size="small"
                    type="primary"
                    icon="el-icon-edit"
                  >修改</el-button>
                  <!-- 删除属性 -->
                  <el-button
                    @click="showDeleteParamDialog(scope.row)"
                    size="small"
                    type="danger"
                    icon="el-icon-delete"
                  >刪除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>
    <!-- 编辑参数对话框 -->
    <addParamDialog
      :propisAddParamDialogVisible.sync="isAddParamDialogVisible"
      :activeName="tabsActiveName"
      :catId="categoryInfoForm.cat_id"
      @getParamsData="getParamsData()"
    ></addParamDialog>
    <!-- 删除参数对话框 -->
    <deleteParamDialog
      :propisDeleteParamDialogVisible.sync="isDeleteParamDialogVisible"
      :activeName="tabsActiveName"
      :deleteParamForm="deleteParamForm"
      @getParamsData="getParamsData()"
    ></deleteParamDialog>
    <!-- 编辑参数对话框 -->
    <editParamDialog
      :propisEditParamDialogVisible.sync="isEditParamDialogVisible"
      :activeName="tabsActiveName"
      :editParamForm="editParamForm"
      @getParamsData="getParamsData()"
    ></editParamDialog>
  </div>
</template>

<script>
import addParamDialog from "./dialog/addParamDialog";
import deleteParamDialog from "./dialog/deleteParamDialog";
import editParamDialog from "./dialog/editParamDialog";
export default {
  data() {
    return {
      // cascader列表
      parentCateList: [],
      // cascader 配置选项
      cascaderProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      //cascader内选中的id数组
      selectedKeys: [],
      //cascader内参数
      categoryInfoForm: { cat_id: 0 },
      //被激活页签名词
      tabsActiveName: "many",
      //静态面板数据
      onlyTableData: undefined,
      //动态面板数据
      manyTableData: undefined,
      //修改参数对话框是否显示
      isAddParamDialogVisible: false,
      //删除参数对话框是否显示
      isDeleteParamDialogVisible: false,
      //删除参数对话框所需id
      deleteParamForm: {},
      //编辑参数对话框是否显示
      isEditParamDialogVisible: false,
      //编辑参数对话框所需id
      editParamForm: {},
    };
  },
  components: { addParamDialog, deleteParamDialog, editParamDialog },
  methods: {
    // 获取父级分类的数据列表
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.onlyTableData = [];
        this.manyTableData = [];
        if(this.selectedKeys.length===0){return this.$message("请先选择商品分类");}
        else{return this.$message.error("只允许为第三级分类设置相关参数！");}
      }
      //父级分类的id
      this.categoryInfoForm.cat_id = this.selectedKeys.slice(-1)[0];
      //请求参数
      const {
        data: res,
      } = await this.$axios.get(
        `categories/${this.categoryInfoForm.cat_id}/attributes`,
        { params: { sel: this.tabsActiveName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败");
      }
      res.data.forEach(
        //处理tags属性
        (item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          //控制文本框的显示与隐藏
          item.inputVisible = false;
          //文本框中输入的值
          item.inputValue = "";
        }
      );
      if (this.tabsActiveName === "many") {
        this.manyTableData = res.data;
      } else if (this.tabsActiveName === "only") {
        this.onlyTableData = res.data;
      }
    },
    // 获取父级分类的数据列表,用于级联选择器
    async getParentCateList() {
      const { data: res } = await this.$axios.get("categories", {
        params: { type: 3 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败");
      }
      this.parentCateList = res.data;
    },
    //级联分类选择器改变时触发
    parentCateChanged() {
      this.getParamsData();
    },
    //当标签页被点击
    onTabsClick() {
      //更换标签页的时候发起请求更新级联选择器
      this.getParamsData();
    },
    //弹出删除属性对话框
    showDeleteParamDialog(col_data) {
      this.deleteParamForm.cat_id = col_data.cat_id;
      this.deleteParamForm.attr_id = col_data.attr_id;
      this.deleteParamForm.attr_name = col_data.attr_name;
      this.isDeleteParamDialogVisible = true;
    },
    //  弹出编辑属性对话框
    showEditParamDialog(col_data) {
      this.editParamForm = col_data;
      this.isEditParamDialogVisible = true;
    },
    //显示增添新标签所在的输入框
    showAddTagInput(col_data) {
      //显示输入框
      col_data.inputVisible = true;
      //让文本框获得焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //增加新attr_values
    async editNewAttrValues(col_data) {
      //在后端增加数据
      const { data: res } = await this.$axios.put(
        `categories/${col_data.cat_id}/attributes/${col_data.attr_id}`,
        {
          attr_name: col_data.attr_name,
          attr_sel: this.tabsActiveName,
          attr_vals: col_data.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        this.$message.error("增加新标签失败");
        return false;
      }
      return true;
    },
    //添加新标签
    async addNewTag(col_data) {
      //如果文本框没有内容则清空输入框内容
      if (col_data.inputValue.trim().length === 0) {
        col_data.inputValue = "";
        col_data.inputVisible = false;
        return;
      }
      //隐藏输入框显示增加按钮 输入框清空 视图区加入新数据
      col_data.attr_vals.push(col_data.inputValue.trim());
      col_data.inputVisible = false;
      col_data.inputValue = "";
      //在后端增加数据
      const isUploadSuccess = await this.editNewAttrValues(col_data);
      //如果后端增加数据不成功，移除刚增添的视图区数据
      if (isUploadSuccess === false) {
        col_data.attr_vals.pop();
      }
    },
    //当标签关闭的时候,同步删除后端的数据标签
    async onTagClose(col_data, index) {
      let removeData = col_data.attr_vals.splice(index, 1);
      //更新后端数据
      const isUploadSuccess = await this.editNewAttrValues(col_data);
      //如果删除不成功 则把刚删除的视图数据再次增添回去
      if (isUploadSuccess === false) {
        col_data.attr_vals.splice(index, 0, removeData[0]);
      }
    },
    //更改视图
  },

  created() {
    //为级联选择器更新数据
    this.getParentCateList();
  },
};
</script>



<style lang="scss" scoped>
.cat_opt {
  margin: 15px;
  span {
    line-height: 40px;
  }
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

