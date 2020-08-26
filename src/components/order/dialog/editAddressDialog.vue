<template>
  <el-dialog
    title="修改地址"
    :visible.sync="isEditAddressDialogVisible"
    width="40%"
    @close="onDialogClose"
  >
    <!-- 修改用户对话框内容主体 -->
    <el-form
      :rules="addressFormRules"
      :model="editAddressForm"
      ref="editAddressInfoForm"
      label-width="100px"
    >
      <el-form-item prop="address_province" label="省市区/县">
        <el-cascader
          v-model="editAddressForm.province"
          :options="cityOptions"
          :props="cascaderProp"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="address_detail" label="详细地址">
        <el-input v-model="editAddressForm.detailAddress"></el-input>
      </el-form-item>
    </el-form>
    <!-- 修改用户对话框底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="isEditAddressDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editAddressInfo()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import cityOptions from "../../../assets/ChinaProvincesData";
import rules from "../../../assets/regRule/rule";
export default {
  data() {
    return {
      //控制是否显示修改用户信息对话框
      isEditAddressDialogVisible: false,
      // 修改用户表单信息
      editAddressForm: {
        id: "",
        detailAddress: "",
        province: [],
      },
      addressFormRules: {
        address_province: rules.address_province,
        address_detail: rules.address_detail,
      },
      cityOptions: cityOptions,
      cascaderProp: {
        value: "value",
        label: "label",
        children: "children",
        expandTrigger: "hover",
      },
    };
  },
  methods: {
    editAddressInfo() {},
    onDialogClose() {
      (this.editAddressForm.detailAddress = ""),
        (this.editAddressForm.province = []);
    },
  },
  props: { propisEditAddressDialogVisible: Boolean, orderId: Number },
  watch: {
    isEditAddressDialogVisible(newValue) {
      this.$emit("update:propisEditAddressDialogVisible", newValue);
    },
    propisEditAddressDialogVisible(newValue) {
      this.isEditAddressDialogVisible = newValue;
    },
  },
};
</script>