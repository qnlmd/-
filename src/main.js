import Vue from 'vue'
import App from './App'



// 由于是小程序审核问题，需要处理rpx转换
import rem from './libs/rem'

// 导入抽取的 网络请求
import request from './libs/http'
Vue.use(request)

// 导入路由
import router from './router'
// 导入仓库
import store from './store'


//倒入全局样式
import './assets/style/css/style.css'

//导入全局vant组建
//1.提示框
import { Toast } from 'vant';
Toast.setDefaultOptions({ duration: 1300 });
Toast.setDefaultOptions('loading', { forbidClick: true });
Vue.use(Toast)
// 2.懒加载
import { Lazyload } from 'vant';
Vue.use(Lazyload)
Vue.use(Lazyload, {
  lazyComponent: true,
});

// 全局的微信jssdk调用
Vue.prototype.$wxInit = function(){
  let url = window.location.href;
  this.$request.getJsdk({ url }).then(data => {
    let res = JSON.parse(data.data);
    console.log(res)
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: res.appId, // 必填，公众号的唯一标识
      timestamp: res.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.nonceStr, // 必填，生成签名的随机串
      signature: res.signature, // 必填，签名
      jsApiList:res.jsApiList// 必填，需要使用的JS接口列表
    });
  });
}





Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
  rem
}).$mount('#app')
