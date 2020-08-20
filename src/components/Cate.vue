<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片式图-->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!--表格-->
            <tree-table
                    class="treeTable"
                    border
                    :show-index="true"
                    :expand-type="false"
                    :selection-type="false"
                    :columns="columns"
                    :data="cateList">
                <!--                是否有效-->
                <template slot="isok" slot-scope="scope">
                    <i
                            style="color: lightgreen"
                            v-if="scope.row.cat_deleted === false"
                            class="el-icon-success"></i>
                    <i style="color: red" v-else class="el-icon-error"></i>
                </template>
                <!--等级-->
                <template slot="order" slot-scope="scope">
                    <el-tag type="info" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="medium" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" size="small" v-else-if="scope.row.cat_level===2">三级</el-tag>
                </template>
                <!--操作-->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[3, 5, 10, 15]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--添加分类对话框-->
        <el-dialog
                @close="addCateDialogClosed"
                title="添加分类"
                :visible.sync="addCateDialogVisible"
                width="50%">

            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.name"></el-input>
                </el-form-item>
                <el-form-item label="父及分类：">
                    <el-cascader
                            change-on-select
                            clearable
                            size="mini"
                            :props="cascaderProps"
                            v-model="selectedKeys"
                            :options="parentCateList"
                            @change="parentCateChanged"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 查询条件
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                //添加分类的表单数据对象
                addCateForm: {
                    cat_name: '',
                    cat_pid: 0,
                    cat_level: 0
                },
                addCateFormRules: {
                    cat_name: [
                        {required: true, trigger: 'blur'},
                    ],
                },
                // 选择器选中的
                selectedKeys: [],

                cascaderProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                total: 0,
                // 控制添加分类对话框的显示和隐藏
                addCateDialogVisible: false,
                cateList: [],
                //父级分类的列表
                parentCateList: [],
                //table的col
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name'
                    },
                    {
                        label: '是否有效',
                        type: 'template',
                        template: 'isok'
                    },
                    {
                        label: '排序',
                        type: 'template',
                        template: 'order'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'opt'
                    }
                ]
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            getCateList() {
                this.$http.get('categories', {params: this.queryInfo})
                    .then(res => {
                        // console.log(res);
                        if (res.data.meta.status !== 200) return this.$message.error('获取商品分类失败')
                        this.cateList = res.data.data.result
                        this.total = res.data.data.total
                        // console.log(this.cateList);
                        this.$message.success('获取商品分类成功')
                    }).catch(error => error)
            },
            //Page相关参数
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },
            // 点击按钮出现添加分类对话框
            showAddCateDialog() {
                this.getParentCateList()
                this.addCateDialogVisible = true
            },
            getParentCateList() {
                this.$http.get('categories', {param: {type: 1}})
                    .then(res => {
                        if (res.data.meta.status !== 200) return this.$message.error('失败')
                        // console.log(res)
                        this.parentCateList = res.data.data
                    }).catch(err => err)
            },
            //选择项发生变化触发该函数
            parentCateChanged() {
                if(this.selectedKeys.length > 0){
                    //父级分类的id
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                    this.addCateForm.cat_level = this.selectedKeys.length
                    return
                }else{
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }
            },
            addCate(){
                console.log(this.addCateForm)
                this.addCateDialogVisible = false
            },
            //监听对话框关闭
            addCateDialogClosed(){
                this.selectedKeys = []
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
                this.$refs.addCateFormRef.resetFields()
            }
        },

    }
</script>

<style scoped lang="less">
  .treeTable {
    margin-top: 15px;
  }
  .el-dialog{
    box-sizing: border-box;
    height: 50px !important;
  }
</style>
