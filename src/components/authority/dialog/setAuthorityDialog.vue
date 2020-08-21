<template>
<el-dialog
  title="分配权限"
  :visible.sync="isSetAuthorityDialogVisible"
  width="30%"
  @close="beforeDialogClose()"
  ref="rightsdialog"
  >
    <!-- 主体内容 -->
    <el-tree :data="allAuthoritysList" :props="treeProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="defaultKey" ref="authorityTree"></el-tree>
    <!-- footer -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="isSetAuthorityDialogVisible = false">取 消</el-button>
    <!-- <el-button type="primary" @click="isSetAuthorityDialogVisible = false">确 定</el-button> -->
    <el-button type="primary" @click="updateRoleAuthority()">更改数据</el-button>
  </span>
</el-dialog>
</template>


<script>
export default {
    data(){return{
        isSetAuthorityDialogVisible:false,
        //所有权限列表 
        allAuthoritysList:[],
        // 树形控件与权限数据的对应绑定映射关系
        treeProps:{children:'children',label:'authName'},
        // 默认选中的节点的id值
        defaultKey:[]
        }},
    //父组件传参
    props:{propisSetAuthorityDialogVisible:Boolean,roleNode:Object},
    async created(){
        //获取树形结构的权限列表
        const {data:res} = await this.$axios.get('rights/tree')
        if(res.meta.status!==200) {return this.$message.error("获取权限列表失败")};
        this.allAuthoritysList=res.data;
    },
    methods:{
      // 通过递归获取选中节点(三级节点)的id,并保存到数组
      getNodeKeys(node,arr){
        if(!node.children){
          //只需要3级节点
          return arr.push(node.id);
        }
        node.children.forEach(item=>{this.getNodeKeys(item,arr)})

      },
      beforeDialogClose(){
        this.defaultKey = [];
      },
      //更新单个角色的权限
      async updateRoleAuthority(){
        let keys = [...this.$refs.authorityTree.getCheckedKeys(),...this.$refs.authorityTree.getHalfCheckedKeys()]
        const idStr = keys.join(',')
        const {data:res} = await this.$axios.post(`roles/${this.roleNode.id}/rights`,{rids:idStr})
        if(res.meta.status!==200) {this.$message.error("分配权限失败！")}
        this.$message.success("权限分配成功！")
        this.$emit("getRolesList")

      }
    },
    watch:{
        isSetAuthorityDialogVisible(newValue){
            this.$emit("update:propisSetAuthorityDialogVisible",newValue)
        },
        propisSetAuthorityDialogVisible(newValue){
            this.isSetAuthorityDialogVisible=newValue
        },
        roleNode(newValue){
          //用同步的方式更新数据
          this.getNodeKeys(newValue,this.defaultKey)
          //用异步的方式等到下一个事件循环中tree组件加载完成之后再更新该些节点
          this.$nextTick(()=>{
            this.$refs.authorityTree.setCheckedKeys(this.defaultKey)
            })
         
        },
    },

}
</script>