<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card shadow="never">
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="isAddRoleDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="rolesInfo.rolesList" border stripe>
        <el-table-column type="expand" label="#">
            <template v-slot="scope">
                <el-row :class="['bdbottom',index1===0?'bdtop':'','vertical-center']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
                    <!-- 渲染一级权限 -->
                    <el-col :span="5">
                        <el-tag  closable @close="removeAuthorityById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 渲染二级和三级权限 -->
                    <el-col :span="19">
                        <!-- 渲染二级权限 -->
                        <el-row :class="[index2===0?'':'bdtop','vertical-center']" v-for="(item2,index2) in item1.children" :key="item2.id">
                            <el-col :span="6">
                                <el-tag type="success"  closable @close="removeAuthorityById(scope.row,item2.id)">{{item2.authName}}</el-tag> <i class="el-icon-caret-right"></i>
                            </el-col>
                                <el-col :span="18" >
                                    <!-- 渲染三级权限 -->
                                    <el-tag closable @close="removeAuthorityById(scope.row,item3.id)" type="warning"  v-for="(item3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <!-- <pre>{{scope.row}}</pre> -->
            </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip effect="dark" content="编辑角色信息" placement="bottom" :enterable="false">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                @click="showEditRoleInfoDialog(scope.row.id)"
              >编辑</el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除角色" placement="bottom" :enterable="false" >
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="removeRoleById(scope.row.id)"
              >删除</el-button>
            </el-tooltip>
            <!-- 分配权限按钮 -->
            <el-tooltip effect="dark" content="分配角色权限" placement="bottom" :enterable="false">
              <el-button size="small" type="warning" icon="el-icon-setting" @click="showSetAuthorityDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 增加角色信息对话框 -->
    <addRoleDialog :propisAddRoleDialogVisible.sync="isAddRoleDialogVisible" @getRolesList="getRolesList()"></addRoleDialog>
    <!-- 编辑角色信息对话框 -->
    <editRoleInfoDialog :propisEditRoleDialogVisible.sync="isEditRoleDialogVisible" @getRolesList="getRolesList()" :editRoleId="editRoleId"></editRoleInfoDialog>
    <!-- 分配角色权限对话框 -->
    <setAuthorityDialog :propisSetAuthorityDialogVisible.sync="isSetAuthorityDialogVisible" :roleNode="roleNode" @getRolesList="getRolesList()"></setAuthorityDialog>
  </div>
</template>

<script>
import addRoleDialog from './dialog/addRoleDialog'
import editRoleInfoDialog from './dialog/editRoleInfoDialog'
import setAuthorityDialog from './dialog/setAuthorityDialog'
export default {

    data(){return{
        //角色信息
        rolesInfo:{rolesList:[]},
        //是否显示增加角色对话框
        isAddRoleDialogVisible:false,
        //是否显示修改角色对话框
        isEditRoleDialogVisible:false,
        //是否显示修改角色对话框
        isSetAuthorityDialogVisible:false,
        //用于传进修改角色对话框子组件的roleid
        editRoleId:undefined,
        //用于传入分配角色权限对话框的第一级角色权限数据节点
        roleNode:undefined

    }},
    components:{editRoleInfoDialog,addRoleDialog,setAuthorityDialog},
    created(){
        this.getRolesList();
    },
    methods: {
       //获取角色列表
       async getRolesList(){
        
           const {data:res} = await this.$axios.get("roles");
           if(res.meta.status!==200) {return this.$message.error("获取角色列表失败")}
           this.rolesInfo.rolesList=res.data;
       },
      // 获取待修改角色信息传进被抽离的子组件中并显示编辑角色信息对话框
       showEditRoleInfoDialog(roleId) {
        //将roleid传入子组件
      this.editRoleId=roleId;
      this.isEditRoleDialogVisible = true;
    },

       //根据id移除角色
       removeRoleById(roleId){      
        this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
          // 进行删除
          const { data: res } = await this.$axios.delete("roles/" + roleId)
          if (res.meta.status === 200) {
            this.$message.success("删除成功");
            //刷新角色列表
            this.getRolesList();
          } else {this.$message.warning("删除失败!")
          }
        })
        .catch(() => {this.$message.info("已取消删除")
        })},
        //根据角色id删除角色的单个权限
        removeAuthorityById(role,rightId){
        this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async ()=>{
          // 进行删除
          const { data: res } = await this.$axios.delete("roles/" + role.id+'/rights/'+rightId)
          if (res.meta.status === 200) {
            this.$message.success("删除成功");
            //这里不进行刷新角色列表,会导致权限栏关闭,需要重新打开,取而代之的是重渲染这一行被更改的数据
            //  this.getRolesList();
            role.children =res.data;
          } else {this.$message.warning("删除失败!")}
          
      })
        .catch(()=>{
            this.$message.info("已取消删除")
        })},
    //显示分配角色权限对话框
    showSetAuthorityDialog(roleNode){
        this.roleNode=roleNode;
        this.isSetAuthorityDialogVisible=true;
   
        
    }
    },

};
</script>

<style lang="scss" scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eeeeee;
    }
    .bdbottom{
        border-bottom: 1px solid #eeeeee;
    }
    .vertical-center{
        display: flex;
        align-items: center;
    }
</style>