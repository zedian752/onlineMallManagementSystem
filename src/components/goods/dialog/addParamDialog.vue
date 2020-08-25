<template>
  <el-dialog :title="activeName==='many'?'添加参数':'添加属性'" :visible.sync="isAddParamDialogVisible" width="40%" @close="onDialogClose">
    <!-- 修改用户对话框内容主体 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addParamInfoForm" label-width="81px">
      <el-form-item label="新名称"  prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <!-- 修改用户对话框底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="isAddParamDialogVisible=false">取 消</el-button>
      <el-button @click="addParam()" type="primary" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
    isAddParamDialogVisible:false,
    addForm: { attr_name: "" },
    // 表单验证规则
    addFormRules:{attr_name:[{required:true,message:"请输入名称",trigger:"blur"}]}
    };
  },
  props: { activeName: String, propisAddParamDialogVisible: Boolean ,catId:{type:Number,default:0}},
  methods:{
      //关闭对话框清空表单内容
      onDialogClose(){
          this.$refs.addParamInfoForm.resetFields();
      },
    //   添加参数
      async addParam(){
          this.$refs.addParamInfoForm.validate(async valid=>{
              if(!valid) {return}
              const {data:res} = await this.$axios.post(`categories/${this.catId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName})
             if(res.meta.status!==201) {return this.$message.error("添加参数失败")}
             this.$message.success("添加参数成功");
             this.$emit("getParamsData");
          })
      }
  },
  computed:{

  },
  watch: {
        isAddParamDialogVisible(newValue){
            this.$emit("update:propisAddParamDialogVisible",newValue)
        },
        propisAddParamDialogVisible(newValue){
            this.isAddParamDialogVisible=newValue;
        }
  },
};
</script>