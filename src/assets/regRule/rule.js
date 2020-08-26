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



export default {
    // 用户名
    username:[{required:true,message:"请输入用户名",trigger:'blur'},
    {min:3,max:10,message:'请输入长度为3~10位以内的用户名',trigger:'blur'}],
    // 密码
    password:[{required:true,message:"请输入密码",trigger:'blur'},
    {min:6,max:15,message:'请输入长度为6~15位以内的密码',trigger:'blur'}],
    // 邮箱
    email:[{required:true,message:"请输入邮箱",trigger:'blur'},
    {validator:checkEmail,trigger:'blur'}],
    // 手机
    mobile:[{required:true,message:"请输入手机号码",trigger:'blur'},
    {validator:checkMobile,trigger:'blur'}],
    // 商品名称
    goods_name:[{required:true,message:"请输入商品名称",trigger:'blur'}],
    // 商品价格
    goods_price:[{required:true,message:"请输入商品价格",trigger:'blur'}],
    // 商品数目
    goods_number:[{required:true,message:"请输入商品数目",trigger:'blur'}],
    // 商品重量
    goods_weight:[{required:true,message:"请输入商品重量",trigger:'blur'}],
    // 商品分类
    goods_cat:[{required:true,message:"请选择商品分类",trigger:'blur'}],


}
