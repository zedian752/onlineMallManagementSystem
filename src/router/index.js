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
  {//注意导航守卫并没有应用在跳转路由上，而仅仅应用在其目标上,所以导航守卫中的to只有welcome没有home,但不代表home不起作用
    path: '/home',
    name: 'home',
    component: () => import('../components/home.vue'),
    redirect:'/welcome',
    children:[{path:'/welcome',name:'welcome',component:()=>import('../components/welcome.vue')},
              {path:'/users',name:'users',component:()=>import('../components/user/users.vue')},
              {path:'/rights',name:'rights',component:()=>import('../components/authority/authorityList.vue')},
              {path:'/roles',name:'roles',component:()=>import('../components/authority/rolesList.vue')},
              {path:'/categories',name:'categories',component:()=>import('../components/goods/category.vue')},
              {path:'/params',name:'params',component:()=>import('../components/goods/params.vue')},
              {path:'/goods',name:'goods',component:()=>import('../components/goods/list.vue')},
              {path:'/goods/add',name:'goods-add',component:()=>import('../components/goods/addGoods.vue')}]
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