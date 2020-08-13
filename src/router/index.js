import Vue from 'vue'
import VueRouter from 'vue-router'



Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../components/home.vue')
  }


]

const router = new VueRouter({
  routes
})
//设置导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next();
  }
  if (to.path === '/home') {
    if (window.sessionStorage.getItem('token')) {
      return next()
    } else {
      return next('/login')
    }
  }

})

export default router