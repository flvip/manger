import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui';
const Login = () => import('@/components/login/login')
const Home = () => import('@/components/home/home')
const Users = () => import('@/components/users/users')
const Rights = () => import('@/components/rights/rights')
const Role = () => import('@/components/rights/role')
const Goods = () => import('@/components/goods/goods')
Vue.use(Router)

var routes = [
    {
        name: 'login',
        path: '/login',
        component: Login
    },
    {
        name: 'home',
        path: '/',
        component: Home,
        children: [
            {
                name: 'users',
                path: 'users',
                component: Users
            },
            {
                name: 'Rights',
                path: 'rights',
                component: Rights
            }, {
                name: 'Role',
                path: 'roles',
                component: Role
            }, {
                name: 'Goods',
                path: 'goods',
                component: Goods
            }
        ]
    }

]
var router = new Router({
    routes
})
//全局路由守卫
router.beforeEach((to, from, next) => {
    //访问登录页，放行
    if (to.path === '/login') return next()
    // 获取token
    const tokenStr = window.localStorage.getItem('token')

    // 没有token, 强制跳转到登录页
    if (!tokenStr) {
        Message.warning('请登录后操作！')
        router.push({
            name: 'login'})
        }
    return next()
    
    
})

export default router