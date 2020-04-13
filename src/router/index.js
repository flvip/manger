import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/components/login/login')
const Home = () => import('@/components/home/home')
const Users = () => import('@/components/users/users')
const Rights = () => import('@/components/rights/rights')
const Roles = () => import('@/components/rights/role')
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
        redirect: '/users',
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
            }
        ]
    }

]
var router = new Router({
    routes
})


export default router
