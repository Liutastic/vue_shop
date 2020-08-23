<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="15">
                <el-col :span="10">
                    <el-input
                            clearable
                            @clear="getOrderList"
                            v-model="queryInfo.query"
                            placeholder="请输入内容"
                            class="input-with-select">
                        <el-button
                                @click="getOrderList"
                                slot="append"
                                icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!--            表格区域-->
            <el-table
                    height="500"
                    border
                    stripe
                    :data="orderList">
                <el-table-column width="50px" label="序号" type="index"></el-table-column>
                <el-table-column width="600px" label="订单编号" prop="order_number"></el-table-column>
                <el-table-column width="90px" label="商品价格" prop="order_price"></el-table-column>
                <el-table-column width="90px" label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <!-- {{scope.row.pay_status}}-->
                        <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
                        <el-tag type="success" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="90px" label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column width="150px" label="操作">
                    <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                    <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
                </el-table-column>

            </el-table>
            <!--分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5,10,15]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <!-- 查询物流对话框 -->
        <el-dialog
                title="提示"
                :visible.sync="processDialogVisible"
                width="30%">
            <span slot="footer" class="dialog-footer">
                <el-button @click="processDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="processDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //查询列表相关参数
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                //从后台获取到的数据总
                total: 0,
                orderList: [],
                processDialogVisible: false,

            }
        },
        created() {
            this.getOrderList()
        },
        methods: {
            getOrderList() {
                this.$http.get(`orders`, {params: this.queryInfo})
                    .then(res => {
                        if (res.data.meta.status !== 200) return this.$message.error('获取订单列表失败')
                        this.$message.success('获取订单列表成功！')
                        this.total = res.data.data.total
                        this.orderList = res.data.data.goods
                        // console.log(res);
                    }).catch(err => err)
            },
            handleSizeChange(newSize) {
                // console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            handleCurrentChange(newPage) {
                console.log(newPage)
                this.queryInfo.pagepage = newPage
                this.getOrderList()
            },
            showProgressBox() {
                this.processDialogVisible = true
                this.$http.get(`/kuaidi/804909574412544580`)
                .then(res=>{
                    console.log(res);
                }).catch(err=>err)

            }
        }
    }
</script>

<style scoped>

</style>
