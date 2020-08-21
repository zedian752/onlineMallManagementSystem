<template>
  <el-dialog title="分配角色" :visible.sync="isAssignRoleDialogVisible" width="30%">
    <!-- 分配角色对话框内容主体 -->
    <div>
      <p>当前的角色:{{userInfo.username}}</p>
      <p>当前的用户:{{userInfo.role_name}}</p>
      <p>分配新角色
        <el-select v-model="selectRoleId"  placeholder="请选择">
          <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
        </el-select>

      </p>
    </div>
    
    <!-- 分配角色对话框底部 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="isAssignRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUserRole()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      //控制是否显示分配角色信息对话框
      isAssignRoleDialogVisible: false,
      //角色列表
      rolesList:'',
      //选择的角色id
      selectRoleId:undefined    
    };
  },

  props: { propisAssignRoleDialogVisible: Boolean, 
            //角色信息
            userInfo:{type:Object,default:()=>({})  }
            },
  methods: {
    //修改单个用户为何角色
    async editUserRole() {
      const { data: res } = await this.$axios.put("users/" + this.userInfo.id +'/role',{rid:this.selectRoleId});
      if (res.meta.status !== 200) {
        return this.$message.error("分配角色失败");
      }
      this.$message.success("分配角色成功");
      this.isAssignRoleDialogVisible = false;
      this.$emit("getUserList");
    },
    // 获取角色列表
      async getRoleList(){
        const {data:res} = await this.$axios.get('roles');
        if(res.meta.status!==200) {return this.$message.error("获取角色列表失败")}
        this.rolesList=res.data;
    
      }
  },
    
    created(){
    this.getRoleList();
  },
  watch: {
    isAssignRoleDialogVisible(newValue) {
      this.$emit("update:propisAssignRoleDialogVisible", newValue);
    },
    propisAssignRoleDialogVisible(newValue) {
      this.isAssignRoleDialogVisible = newValue;
    },
  },
};
</script>