<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!--el-row是搜索框和添加按钮-->
            <el-row>
                <el-col :span="8" style="margin-right: 30px">
                    <el-input
                            @clear="getGoodList"
                            v-model="queryInfo.query"
                            clearable
                            placeholder="请输入内容"
                            class="input-with-select">
                        <el-button
                                @click="getGoodList"
                                slot="append"
                                icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table
                    height="500"
                    border
                    stripe
                    :data="goodList">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column width="500px" label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column width="250px" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <el-button @click="removeGoodById(scope.row.goods_id)" size="mini" type="danger"
                                   icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--表格分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

    </div>

</template>

<script>
    export default {
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10,
                },
                total: 0,
                //商品列表
                goodList: [],
            }
        },
        created() {
            this.getGoodList()
        },
        methods: {
            getGoodList(newSize) {
                this.$http.get('goods', {params: this.queryInfo})
                    .then(res => {
                        console.log(res)
                        if (res.data.meta.status !== 200) return this.$message.error('获取商品列表失败')
                        this.goodList = res.data.data.goods
                        this.total = res.data.data.total
                        this.$message.success('获取商品列表成功')
                    }).catch(err => err)
            },
            handleSizeChange() {
                this.queryInfo.pagesize = newSize
                this.getGoodList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getGoodList()
            },
            removeGoodById(goodId) {
                this.$confirm('此操作会导致永久删除该用户，是否继续？', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(`goods/${goodId}`)
                        .then(res => {
                            if (res.data.meta.status !== 200) return this.$message.error('删除失败哦')
                            this.$message.success('删除成功')
                            this.getGoodList()
                        }).catch(err => err)
                }).catch(() => {
                    this.$message.info('我在放屁')
                })
            },
            goAddPage(){
                this.$router.push(`goods/add`)
            }
        }
    }
</script>

<style scoped lang="less">
  .el-table {
    font-size: small;
  }
</style>
