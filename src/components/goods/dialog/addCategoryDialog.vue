<template>
  <el-dialog
    title="添加分类"
    :visible.sync="isAddCategoryDialogVisible"
    width="50%"
    @close="addCateDialogClose()"
  >
    <!-- 添加角色对话框内容主体 -->
    <el-form :model="addCategoryForm" :rules="rules" ref="addCategoryFormRef" label-width="80px">
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addCategoryForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类" prop="cat_pid">
          <!-- 级联选择器 -->
         <el-cascader v-model="selectedKeys" :options="parentCateList" @change="parentCateChanged" :props="cascaderProp" clearable  ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- 添加角色对话框底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="isAddCategoryDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCategory()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
//子组件通信实例

export default {
  data() {
    return {
      // 控制是否显示添加角色对话框
      isAddCategoryDialogVisible: false,
      // 添加角色表单信息
      addCategoryForm: { cat_name: "",cat_pid:0,cat_level:0 },
      // 父级分类列表
      parentCateList:[],
      // cascader 配置选项
      cascaderProp:{value:'cat_id',label:'cat_name',children:'children',expandTrigger:'hover',checkStrictly:true},  
      //父级分类列表内选中的id数组
      selectedKeys:[]
    };
  },
  props: { propisAddCategoryDialogVisible: Boolean },
    beforeCreate(){
        //表单验证规则
        this.rules={cat_name: [
            { required: true, message: '必须填入分类名称', trigger: 'blur' }
          ]}
    },
  methods: {
      handleChange(val){console.log(val)},
    // 当对话框关闭的时候,清空Categoryform内的全部内容
    resetAddCategoryForm() {
      this.$refs.addCategoryFormRef.resetFields();
    },
    // 通过点击按钮增加角色
     addCategory() {
      console.log(this.addCategoryForm)
      this.$refs.addCategoryFormRef.validate(async (valid) => {
        if (!valid) {return;}

        const {data:res} = await this.$axios.post("categories", this.addCategoryForm)     
          if (res.meta.status !== 201) {
              return this.$message.error("添加分类失败");
          }
          this.$message.success("添加分类成功");
          //刷新级联选择器的数据
          this.getParentCateList(); 
          //刷新卡片视图内的数据
          this.$emit("getCategoriesList");
          this.isAddCategoryDialogVisible = false;

      });
    },
    // 获取父级分类的数据列表
    async getParentCateList(){
    const  {data:res}= await this.$axios.get('categories',{params:{type:2}})
    if(res.meta.status!==200) {return this.$message.error("获取父级分类失败")}
    this.parentCateList=res.data;
    },
    //父级分类选择器改变时触发
    parentCateChanged(){
        //如果有选中分类则更改addcategoryform里面的cat_pid和cat_level
        if(this.selectedKeys.length>0){
            //父级分类的id
            this.addCategoryForm.cat_pid=this.selectedKeys.slice(-1)[0];
            //为当前分类的等级赋值
            this.addCategoryForm.cat_level=this.selectedKeys.length;
            console.log(this.addCategoryForm)
            }
        else{//重置分类id和分类等级
            this.addCategoryForm.cat_pid=this.addCategoryForm.cat_level=0}
        console.log(this.selectedKeys)
    },
    // 关闭对话框时清空对话框内容
    addCateDialogClose(){
        this.$refs.addCategoryFormRef.resetFields();
        this.selectedKeys = [];
        this.addCategoryForm.cat_level =this.addCategoryForm.cat_pid =0;
    }
  },
  created(){ console.log("addcatedialog created");this.getParentCateList();},

  watch: {
    isAddCategoryDialogVisible(newValue) {
      this.$emit("update:propisAddCategoryDialogVisible", newValue);
    },
    //父组件传进来的值
    propisAddCategoryDialogVisible(newValue) {
      
      this.isAddCategoryDialogVisible = newValue;
    },
  },
};
</script>

