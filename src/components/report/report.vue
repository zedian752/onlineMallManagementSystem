<template>
    <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
            <div id="chart" style="width:800px;height:400px;"></div>


    </el-card>
    </div>
</template>

<script>

import echarts from 'echarts'
export default {
    data(){return {
        // 表单数据
        chartData:{},
        // 表单options
        options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }},
    async mounted(){
            
            await this.getReport();
           let myChart = echarts.init(document.getElementById("chart"));
        //  对图表数据选项进行修改
        const data = Object.assign(this.options,this.chartData)
        // 填入表图数据
            // myChart.setOption(this.chartData)
            myChart.setOption(data)
    },
    methods:{
        async getReport(){
        const {data:res} = await this.$axios.get('reports/type/1');
        if(res.meta.status!==200){return this.$message.error("获取折线图数据失败")}
        this.chartData=res.data;
        }

    }
}
</script>