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
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="isAddUserDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userInfo.userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              @change="userStateChanged(scope.row)"
              v-model="scope.row.mg_state"
              active-color="rgb(31,147,255)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改用户角色" placement="bottom" :enterable="false">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                @click="showEditUserInfoDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除用户角色" placement="bottom" :enterable="false">
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配用户角色" placement="bottom" :enterable="false">
              <el-button size="small" type="warning" icon="el-icon-setting" @click="showAssignRoleDialog(scope.row)"></el-button>
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
        :total="userInfo.total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <addUserDialog
      :propisAddUserDialogVisible.sync="isAddUserDialogVisible"
      @getUserList="getUserList()"
    ></addUserDialog>

    <!-- 修改用户对话框 -->
    <editUserInfoDialog
      :propisEditUserDialogVisible.sync="isEditUserDialogVisible"
      @getUserList="getUserList()"
      :userId="editUserId"
    ></editUserInfoDialog>
    <!-- 分配用户角色对话框 -->
    <assignRoleDialog :propisAssignRoleDialogVisible.sync="isAssignRoleDialogVisible" @getUserList="getUserList()" :userInfo="assignRoleInfo"></assignRoleDialog>
  </div>
</template>


<script>
// 抽离后的增添用户对话框子组件
import addUserDialog from "./dialog/addUserDialog";
// 抽离后的修改用户对话框子组件
import editUserInfoDialog from "./dialog/editUserInfoDialog";
// 抽离后的分配用户角色对话框子组件
import assignRoleDialog from "./dialog/assignRoleDialog";
export default {
  components: {
    addUserDialog,
    editUserInfoDialog,
    assignRoleDialog
    
  },
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: { query: "", pagenum: 1, pagesize: 5 }, //pagenum 当前页码 pagesize 每页显示多少个数据
      // 用于渲染的用户信息
      userInfo: { userlist: [], total: 0 },
      // 控制是否显示添加用户对话框
      isAddUserDialogVisible: false,
      //控制是否显示修改用户信息对话框
      isEditUserDialogVisible: false,
      //控制是否显示分配角色信息对话框
      isAssignRoleDialogVisible: false,
      // 用户id,传递进修改用户信息子组件内使用
      editUserId:undefined,
      // 用户id,传递进修改用户角色子组件内使用
      assignRoleInfo:undefined
    };
  },
  created() {
    // 刷新用戶列表
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get("users", {
        params: this.queryInfo,
      });
      this.userInfo.userlist = res.data.users;
      this.userInfo.total = res.data.total;
      
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
    },
    // 分页器监听函数且刷新当前显示用户信息
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变且刷新当前显示用户信息
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听switch变化且更新用户状态(连接数据库)
    async userStateChanged(userinfo) {
      const { data: res } = await this.$axios.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        ueserinfo.mg_state = !ueserinfo.mg_state;
        return this.$message.error(res.meta.msg);
      }

      this.$message.success("更新用户状态成功");
    },

    // 获取待修改用户id传进子组件中然后显示编辑用户信息对话框
    showEditUserInfoDialog(userId) {
      this.editUserId=userId;
      this.isEditUserDialogVisible = true;
    },
    //根据用户id删除用户
    removeUserById(userId) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 进行删除
          const { data: res } = await this.$axios.delete("users/" + userId);
          if (res.meta.status === 200) {
            this.$message.success("删除成功");
            //刷新用户列表
            this.getUserList();
          } else {
            this.$message.warning("删除失败!");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 获取待修改用户id传进子组件然后显示分配用户角色信息对话框    
      showAssignRoleDialog(userInfo) {
      this.assignRoleInfo=userInfo;
      this.isAssignRoleDialogVisible = true;
    },
  },
  watch: {},
};
</script>
<style>
</style>