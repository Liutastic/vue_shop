<template>
    <el-container class="home-container">
        <!--头部区域-->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>电商管理</span>
            </div>
            <el-button type="info" @click="logout">退出登录</el-button>
        </el-header>
        <el-container>
            <!--侧边栏-->

            <el-aside :width="isCollapse? '64px':'200px'">
                <!--// 切换菜单是否显示字体-->
                <div class="toggle-button" @click="toggleCollapse">| |</div>
                <!--侧边栏菜单区-->
                <el-menu
                        router
                        unique-opened
                        :default-active="activePath"
                        :collapse-transition="false"
                        :collapse="isCollapse"
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#1F67C9">
                    <!-- 一级菜单 -->
                    <el-submenu
                            :show-timeout="showTimeout"
                            :hide-timeout="hideTimeout"
                            :index="list.id+''"
                            v-for="(list, index) in menuList"
                            :key="list.id">
                        <!-- template是一级菜单的模板区-->
                        <!-- response.data.data[0].authName -->
                        <template slot="title">
                            <i :class="iconObj[index]"></i>
                            <span>{{ list.authName }}</span>
                        </template>
                        <!--二级菜单-->
                        <!--response.data.data[0].children[0].authName-->
                        <el-menu-item
                                @click="saveNavState('/'+item.path)"
                                :index="'/'+item.path"
                                v-for="item in list.children"
                                :key="item.id">
                            <!-- 二级菜单模板区-->
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ item.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--主体区-->
            <el-main>
                <!--路由占位符-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        created() {
            this.getMenuList()
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        name: "",
        data() {
            return {
                menuList: [],
                iconObj: {
                    '0': 'el-icon-user',
                    '1': 'el-icon-open',
                    '2': 'el-icon-s-shop',
                    '3': 'el-icon-s-order',
                    '4': 'el-icon-s-platform'
                },
                tokenStr: window.sessionStorage.getItem('token'),
                isCollapse: false,
                showTimeout: 0,
                hideTimeout: 0,
                activePath: '',

            }
        },
        methods: {
            logout: function () {
                // window.sessionStorage.setItem("token", "");
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            getMenuList: function () {
                this.$http.get('menus')
                    .then(response => {
                        if (response.data.meta.status !== 200)
                            return this.$message.error(response.data.meta.msg)
                        this.menuList = response.data.data
                        // console.log(this.menuList)
                    }, error => {
                        console.log(error)
                    })
            },
            toggleCollapse: function () {
                this.isCollapse = !this.isCollapse

            },
            saveNavState: function (activePath) {
                window.sessionStorage.setItem('activePath', activePath)
                this.activePath = activePath
            },
        }
    }

</script>

<style scoped lang="less">
  img {
    height: 50px;
    width: 50px;
  }

  .el-header {
    background-color: #373C41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .home-container {
    height: 100%;
  }

  .el-button {
    display: flex;
    justify-content: right;
  }

  i {
    margin-right: 20px;
  }

  .toggle-button {
    background-color: #4a5064;
    text-align: center;
    font-size: 12px;
    color: #fffdef;
    line-height: 24px;
    cursor: pointer;
  }
</style>
