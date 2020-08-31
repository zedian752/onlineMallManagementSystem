<template>
  <el-dialog
    title="物流进度"
    :visible.sync="isShowProgressDialogVisible"
    width="40%">
    <!--主体信息  -->
    <el-timeline>
         <el-timeline-item v-for="(item,index) in progressInfo" :key="index" :timestamp="item.time">{{item.context}}</el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>

<script>
import cityOptions from "../../../assets/ChinaProvincesData";
import rules from "../../../assets/regRule/rule";
export default {
  data() {
    return {
      //控制是否显示修改用户信息对话框
      isShowProgressDialogVisible: false,
      // 修改用户表单信息
      ShowProgressForm: {
        id: "",
        detailAddress: "",
        province: [],
      },
      addressFormRules: {
        address_province: rules.address_province,
        address_detail: rules.address_detail,
      },
    //   省份数据
      cityOptions: cityOptions,
    //   级联选择器options
      cascaderProp: {
        value: "value",
        label: "label",
        children: "children",
        expandTrigger: "hover",
      },
    //   物流数据
      progressInfo:[]
    };
  },
  methods: {
    //   获取物流信息
    async getProgressInfo(){
        const {data:res}  =await this.$axios.get(`/kuaidi/1106975712662`)
        if(res.meta.status!==200){return this.$message.error("获取物流信息失败")}
        this.progressInfo = res.data; 
    },

    onDialogClose() {
      this.showProgressForm.detailAddress = "",
      this.showProgressForm.province = [];
    },
  },
  props: { propisShowProgressDialogVisible: Boolean, orderId: Number },
  watch: {
    isShowProgressDialogVisible(newValue) {
      this.$emit("update:propisShowProgressDialogVisible", newValue);
    },
    propisShowProgressDialogVisible(newValue) {
      this.isShowProgressDialogVisible = newValue;
    },
    orderId(){
        this.getProgressInfo()
    }
  },
};
</script>