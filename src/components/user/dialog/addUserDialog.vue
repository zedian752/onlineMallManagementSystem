<template>
  <el-dialog
    title="添加用户"
    :visible.sync="isAddUserDialogVisible"
    width="30%"
    @close="resetAddUserForm()"
  >
    <!-- 添加用户对话框内容主体 -->
    <el-form :model="addUserForm" :rules="addUserFormRules" ref="addFormRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addUserForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addUserForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addUserForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 添加用户对话框底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="isAddUserDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 表单验证规则
import formRegRules from "../../../assets/regRule/rule";
export default {
  data() {
    return {
      // 控制是否显示添加用户对话框
      isAddUserDialogVisible: false,
      // 添加用户表单信息
      addUserForm: { username: "", password: "", email: "", mobile: "" },
    };
  },
  props: { propisAddUserDialogVisible: Boolean },
  beforeCreate() {
    // 添加用户表单信息时的验证规则
    this.addUserFormRules = {
      username: formRegRules.username,
      password: formRegRules.password,
      email: formRegRules.email,
      mobile: formRegRules.mobile,
    };
  },

  methods: {
    // 当对话框关闭的时候,清空userform内的全部内容
    resetAddUserForm() {
      this.$refs.addFormRef.resetFields();
    },
    // 通过点击按钮增加用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        this.$axios.post("users", this.addUserForm).then((res) => {
          res = res.data;
          if (res.meta.status !== 201) {
            if (res.meta.status === 400) {
              return this.$message.error("用户名已存在");
            } else return this.$message.error("添加用户失败");
          }

          this.$message.success("添加用户成功");
          this.isAddUserDialogVisible = false;
          this.$emit("getUserList");
        });
      });
    },
  },
  watch: {
    isAddUserDialogVisible(newValue) {
      this.$emit("update:propisAddUserDialogVisible", newValue);
    },
    //父组件传进来的值
    propisAddUserDialogVisible(newValue) {
      this.isAddUserDialogVisible = newValue;
    },
  },
};
</script>