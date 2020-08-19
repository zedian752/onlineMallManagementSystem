<template>
<div class="main">
    <el-button type="primary" @click="fatherPropIsVisible=!fatherPropIsVisible">test</el-button>
     <adduserdialog :propIsVisible.sync="fatherPropIsVisible" ></adduserdialog>
      <!-- @update:propIsVisible="val=>fatherPropIsVisible=val" -->
</div>
       

</template>


<script>
import adduserdialog from './addUserDialog'
export default {
    data(){return {
        fatherPropIsVisible:false
    }},
    components:{
        adduserdialog
    },
    methods:{
        update(a){
            this.fatherPropIsVisible=a;
        }
    },
    watch:{
        fatherPropIsVisible(newValue){
            console.log("fatherProp"+newValue)
        }
    }
}
</script>