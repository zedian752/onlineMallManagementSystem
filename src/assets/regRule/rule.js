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
    username:[{required:true,message:"请输入用户名",trigger:'blur'},
    {min:3,max:10,message:'请输入长度为3~10位以内的用户名',trigger:'blur'}],

    password:[{required:true,message:"请输入密码",trigger:'blur'},
    {min:6,max:15,message:'请输入长度为6~15位以内的密码',trigger:'blur'}],
    
    email:[{required:true,message:"请输入邮箱",trigger:'blur'},
    {validator:checkEmail,trigger:'blur'}],
    
    mobile:[{required:true,message:"请输入手机号码",trigger:'blur',trigger:'blur'},
    {validator:checkMobile,trigger:'blur'}]
}
