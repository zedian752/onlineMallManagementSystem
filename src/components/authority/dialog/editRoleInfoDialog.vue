<template>
  <el-dialog title="修改用户" :visible.sync="isEditRoleDialogVisible" width="30%">
    <!-- 修改用户对话框内容主体 -->
    <el-form
      :model="editRoleForm"
      ref="editRoleInfoForm"
      label-width="70px"
    >
      <el-form-item label="角色名称">
        <el-input v-model="editRoleForm.roleName" ></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="email">
        <el-input v-model="editRoleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <!-- 修改用户对话框底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="isEditRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editRoleInfo()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      //控制是否显示修改角色信息对话框
      isEditRoleDialogVisible: false,
        editRoleForm: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
    };
  },
  props: { propisEditRoleDialogVisible: Boolean ,editRoleId:Number},

  methods: {
    //修改单个角色信息
    editRoleInfo() {
        console.log(this.editRoleForm);
      this.$refs.editRoleInfoForm.validate((valid) => {
        if (!valid) {
          return;
        }
        this.$axios
          .put("roles/" + this.editRoleForm.roleId, this.editRoleForm)
          .then((res) => {
            res = res.data;
            console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error("修改角色失败");
            }
            this.$message.success("修改角色成功");
            this.isEditRoleDialogVisible = false;
            this.$emit("getRolesList");
          });
      });
    },
     // 获取待修改角色信息传进显示编辑角色信息对话框
      async showEditRoleInfoDialog(userId) {
      const { data: res } = await this.$axios.get("roles/" + userId);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editRoleForm = res.data;

    },
  },
  watch: {
      isEditRoleDialogVisible(newValue){
          this.$emit("update:propisEditRoleDialogVisible",newValue)
      },
      propisEditRoleDialogVisible(newValue){
          this.isEditRoleDialogVisible=newValue;
      },
      editRoleId(newValue){
        this.showEditRoleInfoDialog(newValue);
      }
  },
};
</script>