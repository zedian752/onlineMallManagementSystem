<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示区域 -->
      <el-alert tpye="info" title="添加商品信息" center show-icon :closable="false"></el-alert>
      <!-- 进度条 -->
      <el-steps :space="200" :active="+activeStep" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单数据 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <!-- 竖向标签页 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeStep"
          :before-leave="beforeTabLeave"
          @tab-click="onTabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="parentCateList"
                :props="cascaderProp"
                clearable
                @change="onCascaderChange"
                size="medium"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数目" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
          </el-tab-pane>
            <!-- 面板1 -->
          <el-tab-pane label="商品参数" name="1">
            <div v-if="manyData.length">
              <el-form-item :label="item.attr_name" v-for="(item) in manyData" :key="item.attr_id">
                <!-- 复选框组 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox
                    border
                    v-for="(checkBoxItem,index) in item.attr_vals"
                    :key="index"
                    :label="checkBoxItem"
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div v-else>暂无数据</div>
          </el-tab-pane>
            <!-- 面板2 -->
          <el-tab-pane label="商品属性" name="2">
            <div v-if="onlyData.length">
              <el-form-item :label="item.attr_name" v-for="(item) in onlyData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </div>
            <div v-else>暂无数据</div>
          </el-tab-pane>
          <!-- 面板3 -->
          <el-tab-pane label="商品图片" name="3">
                <el-upload
                class="upload-demo"
                :headers="uploadPicHeader"
                :action="uploadPicUrl"
                :on-preview="onPicPreview"
                :on-remove="onPicRemove"
                :on-success="onPicUploadSuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
          </el-tab-pane>
          <!-- 面板4 -->
          <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器 -->
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button class="addBtn" type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog
  title="图片预览"
  :visible.sync="picPreviewVisible"
  width="80%">
  <!-- 主体内容 -->
 <img :src="previewPath" class="preview-img">
</el-dialog>
  </div>
</template>

<script>
import formRules from "../../assets/regRule/rule";

// 富文本编辑器
export default {
  data() {  
    return {
      //触发的步骤块
      activeStep: "0",
      //商品表单信息
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        //商品所属分类数组
        goods_cat: [],
        // 图片临时地址
        pics:[],
        // 商品描述
        goods_introduce:'',
        attrs:[]
      },
    //图片临时预览图片
    previewPath:'',
    //图片预览对话框是否打开
    picPreviewVisible:false,
      //商品表单验证规则
      addFormRules: {
        goods_name: formRules.goods_name,
        goods_price: formRules.goods_price,
        goods_number: formRules.goods_number,
        goods_weight: formRules.goods_weight,
        goods_cat: formRules.goods_cat,
      },
      //商品基本信息内的级联选择器数据
      parentCateList: [],
      //级联选择器配置
      cascaderProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      //2级面板动态参数数据
      manyData: [],
      //3级面板动态参数数据
      onlyData: [],
      //上传图片地址
      uploadPicUrl:'http://127.0.0.1:8888/api/private/v1/upload',
      uploadPicHeader:{Authorization:window.sessionStorage.getItem("token")}
    };
  },
  methods: {
    // 获取父级分类的数据列表,用于级联选择器
    async getParentCateList() {
      const { data: res } = await this.$axios.get("categories", {
        params: { type: 3 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败");
      }
      this.parentCateList = res.data;
    },
    //级联选择器发生变化
    onCascaderChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择三级分类");
        this.addForm.goods_cat = [];
        return;
      }
    },
    //标签页更换前
    beforeTabLeave(newActiveName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length === 0) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    //onTabClick 当tabs内的tab被点击
    onTabClick() {
      if (this.activeStep === "1") {
        this.getParamsData("many");
      } else if (this.activeStep === "2") {
        this.getParamsData("only");
      }
    },
    //获取面板2,3内的商品参数
    async getParamsData(sel) {
      const {
        data: res,
      } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
        params: { sel: sel },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取动态参数列表失败");
      }
      //onlyDate的attr_vals不需要进行数组化
      if (sel === "only") {
        this.onlyData = res.data;
        return;
      }
      res.data.forEach((item) => {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
      });
      this.manyData = res.data;
    },
    //当预览图片
    onPicPreview(file){
        this.previewPath = file.response.data.url;
        this.picPreviewVisible = true;
    },
    //当图片被移除
    onPicRemove(file){
    //得到图片临时路径
    const filePath = file.response.data.tmp_path;
    //得到在pics数组中的下标
    let index = this.addForm.pics.findIndex(item=>{return item['pic']===filePath})
    //移除数据
    this.addForm.pics.splice(index,1);
    },
    //当图片上传成功
    onPicUploadSuccess(response){
      const picInfo = {"pic":response.data.tmp_path}
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    addGoods(){
        this.$refs.addFormRef.validate(async valid=>{
            if(!valid) {return this.$message.error("请填写必需的表单项")}

            // 处理动态参数
            this.manyData.forEach(
                item=>{const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')};
                      this.addForm.attrs.push(newInfo)
                })
            // 处理静态参数
            this.onlyData.forEach(
                item=>{const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals};
                      this.addForm.attrs.push(newInfo)
                })
                // 使用深拷贝复制addform以处理goods_cat参数,避免goods_cat转字符串之后影响到级联选择器
            let objCopy=JSON.parse(JSON.stringify(this.addForm));
            objCopy.goods_cat=objCopy.goods_cat.join(',')
            // 开始请求
           const {data:res} = await  this.$axios.post("goods",objCopy)
           if(res.meta.status!==201) {return this.$message.error("添加商品失败,请确保全部信息填写完整")}
           this.$message.success("添加商品成功！")
           this.$router.push('/goods')
        })
    }
  },
  created() {
    //更新级联选择器数据
    this.getParentCateList();
    window.addform = this.addForm;
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat[2];
    },
  },
};
</script>
<style lang="scss" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preview-img{
    width: 100%;
}
.addBtn{
    margin-top: 15px;
    float: right;
}
</style>