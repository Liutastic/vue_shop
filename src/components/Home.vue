<template>
    <div>
        <el-button type="info" @click="logout">退出登录</el-button>
    </div>
</template>

<script>
    export default {
        name: "",
        data() {
            return {
                tokenStr: window.sessionStorage.getItem('token')
            }
        },
        methods: {
            logout: function () {
                // window.sessionStorage.setItem("token", "");
                window.sessionStorage.clear();
                this.$router.push('/login')
            }
        }
    }

</script>

<style scoped lang="less">

</style>
