<template>
  <el-dialog :title="titleText" :visible.sync="isDeleteParamDialogVisible" width="40%">
    <!-- 删除用户对话框内容主体 -->
    <div>是否要删除"{{deleteParamForm.attr_name}}"</div>
    <!-- 删除用户对话框底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="isDeleteParamDialogVisible=false">取 消</el-button>
      <el-button @click="DeleteParam()" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isDeleteParamDialogVisible: false,
    }
  },
  props: {
    activeName: String,
    propisDeleteParamDialogVisible: Boolean,
    deleteParamForm: Object,
  },
  methods: {
    //   删除参数
    async DeleteParam() {
      console.log(this.deleteParamForm)
        const {data:res} = await this.$axios.delete(`categories/${this.deleteParamForm.cat_id}/attributes/${this.deleteParamForm.attr_id}`)
       if(res.meta.status!==200) {return this.$message.error("删除失败")}
       this.$message.success("删除成功");
       this.$emit("getParamsData");
       this.isDeleteParamDialogVisible=false;
    },
  },
  computed: {
    titleText() {
      return this.activeName === "many" ? "删除动态参数" : "删除静态属性";
    },
  },
  watch: {
    isDeleteParamDialogVisible(newValue) {
      this.$emit("update:propisDeleteParamDialogVisible", newValue);
    },
    propisDeleteParamDialogVisible(newValue) {
      
      this.isDeleteParamDialogVisible = newValue;
    },
  },
};
</script>