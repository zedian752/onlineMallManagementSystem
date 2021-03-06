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
    component: () => import(/* webpackChunkName: "login" */'../components/login.vue')
  },
  {//注意导航守卫并没有应用在跳转路由上，而仅仅应用在其目标上,所以导航守卫中的to只有welcome没有home,但不代表home不起作用
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "login" */'../components/home.vue'),
    redirect:'/welcome',
    children:[{path:'/welcome',name:'welcome',component:()=>import(/* webpackChunkName: "login" */ '../components/welcome.vue')},
              {path:'/users',name:'users',component:()=>import(/* webpackChunkName: "users" */ '../components/user/users.vue')},
              {path:'/rights',name:'rights',component:()=>import(/* webpackChunkName: "rightsAndRoles" */ '../components/authority/authorityList.vue')},
              {path:'/roles',name:'roles',component:()=>import(/* webpackChunkName: "rightsAndRoles" */ '../components/authority/rolesList.vue')},
              {path:'/categories',name:'categories',component:()=>import(/* webpackChunkName: "goodsComponents" */ '../components/goods/category.vue')},
              {path:'/params',name:'params',component:()=>import(/* webpackChunkName: "goodsComponents" */ '../components/goods/params.vue')},
              {path:'/goods',name:'goods',component:()=>import(/* webpackChunkName: "goodsComponents" */ '../components/goods/list.vue')},
              {path:'/goods/add',name:'goods-add',component:()=>import(/* webpackChunkName: "goodsComponents" */ '../components/goods/addGoods.vue')},
              {path:'/orders',name:'orders',component:()=>import('../components/order/order.vue')},
              {path:'/reports',name:'orders',component:()=>import('../components/report/report.vue')}]
  },
  {path:'/test',
    component:()=>import('../components/user/dialog/tmptest.vue')
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
  else if(to.path!=='/login'){
    if (window.sessionStorage.getItem('token')) {
      return next()
    } else {
      return next('/login')
    }
  }


})

export default router