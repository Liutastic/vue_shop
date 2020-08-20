<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--    卡片视图-->
        <el-card>
            <el-table
                    :data="rightsList"
                    stripe
                    style="width: 100%">
                <el-table-column fixed="left" label="序号" type="index"></el-table-column>
                <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
                <el-table-column prop="path" label="路径" width="180"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==0" type="info">一级</el-tag>
                        <el-tag v-if="scope.row.level==1" type="success">二级</el-tag>
                        <el-tag v-if="scope.row.level==2" type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                rightsList: []
            }
        },
        created() {
            this.getRightsList()
        },
        methods: {
            getRightsList: function () {
                this.$http.get('rights/list')
                    .then(response => {
                        if (response.data.meta.status === 200) {
                            this.rightsList = response.data.data
                        }
                    }).catch(error => error)
            }
        }
    }
</script>

<style scoped>

</style>
