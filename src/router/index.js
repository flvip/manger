import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/components/login/login')
const Home = () => import('@/components/home/home')
const Users = () => import('@/components/users/users')
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
            }
        ]
    }

]
var router = new Router({
    routes
})


export default router