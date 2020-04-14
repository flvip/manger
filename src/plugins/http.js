
import axios from 'axios'
const myHttp = {}
myHttp.install = (Vue) => {
    //  添加实例方法
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    const AUTH_TOKEN = window.localStorage.getItem('token')
    // 在发送请求之前做些什么

    axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    axios.interceptors.request.use(function (config) {
        //console.log(config)
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });



    Vue.prototype.$http = axios


}

export default myHttp