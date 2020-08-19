 <template>
  <!-- 面包屑导航区域 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card shadow="never">
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable="">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="isAddUserDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table 
            :data="userInfo.userlist" 
            border 
            stripe
           >
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" >
              <template v-slot="scope">
                <el-switch @change="userStateChanged(scope.row)"
                v-model="scope.row.mg_state"
                active-color="rgb(31,147,255)">
                </el-switch>
              </template>
          </el-table-column>
          <el-table-column label="操作">
              <template v-slot="scope">
                  <!-- 修改按钮 -->
                <el-tooltip  effect="dark" content="修改用户角色" placement="bottom" :enterable="false">                        
                  <el-button size="small" type="primary" icon="el-icon-edit" @click="showEditUserInfoDialog(scope.row.id)"></el-button>
                </el-tooltip>    
                  <!-- 删除按钮 -->
                <el-tooltip  effect="dark" content="删除用户角色" placement="bottom" :enterable="false">
                  <el-button size="small" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
                </el-tooltip>
                  <!-- 分配角色按钮 -->
                <el-tooltip  effect="dark" content="分配用户角色" placement="bottom" :enterable="false">
                  <el-button size="small" type="warning" icon="el-icon-setting"></el-button>
                </el-tooltip>
              </template>
          </el-table-column>

      </el-table>
       <!-- 用户信息分页区域 -->
      <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 5, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userInfo.total">
    </el-pagination>
  
   
    </el-card>
       <!-- 添加用户对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="isAddUserDialogVisible"
        width="30%"
        @close="resetAddUserForm()"
        > 
            <!-- 用户对话框内容主体 -->
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addFormRef" label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="addUserForm.password" type='password'></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>      
      </el-form>
      <!-- 用户对话框底部 -->
        <span slot="footer" class="dialog-footer">
      <el-button @click="isAddUserDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
      </el-dialog> 
       <!-- 修改用户对话框 -->
        <el-dialog
        title="修改用户"
        :visible.sync="isEditUserDialogVisible"
        width="30%"
        > 
            <!-- 修改用户对话框内容主体 -->
      <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserInfoForm" label-width="70px" >
        <el-form-item label="用户名" >
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
      
  </div>
</template>


<script>
import formRegRules from '../../assets/regRule/rule'
import MyUserDialog from './dialog/addUserDialog'
export default {
  components:{
    MyUserDialog,
   
  },
  data() {
    
    // 校验邮箱方法
    var checkEmail = (rule,value,callback) =>{
      const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.([a-zA-Z0-9_-])+$/;
      if(regEmail.test(value)){
        return callback();
      }
      callback(new Error('邮箱格式有误'))
    }
    // 校验手机方法
    var checkMobile = (rule,value,callback) =>{
        const regMobile=/^(1[3|5-9]\d{9})$/;
      if(regMobile.test(value)){
        return callback();
      }
      callback(new Error('手机格式有误'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: { query: "", pagenum: 1, pagesize: 5 }, //pagenum 当前页码 pagesize 每页显示多少个数据 
      // 用于渲染的用户信息
      userInfo:{userlist:[],total:0},
      // 控制是否显示添加用户对话框
      isAddUserDialogVisible:false,
      // 添加用户表单信息
      addUserForm:{username:'',password:'',email:'',mobile:''},
      // 添加用户表单信息时的验证规则
      addUserFormRules:{
        username:formRegRules.username,
        password:formRegRules.password,
        email:formRegRules.email,
        mobile:formRegRules.mobile
        },
      //控制是否显示修改用户信息对话框
      isEditUserDialogVisible:false,
      // 修改用户表单信息
      editUserForm:{
        id:'',
        email:'',
        mobile:''
      },
      editUserFormRules:{
        email:formRegRules.email,
        mobile:formRegRules.mobile
        },
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get("users", {params: this.queryInfo,});
      this.userInfo.userlist=res.data.users;
      this.userInfo.total=res.data.total;
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
    },
    // 分页器监听函数且刷新当前显示用户信息
    handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize;
        this.getUserList();
    },
    // 监听页码值改变且刷新当前显示用户信息
    handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage;
        this.getUserList();
    },
    //监听switch变化且更新用户状态(连接数据库)
    async userStateChanged(userinfo){
    const {data:res}= await this.$axios.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
    if(res.meta.status!==200){
        ueserinfo.mg_state =!ueserinfo.mg_state;
        return this.$message.error(res.meta.msg)}
    
    this.$message.success("更新用户状态成功")
    },
      // 当对话框关闭的时候,清空userform内的全部内容
    resetAddUserForm(){
       this.$refs.addFormRef.resetFields();
    },

    // 通过点击按钮增加用户
     addUser(){
        this.$refs.addFormRef.validate(valid=>{
        if(!valid) {return;}
        this.$axios.post('users',this.addUserForm).then(res=>{
          res=res.data;
          console.log(res);
        if(res.meta.status === 201){
          return this.$message.error('添加用户失败')
        }
        this.$message.success("添加用户成功");
        this.isAddUserDialogVisible = false;
        this.getUserList();
        });


        })
    },
    // 显示编辑用户信息对话框
    async showEditUserInfoDialog(userId){
    const {data:res} = await this.$axios.get('users/'+userId);
    if(res.meta.status!==200){
      return this.$message.error("查询用户信息失败")
    }
    this.editUserForm = res.data;
        this.isEditUserDialogVisible = true;
    },
    //修改单个用户信息 
    editUserInfo(){
        this.$refs.editUserInfoForm.validate(valid=>{
        if(!valid) {return;}
        this.$axios.put('users/'+this.editUserForm.id,this.editUserForm).then(res=>{
          res=res.data;
          console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('修改用户失败')
        }
        this.$message.success("修改用户成功");
        this.isEditUserDialogVisible = false;
        this.getUserList();
        });


        })
    },
    removeUserById(userId){
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 进行删除
          const {data:res} = await this.$axios.delete('users/'+userId);
          if(res.meta.status===200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //刷新用户列表
          this.getUserList();
          }
          else{
            this.$message({
            type: 'warning',
            message: '删除失败!'
          });
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          });          
        });

    }
  },
  watch:{
  }
};
</script>
<style>
</style>