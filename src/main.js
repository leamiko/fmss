// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import App from './App'
import router from './router'
import axios from 'axios'
// import Mock from './mock'
// Mock.bootstrap()

Vue.config.productionTip = false

Vue.use(ElementUI)
// 验证登录的校验
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.removeItem('token')
  }
  let token = sessionStorage.getItem('token')
  if (!token && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})
// http请求拦截期，在头部加上token
axios.interceptors.request.use(function (config) { // 这里的config包含每次请求的内容
  let token = sessionStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (err) {
  return Promise.reject(err)
})
// http响应拦截器，403，401返回登录页
axios.interceptors.response.use(function (data) {
  return data
}, function (err) {
  if (err.response) {
    let status = err.response.status
    let path = err.response.data.path
    if (err.response.data.path && !path.startsWith('/auth') && (status === 401 || status === 403)) {
      router.push({ path: '/login' })
    } else {
      return Promise.reject(err)
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
