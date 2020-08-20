<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--搜索-->
            <div style="margin-top: 15px;">
                <el-row :gutter="15">
                    <el-col :span="10">
                        <el-input
                                clearable
                                @clear="getUserList"
                                v-model="queryInfo.query"
                                placeholder="请输入内容"
                                class="input-with-select">
                            <el-button
                                    @click="getUserList"
                                    slot="append"
                                    icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                    </el-col>
                </el-row>
                <!--用户列表区-->
                <el-table
                        height="500"
                        border
                        stripe
                        :data="userList">
                    <el-table-column type="index" label="序号" fixed="left"></el-table-column>
                    <el-table-column label="姓名" prop="username"></el-table-column>
                    <el-table-column label="邮箱" prop="email"></el-table-column>
                    <el-table-column label="电话" prop="mobile"></el-table-column>
                    <el-table-column label="角色" prop="role_name"></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <el-switch
                                    @change="userStateChanged(scope.row)"
                                    v-model="scope.row.mg_state"
                                    active-color="#13ce66"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200px">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" content="修改用户" placement="top" :enterable="false">
                                <el-button size="mini" type="primary" icon="el-icon-edit"
                                           @click="updateUser(scope.row.id)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                           @click="removeUserById(scope.row.id)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="分配角色" pterable="false">
                                <el-button @click="setRole(scope.row)" size="mini" type="warning" icon="el-icon-user"></el-button>
                            </el-tooltip>

                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pagenum"
                        :page-sizes="[1, 2, 5, 10]"
                        :page-size="queryInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>

            <!--添加用户对话框-->
            <el-dialog
                    @close="addDialogClosed"
                    title="添加用户"
                    :visible.sync="addDialogVisible"
                    width="30%">
                <el-form
                        :model="addForm"
                        :rules="addFormRules"
                        ref="addFormRef">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!--底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改用户对话框 -->
            <el-dialog
                    @close="updateDialogClosed"
                    title="修改用户"
                    :visible.sync="updateDialogVisible">
                <el-form
                        :model="updateForm"
                        :rules="updateFormRules"
                        ref="updateFormRef">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="updateForm.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="updateForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="updateForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="updateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateUserInfo">确 定</el-button>
                </span>
            </el-dialog>
            //用户分配权限对话框
            <el-dialog
                    title="分配角色"
                    :visible.sync="setRoleDialogVisible"
                    width="50%">
                <div>
                    <p>当前用户为：{{userInfo.username}}</p>
                    <p>当前用户角色为：{{userInfo.role_name}}</p>
                    <p>重新分配角色为：
                        <el-select v-model="selectedRoleId" placeholder="请选择">
                            <el-option
                                    v-for="item in rolesList"
                                    :key="item.id"
                                    :label="item.roleName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @close="setRoleDialogClosed" @click="setRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setRoleofUser">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            var checkEmail = (rule, value, cb) => {
                //邮箱正则
                const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                if (regEmail.test(value)) {
                    return cb()
                }
                cb(new Error("邮箱不正确"))
            }
            var checkMobile = (rule, value, cb) => {
                const regMobile = /^1[3-9]\d{9}$/
                if (regMobile.test(value)) {
                    return cb()
                }
                cb(new Error("手机不正确"))
            }
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 3,
                },
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                updateForm: {},
                addFormRules: {
                    username: [
                        {required: true, trigger: 'blur'},
                        {min: 3, max: 10, trigger: 'blur'}
                    ],
                    password: [
                        {require: true, trigger: 'blur'},
                        {min: 6, max: 16, trigger: 'blur'},
                    ],
                    email: [
                        {require: true, trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}

                    ],
                    mobile: [
                        {require: true, trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
                updateFormRules: {
                    email: [
                        {require: true, trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}

                    ],
                    mobile: [
                        {require: true, trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
                // 控制添加用户对话框的显示或者隐cang
                addDialogVisible: false,
                updateDialogVisible: false,
                setRoleDialogVisible: false,
                userList: [],
                userInfo:[],
                //所有角色的数据列表
                rolesList:[],
                //已选中的角色值
                selectedRoleId:'',
                total: 0
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            getUserList: function () {
                this.$http.get('users', {params: this.queryInfo})
                    .then(response => {
                        // console.log(response);
                        if (response.data.meta.status !== 200) return this.$message.error('数据获取失败')
                        this.userList = response.data.data.users
                        this.total = response.data.data.total
                        // console.log(this.userList)
                        // console.log(this.total)
                    }, error => {
                        // console.log(error);
                    })
            },
            // 一页展示多少行
            handleSizeChange: function (newSize) {
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },

            //监听页码值改变的事件
            handleCurrentChange: function (newPage) {
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            //监听switch
            userStateChanged: function (userInfo) {
                console.log(userInfo)
                this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                    .then(response => {
                        if (response.data.meta.status !== 200) {
                            userInfo.ma_stete = !userInfo.mg_state
                            return this.$message.error('设置失败了啊！')
                        }
                        this.$message.success('更新成功了 sd！')
                    }, error => {

                    })
            },
            // 添加用户
            addUser: function () {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) {
                        return this.$message.warning('能不能认真填完啊 我佛了')
                    }
                    this.$http.post('users', this.addForm)
                        .then(response => {
                            // console.log(response)
                            if (response.data.meta.status !== 201) {
                                return this.$message.error('闸总 创建失败了')
                            }
                            this.$message.success('创建成功了！')
                            this.addDialogVisible = false
                            this.getUserList()
                        }, error => {
                            console.log(error);
                        })
                })

            },
            //监听添加用户对话框的关闭
            addDialogClosed: function () {
                this.$refs.addFormRef.resetFields()
            },
            //重置修改用户信息对话框
            updateDialogClosed: function () {
                this.$refs.updateFormRef.resetFields()
            },

            // 查询要修改的用户的信息  get 名字写歪了
            updateUser: function (userId) {
                // console.log(userId);
                this.updateDialogVisible = true;
                this.$http.get(`/users/${userId}`)
                    .then(response => {
                        // console.log(response);
                        if (response.data.meta.status !== 200) {
                            return
                        }
                        this.updateForm = response.data.data
                    }, error => {
                        console.log(error);
                    })
            },
            // 修改用户信息！!!!!
            updateUserInfo: function () {
                this.$refs.updateFormRef.validate(valid => {
                    if (!valid) return
                    this.$http.put(`users/${this.updateForm.id}`,
                        {
                            email: this.updateForm.email,
                            mobile: this.updateForm.mobile
                        }).then(response => {
                        if (response.data.meta.status !== 200) {
                            return this.$message.error('error')
                        }
                        this.$message.success('成功')
                        this.updateDialogVisible = false
                        this.getUserList
                    }, error => {
                        console.log(error);
                    })
                })
            },
            //根据id删除对应的用户信息
            removeUserById: function (userId) {
                // console.log(userId);
                const confirmResult = this.$confirm('此操作会导致永久删除该用户，是否继续？', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(userId);
                    this.$http.delete('users/'+userId)
                        .then(response => {
                            if(response.data.meta.status !== 200) return console.log(response)
                            this.$message.success('删除成功')
                            this.getUserList()
                        }).catch(error => {
                            console.log(error)
                    })
                }).catch(() => {
                    this.$message.info('取消删除')
                })
            },

            setRole:function (userInfo) {
                this.userInfo = userInfo
                this.$http.get(`roles`)
                .then(response=>{
                    if(response.data.meta.status !== 200) return this.$message.error('获取角色列表失败！')
                    this.rolesList = response.data.data
                }).catch(error=>error)
                this.setRoleDialogVisible = true
            },
            setRoleofUser:function () {
                if(!this.selectedRoleId){
                    return this.$message.error('请选择要分配的角色')
                }
                console.log(this.userInfo.id) // 用户ID
                console.log(this.rolesList)
                this.$http.put(`users/${this.userInfo.id}/role`,
                    {rid: this.selectedRoleId})
                .then(response=>{
                    if(response.data.meta.status !== 200) return this.$message.erroe('设置失败 ')
                    this.$message.success('设置角色成功')
                    this.getUserList()
                    this.setRoleDialogVisible = false
                }).catch(error=>error)
            },
            setRoleDialogClosed:function(){
                this.selectedRoleId = ''
                this.userInfo = {}
            }

        }
    }
</script>

<style scoped lang="less">


</style>
