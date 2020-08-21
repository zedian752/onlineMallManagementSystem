<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="authorityList"
        border
        stript>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
            <template v-slot="scope">
                    <el-tag :type="level2TagType[scope.row.level]">{{level2TagInnerText[scope.row.level]}}</el-tag>
            </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
    //权限列表数据
      authorityList: [],
   

    };
  },
  created() {
    //权限等级对应tag类型
   this.level2TagType={
        '0':'',
        '1':'success',
        '2':'warning',
    },
    //权限等级对应tag内容文本
    this.level2TagInnerText={
        '0':'一级权限',
        '1':'二级权限',
        '2':'三级权限',
    }
    this.getAuthority();
  },
  methods: {
    // 获取权限列表
    async getAuthority() {
      const { data: res } = await this.$axios.get("rights/list");
      if (res.meta.status !== 200)
        return this.$message.error("获取用户权限失败");
      this.authorityList = res.data;
      console.log(res);
    },
  },
};
</script>