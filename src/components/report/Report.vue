<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div id="main" style="width: 600px; height: 400px">

            </div>
        </el-card>
    </div>
</template>

<script>
    // 导入echarts
    import echarts from 'echarts'
    import _ from 'lodash'

    export default {
        data() {
            return {
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
            }
        },
        created() {
        },
        // 此时，dom元素已经渲染完毕
        mounted() {
            var myChart = echarts.init(document.getElementById('main'))

            this.$http.get(`reports/type/1`).then(res => {
                if (res.data.meta.status !== 200) this.$message.error('获取折线图数据失败wdnmd')
                // myChart.setOption(res.data.data)
                const result = _.merge(res.data.data, this.options)
                myChart.setOption(result)
            }).catch(err => err)


        },
        methods: {},
    }
</script>

<style scoped>

</style>
