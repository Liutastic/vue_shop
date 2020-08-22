<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-tag type="warning">注意，只允许为第三极分类设置相关参数</el-tag>
            <el-row>
                <el-col>
                    <div>选择商品分类：
                        <el-cascader
                                clearable
                                :props="cateProps"
                                v-model="selectedCateKeys"
                                :options="cateList"
                                @change="parentCateHandleChanged"></el-cascader>
                    </div>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button @click="addDialogVisible = true" type="primary" :disabled="isBtnisabled">添加参数</el-button>
                    <!--动态表格参数-->
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="index" label="序号" fixed="left"></el-table-column>
                        <el-table-column type="expand" fixed="left"></el-table-column>
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="showEditDialog(scope.row.attr_id)" size="mini" type="primary"
                                           icon="el-icon-edit">编辑
                                </el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button @click="addDialogVisible = true" type="primary" :disabled="isBtnisabled">添加属性</el-button>
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="index" label="序号" fixed="left"></el-table-column>
                        <el-table-column type="expand" fixed="left"></el-table-column>
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="showEditDialog(scope.row.attr_id)" size="mini" type="primary"
                                           icon="el-icon-edit">编辑
                                </el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!--添加参数的对话框-->
        <el-dialog
                @close="addFormClosed"
                :title="'添加'+titleText"
                :visible.sync="addDialogVisible"
                width="30%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                @close="editFormClosed"
                :title="'添加'+titleText"
                :visible.sync="editDialogVisible"
                width="30%">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeName: 'many',
                cateList: [],
                cateProps: {
                    checkStrictly: true,
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                manyTableData: [],
                onlyTableData: [],
                selectedCateKeys: [],
                //表单验证
                addFormRules: {
                    attr_name: [
                        {required: true, trigger: 'blur'}
                    ]
                },
                editFormRules: {
                    attr_name: [
                        {required: true, trigger: 'blur'}
                    ]
                },
                addForm: {
                    attr_name: '',
                },
                editForm: {},
                //控制对话框的显示与隐藏
                addDialogVisible: false,
                editDialogVisible: false,
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            //tab标签
            handleTabsClick() {
                this.getParamsData()
                // console.log(this.activeName)
            },
            parentCateHandleChanged() {
                this.getParamsData()
            },
            getCateList() {
                this.$http.get('categories')
                    .then(res => {
                        if (res.data.meta.status !== 200) return this.$message.error('获取分类列表失败')
                        this.cateList = res.data.data
                    }).catch(err => err)
            },
            getParamsData() {
                // 只允许用户选择第三极分类
                if (this.selectedCateKeys.length !== 3) {
                    this.selectedCateKeys = []
                    return
                }
                this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
                    .then(res => {
                        if (res.data.meta.status !== 200) return this.$message.error('获取失败')
                        // console.log(res.data.data)
                        if (this.activeName === 'many') {
                            this.manyTableData = res.data.data
                        } else {
                            this.onlyTableData = res.data.data
                        }
                    }).catch(error => error)
            },
            addFormClosed() {
                this.$refs.addFormRef.resetFields()
            },
            //点击按钮添加参数
            addParams() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) return
                    this.$http.post(`categories/${this.cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })
                        .then(res => {
                            if (res.data.meta.status !== 201) return this.$message.error('添加参数失败')
                            this.$message.success('添加参数成功！')
                            this.addDialogVisible = false
                            this.getParamsData()
                        }).catch(error => error)
                })
            },
            //表格中编辑相关参数
            showEditDialog(attr_id) {
                this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
                    {params: {attr_sel: this.activeName}})
                    .then(res => {
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('获取失败')
                        }
                        this.editForm = res.data.data
                    }).catch(err => err)
                this.editDialogVisible = true
            },
            editFormClosed() {
                this.$refs.editFormRef.resetFields()
            },
            editParams() {
                this.$refs.editFormRef.validate(valid => {
                    if (!valid) return
                    this.$http.put(`categories/${this.cateId}
                    /attributes/${this.editForm.attr_id}`,
                        {attr_name: this.editForm.attr_name, attr_sel: this.activeName})
                        .then(res => {
                            // console.log(this.editForm.attr_id)
                            // console.log(res);
                            if(res.data.meta.status!==200) return this.$message.error('修改参数失败')
                            this.$message.success('修改成功')
                            this.getParamsData()
                            this.editDialogVisible = false
                        }).catch(err => err)
                })
            },


        },
        computed: {
            isBtnisabled() {
                if (this.selectedCateKeys.length !== 3) {
                    return true
                }
                return false
            },
            cateId() {
                if (this.selectedCateKeys.length === 3)
                    return this.selectedCateKeys[2]
                return null
            },
            //动态选择激活对话框标题
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                }
                return '静态属性'
            }
        }
    }
</script>

<style scoped lang="less">
  .el-tag {
    margin-bottom: 20px;
  }

  .el-cascader__warp {
    height: 300px !important;
  }
</style>
