<template>
    <div>
        home
        <el-button type="info" @click="loginOut()">提交</el-button>
    </div>
</template>
<script>
export default {
    name:'home',
    data(){return{}},
    methods:{
        loginOut(){
            window.sessionStorage.removeItem('token');
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="scss">
    
</style>