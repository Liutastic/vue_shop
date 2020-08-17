import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Home from "@/components/Home";

Vue.use(VueRouter)

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {path: '/home', component: Home}
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


//挂载路由导航守卫
/***
 * to 将要访问的路径
 * from 从哪个路径跳转而来
 * next 是一个函数，表示放行
 * next() 放行
 * next('/login')  强制跳转到某个URL
 */
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next(); //访问登录页直接放行

    //获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if(!tokenStr) return next('/login')
    next()
})
export default router