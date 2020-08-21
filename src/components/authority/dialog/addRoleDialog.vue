<template>
  <el-dialog
    title="添加角色"
    :visible.sync="isAddRoleDialogVisible"
    width="30%"
    @close="resetAddRoleForm()"
  >
    <!-- 添加角色对话框内容主体 -->
    <el-form :model="addRoleForm"  ref="addRoleFormRef" label-width="70px">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="addRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addRoleForm.roleDesc" ></el-input>
      </el-form-item>
    </el-form>
    <!-- 添加角色对话框底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="isAddRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRole()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      // 控制是否显示添加角色对话框
      isAddRoleDialogVisible: false,
      // 添加角色表单信息
      addRoleForm: { roleName: "",roleDesc:"" },
    };
  },
  props: { propisAddRoleDialogVisible: Boolean },

  methods: {
    // 当对话框关闭的时候,清空Roleform内的全部内容
    resetAddRoleForm() {
      this.$refs.addRoleFormRef.resetFields();
    },
    // 通过点击按钮增加角色
    addRole() {
      console.log(this.addRoleForm)
      this.$refs.addRoleFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        this.$axios.post("roles", this.addRoleForm).then((res) => {
          res = res.data;
          console.log(res);
          if (res.meta.status !== 201) {
            if (res.meta.status === 400) {
              return this.$message.error("角色名已存在");
            } else return this.$message.error("添加角色失败");
          }

          this.$message.success("添加角色成功");
          this.$emit("getRolesList");
          this.isAddRoleDialogVisible = false;
          
        });
      });
    },
  },
  watch: {
    isAddRoleDialogVisible(newValue) {
      this.$emit("update:propisAddRoleDialogVisible", newValue);
    },
    //父组件传进来的值
    propisAddRoleDialogVisible(newValue) {
      this.isAddRoleDialogVisible = newValue;
    },
  },
};
</script>