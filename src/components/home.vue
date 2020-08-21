<template>
   
<el-container class="home-container">
    <!-- 头部header -->
  <el-header>    
      
      <div>
           <img class="header-logo" src="../assets/img/流子.jpg" alt="电商后台管理系统">
           <span>电商后台管理系统</span>
      </div>
       <el-button type="info" @click="loginOut()">注销</el-button>
  </el-header>
   
  <el-container>
    <!-- 侧边栏 -->
  <el-aside :width="isCollapse ? '64px':'200px'">
    <div class="toggle-button" @click="toggleCollapse()">|||</div>
   
    <el-menu
      class="el-menu-vertical"
      @open="handleOpen()"
      @close="handleClose()"
      background-color="rgb(49,55,67)"
      text-color="#fff"
      active-text-color="#409eff"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="subMenuActivePath"
      >
      <el-submenu  v-for="(item,index) in menulist" :key="item.id" :index="item.id+''">
        <template slot="title">
          <i :class="iconGroup[index]"></i>
          <span>{{item.authName}}</span>
        </template>
          <!--二级菜单  -->
          <el-menu-item  @click="saveNavState('/'+subItem.path)" v-for="(subItem) in item.children" :key="subItem.id+''" :index="'/'+subItem.path">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
          </el-menu-item>
      </el-submenu>

    </el-menu>

    </el-aside>
    <!-- 主体 -->
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
     
    
</template>
<script>
export default {
    name:'home',
    data(){return{
        menulist:[]
        ,iconGroup:['iconfont icon-user','iconfont icon-tijikongjian','iconfont icon-shangpin','iconfont icon-danju-tianchong','iconfont icon-baobiao']
        ,isCollapse:false //是否折叠
        ,subMenuActivePath:'' //子菜单默认active的路径
    }},
    created(){
        this.getMentuList();
        this.subMenuActivePath=window.sessionStorage.getItem('activePath');
    },
    methods:{
        loginOut(){
            window.sessionStorage.removeItem('token');
            this.$router.push('/login')
        },

        handleOpen(){},

        handleClose(){},

        async getMentuList(){
            const {data:res} =  await this.$axios.get("menus")
            if(res.meta.status!==200) return this.$message.error(res.meta.msg)
            this.menulist=res.data;
             
        },
        //切换菜单的折叠与打开
        toggleCollapse(){
            this.isCollapse=!this.isCollapse;
        },
        //保存submenu的default-active的值,用于持久化页面的active标签
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.subMenuActivePath=activePath
        }
    }
}
</script>
<style lang="scss">
    .el-header{
        display:flex;
        justify-content: space-between;
        background-color: rgb(54,61,64);
        align-items: center;
        color: #fff;
        font-size: 20px;
        >div{display: flex;align-items: center;
            >span{margin-left: 8px;}
            }
        .header-logo{width: 60px; height: 60px;}
    }
    .header-banner{
        display: flex;
    }
    .header-banner img{
        width:60px;
        height:60px;
    }
    .el-aside{
        transition: all .5s;
        background-color: rgb(49,55,67);
    }
    .el-main{
        background-color: rgb(233,237,241);
    }
    .home-container{
        height: 100%;
    }
    .el-menu-vertical{
        border: none;
    }
    .el-submenu{
        .iconfont{padding-right: 5px;}
        
    }
    .toggle-button{
        background-color: rgb(71,81,99);
        font-size: 10px;
        line-height: 24px;
        color: #ffffff;
        text-align: center;
        letter-spacing: 1.5px;
        cursor: pointer;
    }
</style>