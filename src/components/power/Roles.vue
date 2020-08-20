<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
            <el-table
                    :data="rolesList"
                    border
                    stripe
                    style="width: 100%">
                <el-table-column fixed="left" type="expand" label="">
                    <template slot-scope="scope">
                        <el-row
                                :class="['bdbottom', index1===0? 'bdtop': '', 'vcenter']"
                                v-for="(item1, index1) in scope.row.children"
                                :key="item1.id">
                            <!--1级权限-->
                            <el-col :span="5">
                                <el-tag @close="removeRightById(scope.row, item1.id)" closable>{{
                                        item1.authName
                                    }}
                                </el-tag>
                                <i class="el-icon-right"></i>
                            </el-col>
                            <!--2,3级权限-->
                            <el-col :span="19">
                                <el-row
                                        :class="[index2===0? '' : 'bdtop', 'vcenter']"
                                        v-for="(item2, index2) in item1.children"
                                        :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag @close="removeRightById(scope.row, item2.id)" closable type="success">
                                            {{ item2.authName }}
                                        </el-tag>
                                        <i class="el-icon-right"></i>
                                    </el-col>

                                    <el-col :span="18">
                                        <el-tag @close="removeRightById(scope.row, item3.id)" closable type="warning"
                                                v-for="(item3, index3) in item2.children" :key="item3.id">
                                            {{ item3.authName }}
                                        </el-tag>
                                    </el-col>

                                </el-row>
                            </el-col>
                        </el-row>
                        <!--<pre>{{ scope.row }}</pre>-->
                    </template>
                </el-table-column>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row.id)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                                   @click="deleteRoleById(scope.row.id)">删除
                        </el-button>
                        <el-button
                                size="mini"
                                type="warning"
                                icon="el-icon-user"
                                @click="showSetRightDialog(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--添加角色-->
        <el-dialog
                @close="addRoleDialogClosed"
                title="添加角色"
                :visible.sync="addRoleDialogVisible">
            <el-form
                    :model="addRoleForm"
                    :rules="addRoleRules"
                    ref="addRoleFormRef">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改角色-->
        <el-dialog
                title="修改角色"
                :visible.sync="editRoleDialogVisible">
            <el-form
                    :model="roleInfo"
                    :rules="addRoleRules"
                    ref="editRoleFormRef">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleInfo.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="roleInfo.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoleInfo">确 定</el-button>
            </span>
        </el-dialog>

        <!--分配权限-->
        <el-dialog
                @close="setRightDialogClosed"
                title="分配权限"
                :visible.sync="setRightDialogVisible"
                width="30%">
            <el-tree
                    ref="treeRef"
                    default-expand-all
                    node-key="id"
                    show-checkbox
                    :default-checked-keys="defKeys"
                    :data="rightsList"
                    :props="treeProps"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                rolesList: [],
                rightsList: [],
                defKeys: [],
                addRoleForm: {},
                addRoleRules: {
                    roleName: [
                        {require: true, trigger: 'blur'},
                        {min: 3, max: 10, trigger: 'blur'}
                    ],
                    roleDesc: [
                        {min: 0, max: 50, trigger: 'blur'}
                    ]
                },
                roleInfo: {},
                // 权限树属性绑定对象
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                addRoleDialogVisible: false,
                editRoleDialogVisible: false,
                setRightDialogVisible: false,
                //当前即将分配权限的角色ID
                roleId: '',


            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            getRolesList: function () {
                this.$http.get('roles')
                    .then(response => {
                        // console.log(response)
                        if (response.data.meta.status !== 200)
                            return this.$message.error('获取角色列表失败')
                        this.rolesList = response.data.data
                        // console.log(this.rolesList)
                    }).catch(error => error)
            },
            addRoleDialogClosed: function () {
                this.$refs.addRoleFormRef.resetFields()
            },
            addRole: function () {
                this.$http.post(`roles`, this.addRoleForm)
                    .then(response => {
                        console.log(response)
                        if (response.data.meta.status !== 201) return this.$message.error('创建失败')
                        this.$message.success('创建角色成功')
                        addDialogVisible = false
                        this.getRolesList()
                    }).catch(error => error)
            },
            editRole: function (roleId) {
                this.editRoleDialogVisible = true
                this.$http.get(`roles/${roleId}`)
                    .then(response => {
                        if (response.data.meta.status !== 200) return
                        this.roleInfo = response.data.data
                        // console.log(this.roleInfo);
                    }).catch(error => error)
            },
            // 修改角色信息
            editRoleInfo: function () {
                this.$http.put(`roles/${this.roleInfo.roleId}`, this.roleInfo)
                    .then(response => {
                        if (response.data.meta.status !== 200) return this.$message.error('dnmd修改失败')
                        this.$message.success('修改角色成功了嗷 ')
                        this.editRoleDialogVisible = false
                        this.getRolesList()

                    }).catch(error => error)
            },
            // 删除角色 阿巴阿巴阿巴
            deleteRoleById: function (roleId) {
                // console.log(roleId);
                const confirmResult = this.$confirm('此操作会导致永久删除该角色，是否继续？', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(`roles/${roleId}`)
                        .then(response => {
                            if (response.data.meta.status !== 200) return this.$message.error('删除失败')
                            this.$message.success('删除成')
                            this.getRolesList()
                        }).catch(error => error)
                }).catch(error => error)
            },
            //弹框提示用户是否删除
            removeRightById: function (role, rightsId) {
                const confirmResult = this.$confirm('此操作会导致永久删除该权限，是否继续？', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
                        .then(response => {
                            // console.log(response);
                            if (response.data.meta.status !== 200) return this.$message.error('删除失败')
                            this.$message.success('删除成')
                            // this.getRolesList()
                            role.children = response.data.data
                        }).catch(error => error)
                }).catch(error => error)
            },
            showSetRightDialog: function (role) {
                this.roleId = role.id
                this.$http.get(`rights/tree`)
                    .then(response => {
                        if (response.data.meta.status !== 200) return this.$message.error('获取失败')
                        // 保存到data中
                        this.rightsList = response.data.data
                        this.getLeafKeys(role, this.defKeys)
                        // console.log(this.rightsList);
                    }).catch(error => error)
                this.setRightDialogVisible = true
            },
            // 获取角色下三级权限ID并且保存到defKeys下
            getLeafKeys: function (node, arr) {
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item =>
                    this.getLeafKeys(item, arr))
            },
            //监听关闭分配权限对话框的数组事件
            setRightDialogClosed: function () {
                this.defKeys = []
            },
            //分配权限
            allotRights: function () {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const idStr = keys.join(',')
                this.$http.post(`roles/${this.roleId}/rights`,
                    {rids: idStr})
                    .then(response => {
                        if (response.data.meta.status !== 200) return this.$message.error('分配权限失败哦')
                        this.$message.success('分配权限成功！')
                        this.getRolesList()
                        this.setRightDialogVisible = false
                    }).catch(error => error)
            }
        },
    }
</script>

<style scoped lang="less">
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
