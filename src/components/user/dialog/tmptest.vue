<template>
<div class="main" @click="test">
   
        <span>{{data}}</span>

</div>
       
</template>

<script>

export default {
    data(){return {
        test:undefined
    }},
     created(){
         this.data="100"
    },
    methods:{

    },
    watch:{
        test(newV,oldV){
            console.log(newV);
            console.log(oldV)
        }
    }
}
// a=1 b=2 当a=3 联动 b=3 当 b再次联动 ，但是数值相等
</script>