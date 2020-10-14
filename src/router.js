import Vue from 'vue'
import VueRouter from 'vue-router'
import History from '@/libs/history';
Vue.use(VueRouter)
Vue.use(History);


import home from '@/components/home.vue'
import list from '@/components/list.vue'
import me from '@/components/me.vue'
import hIntroduction from '@/components/hIntroduction.vue'
import article from '@/components/article.vue'
import moreList from '@/components/moreList.vue'
import articleList from '@/components/articleList.vue'
import aboutMe from '@/components/aboutMe.vue'
import packageDetails from '@/components/packageDetails.vue'
import apply0 from '@/components/apply0.vue'
import infoCard from '@/components/infoCard.vue'
import orderList from '@/components/orderList.vue'
import order from '@/components/order.vue'
import apply1 from '@/components/apply1.vue'
import apply2 from '@/components/apply2.vue'
import apply3 from '@/components/apply3.vue'
import focusHospital from '@/components/focusHospital.vue'
import lookCard from '@/components/lookCard.vue'
import next from '@/components/next.vue'
import examHospital from '@/components/examHospital.vue'



const routes = [{
    path: '/',
    component: home,
    name:'home'
  },
  {
    path: '/list',
    component: list,
    name:'list'
  },
  {
    path: '/me',
    component: me,
    name:'me'
  },
  {
    path: '/hIntroduction',
    component: hIntroduction,
    name: 'hIntroduction'
  },
  {
    path: 'packageDetails',
    component: packageDetails,
    name:'packageDetails'
  },
  {
    path: '/article',
    component: article,
    name: 'article'
  },
  {
    path: '/moreList',
    component: moreList,
    name: 'moreList'
  },
  {
    path: '/articleList',
    component: articleList,
    name: 'articleList'
  },
  {
    path: '/aboutMe',
    component: aboutMe,
    name: 'aboutMe'
  },
  {
    path: '/apply0',
    component: apply0,
    name: 'apply0'
  },
  {
    path:'/infoCard',
    component: infoCard,
    name: 'infoCard'
  },
  {
    path:'/orderList',
    component:orderList,
    name:'orderList'
  },
  {
    path:'/order',
    component:order,
    name:'order'
  },
  {
    path:'/apply1',
    component:apply1,
    name:'apply1'
  },
  {
    path:'/apply2',
    component:apply2,
    name:'apply2'
  },
  {
    path:'/apply3',
    component:apply3,
    name:'apply3'
  },
  {
    path:'/focusHospital',
    component:focusHospital,
    name:'focusHospital'
  },
  {
    path:'/lookCard',
    component:lookCard,
    name:'lookCard'
  },
  {
    path:'/next',
    component:next,
    name:'next'
  },
  {
    path:'/examHospital',
    component:examHospital,
    name:'examHospital'
  },
]
VueRouter.prototype.goBack = function (i) {
  this.isBack = true;
}

// 实例化路由对象
const router = new VueRouter({
  // 让ur更加美观
  mode: 'history',
  routes
})

//路由守卫
router.afterEach((to, from) => {
  if (router.isBack) {
    // 后退
    History.pop(from);
    router.isBack = false;
    router.transitionName = 'route-back';
  } else {
    History.push(to.path,from.params,from.name);
    router.transitionName = 'route-forward';
  }
})
// 暴露出去
export default router
