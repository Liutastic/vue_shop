<template>
    <div>
        <h3>欢迎登录，{{username}}! </h3>
    </div>
</template>

<script>

    export default {
        //在脚手架中要定义数据一定要使用data(){return(){}}
        data(){
            return{
                username:'',
            }
        },
        created() {
            this.username = window.sessionStorage.getItem('username')
        },
    }
</script>

<style scoped>

</style>
