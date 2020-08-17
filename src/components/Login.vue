<template>
    <div class="login_container">
        <div class="login_box">
            <!--头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!--登录表单区域-->
            <!--v-bind表示单向绑定数据，给标签设置属性-->
            <el-form ref="loginFormRef" v-bind:model="loginForm" v-bind:rules="loginFormRules" label-width="0px"
                     class="login_form">
                <!-- 用户名-->
                <el-form-item prop="username">
                    <el-input type="text" placeholder="请输入用户名" v-model="loginForm.username"
                              prefix-icon="el-icon-s-custom"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"
                              prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <!--按钮区-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login" @keyup.enter="login">Log in</el-button>
                    <el-button type="info" @click="resetLoginForm">reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loginForm: {
                    username: "admin",
                    password: "123456"
                },
                //表单验证规则对象
                loginFormRules: {
                    username: [
                        {required: true, message: "username is required", trigger: "blur"}
                    ],
                    password: [
                        {required: true, massage: "请输入密码", trigger: "blur"},
                        {min: 6, max: 16, massage: "密码长度在6到16之间", trigger: "blur"}
                    ]
                }
            }
        },
        methods: {
            resetLoginForm: function () {
                // console.log(this)
                this.$refs.loginFormRef.resetFields();
                this.loginForm.username = "";
                this.loginForm.password = "";
            },
            login: function () {
                // 箭头匿名函数省略了函数名，并且该函数声明定义之后直接执行
                /*
                 * async会把其后的函数表达式的返回值封装成一个promise对象，
                 * 然后await会等待这个promise完成，并且把resolve的结果返回
                 */
                this.$refs.loginFormRef.validate(async (valid) => {
                    if (!valid) return;
                    /**
                     *
                     * @type {Promise<AxiosResponse<any>>}
                     */
                    // //在main.js已经配置了baseURL，所以这里写login表示拼接在baseURL后
                    // //await 表示后面的方法要等待一个async表达式完成后才执行
                    // const result = await this.$http.post('login', this.loginForm);
                    // console.log(result);
                    //也可以使用下面的方法请求
                    // 此处then实参如果使用function，那么this指代的将不是整个vue对象，而是function本身，所以this.message失效，也是使用var that的原因
                    this.$http.post('login', this.loginForm)
                        .then(response => {
                            if (response.data.meta.status != 200) {
                                this.$message.warning("登录失败了 闸总");
                            } else {
                                // console.log(response.data.data.token);
                                this.$message.success("登录成功 wdnmd");
                                window.sessionStorage.setItem("token", response.data.data.token);
                                this.$router.push('/home')
                            }
                        }, error => {
                            console.log(error);
                        })

                });
            }
        }
    }
</script>

<style scoped lang="less">
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 2px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
