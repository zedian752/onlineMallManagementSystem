<template>
  <el-dialog
    :title="titleText"
    :visible.sync="isEditParamDialogVisible"
    width="40%"
    @close="onDialogClose"
  >
    <!-- 修改用户对话框内容主体 -->
    <el-form label-width="81px">
      <el-form-item label="新名称" required>
        <el-input v-model="new_attr_name"></el-input>
      </el-form-item>
    </el-form>
    <!-- footer -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="isEditParamDialogVisible=false">取 消</el-button>
      <el-button @click="EditParam()" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isEditParamDialogVisible: false,
      new_attr_name: "",
    };
  },
  props: {
    activeName: String,
    propisEditParamDialogVisible: Boolean,
    editParamForm: Object,
  },
  methods: {
    //   修改参数
    async EditParam() {
      const {
        data: res,
      } = await this.$axios.put(
        `categories/${this.editParamForm.cat_id}/attributes/${this.editParamForm.attr_id}`,
        { attr_name: this.new_attr_name, attr_sel: this.activeName }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改失败");
      }
      this.$message.success("修改成功");
      this.$emit("getParamsData");
      this.isEditParamDialogVisible = false;
    },
    onDialogClose() {
      this.new_attr_name = "";
    },
  },
  computed: {
    titleText() {
      return this.activeName === "many" ? "修改动态参数" : "修改静态属性";
    },
  },
  watch: {
    isEditParamDialogVisible(newValue) {
      this.$emit("update:propisEditParamDialogVisible", newValue);
    },
    propisEditParamDialogVisible(newValue) {
      this.isEditParamDialogVisible = newValue;
    },
  },
};
</script>