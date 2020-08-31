<template>
  <el-dialog title="修改用户" :visible.sync="isEditUserDialogVisible" width="30%">
    <!-- 修改用户对话框内容主体 -->
    <el-form
      :model="editUserForm"
      :rules="editUserFormRules"
      ref="editUserInfoForm"
      label-width="70px"
    >
      <el-form-item label="用户名">
        <el-input v-model="editUserForm.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editUserForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 修改用户对话框底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="isEditUserDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUserInfo()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import formRegRules from "../../../assets/regRule/rule";
export default {
  data() {
    return {
      //控制是否显示修改用户信息对话框
      isEditUserDialogVisible: false,
      // 修改用户表单信息
      editUserForm: {
        id: "",
        email: "",
        mobile: "",
      },
    };
  },
  props: { propisEditUserDialogVisible: Boolean,userId:Number},
  beforeCreate() {
    this.editUserFormRules = {
      email: formRegRules.email,
      mobile: formRegRules.mobile,
    };
  },



  methods: {
    //修改单个用户信息
    editUserInfo() {
      this.$refs.editUserInfoForm.validate((valid) => {
        if (!valid) {
          return;
        }
        this.$axios
          .put("users/" + this.editUserForm.id, this.editUserForm)
          .then((res) => {
            res = res.data;
            if (res.meta.status !== 200) {
              return this.$message.error("修改用户失败");
            }
            this.$message.success("修改用户成功");
            this.isEditUserDialogVisible = false;
            this.$emit("getUserList");
          });
      });
    },
    async getEditUserInfo(userId) {
      const { data: res } = await this.$axios.get("users/" + userId);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editUserForm = res.data;
      this.isEditUserDialogVisible = true;
    },
  },
  watch: {
    isEditUserDialogVisible(newValue) {
      this.$emit("update:propisEditUserDialogVisible", newValue);
    },
    propisEditUserDialogVisible(newValue) {
      this.isEditUserDialogVisible = newValue;
    },
    // 监控父传值用以请求获取当前待修改用户的信息
    userId(newValue){
       this.getEditUserInfo(newValue);
    }
  },
};
</script>