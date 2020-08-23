<template>
  <el-dialog title="修改用户" :visible.sync="isEditCategoryDialogVisible" width="40%">
    <!-- 修改用户对话框内容主体 -->
    <el-form
      :model="editCategoryForm"
      ref="editCategoryInfoForm"
      label-width="81px"
    >
      <el-form-item label="新名称"  required>
        <el-input v-model="editCategoryForm.cat_name"></el-input>
      </el-form-item>
    </el-form>
    <!-- 修改用户对话框底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="isEditCategoryDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editCategoryInfo()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      //控制是否显示修改角色信息对话框
      isEditCategoryDialogVisible: false,
        editCategoryForm: {
        cat_name: "",
      },
    };
  },
  props: { propisEditCategoryDialogVisible: Boolean ,editCategoryId:Number},

  methods: {
    //修改单个分类名字信息
    async editCategoryInfo() {

    const {data:res} = await this.$axios.put("categories/" + this.editCategoryId,{cat_name:this.editCategoryForm.cat_name})

            if (res.meta.status !== 200) {
              return this.$message.error("修改分类失败");
            }
            this.$message.success("修改分类成功");
            this.isEditCategoryDialogVisible = false;
            this.$emit("getCategorysList");
    },
  },
  watch: {
      isEditCategoryDialogVisible(newValue){
          this.$emit("update:propisEditCategoryDialogVisible",newValue)
      },
      propisEditCategoryDialogVisible(newValue){
          this.isEditCategoryDialogVisible=newValue;
      },

  },
};
</script>
