// 导入axios
import axios from 'axios'
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);


// 设置基地址  
axios.defaults.baseURL = 'http://mpapi.ivfhome.com'

// 请求拦截器 请求发送之前 执行
axios.interceptors.request.use(
  function (config) {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    });
    // 先伪造token
   
    // config.headers.Authorization = window.localStorage.getItem('token')
    config.headers.Authorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJteWtqbWluaWFwcC5pdmZob21lLmNvbSIsImlhdCI6MTYwMjY0MTQwMSwiZXhwIjoxNjAyNzI3ODAxLCJuYmYiOjE2MDI2NDE0MDEsImp0aSI6ImM3NDQ5MzdkNzFlYmYwYWQwMWIzOTU0NmU1ODFmZjRmIiwiZGF0YSI6eyJ1c2VyX2lkIjo0N319.trSq92gfvN9DZYKPJYR7muSWtrw9-yhE4gL1D3e3VXc'
    
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)


// 响应拦截器 响应回来之后 执行
axios.interceptors.response.use(
  function (response) {
    Toast.clear();
    if (response.data.code == -1000 || response.data.code == -1001) {   
      if (window.localStorage.getItem('token')) {
        window.localStorage.removeItem('token')
        window.location.href = "http://mpapi.ivfhome.com/wechat/login/getToken"
        return
      }
      window.location.href = "http://mpapi.ivfhome.com/wechat/login/getToken"
      return
    }
    // 处理数据返回多层
    return response.data
  }
)



// 抽取网络请求的对象
const request = {
  //用户登陆
  userLogin(params) {
    return axios.post('/wechat/user/index', params)
  },
  // jsdk时间搓
  getJsdk(params) {
    return axios.post('/wechat/index/getJsdk', params)
  },
  //首页数据的获取 
  getIndexData(params) {
    return axios.post('/wechat/index/getIndexData', params)
  },
  //名医头条文章业获取
  getArticleList(params) {
    return axios.post('/wechat/article/getArticleList', params)
  },
  // 获取医院列表
  getHospitalList(params) {
    return axios.post('/wechat/hospital/getHospitalList', params)
  },
  // 获取医院详情

  getHospitalDetail(params) {
    return axios.post('/wechat/hospital/getHospitalDetail', params)
  },
  //获取文章页
  getArticleDetail(params) {
    return axios.post('/wechat/article/getArticleDetail', params)
  },
  //关于我们
  getArticleDetail(params) {
    return axios.post('/wechat/article/getArticleDetail', params)
  },
  // 获取套餐详情
  getServiceDetail(params) {
    return axios.post('/wechat/service_type/getServiceDetail', params)
  },
  // 获取用户列表
  getInfoList(params) {
    return axios.post('/wechat/user_info/getInfoList', params)
  },
  // 创建基础信息
  createInfo(params) {
    return axios.post('/wechat/user_info/createInfo', params)
  },
  // 创建订单
  addOrder(params) {
    return axios.post('/wechat/order/addOrder', params)
  },
  // 获取订单列表
  getOrderList(params) {
    return axios.post('/wechat/order/getOrderList', params)
  },
  // 获取订单详情
  getOrderDetail(params) {
    return axios.post('/wechat/order/getOrderDetail', params)
  },
  //增加基础信息
  addBaseInfo(params) {
    return axios.post('/wechat/user_info/addBaseInfo', params)
  },
  //获取关注医院
  getInterestHospital(params) {
    return axios.post("/wechat/user/getInterestHospital", params)
  },
  // 加关注
  interest(params) {
    return axios.post("/wechat/user/interest", params)
  },
  // 取消关注
  cancelInterest(params) {
    return axios.post("/wechat/user/cancelInterest", params)
  },
  // 上传用户证件
  addInfoAuth(params){
    return axios.post("/wechat/user_info/addInfoAuth", params)
  },
  // 上传体检报告
  addReport(params){
    return axios.post("/wechat/user_info/addReport", params)
  },
  // 获取用户资料
  getInfoDetail(params){
    return axios.post("/wechat/user_info/getInfoDetail", params)
  },
  //获取体检医院
  getExamHospital(params){
    return axios.post("/wechat/hospital/getExamHospital", params)
  }
}



export default {
  install(Vue) {
    // 添加到Vue的原型上
    Vue.prototype.$request = request
  }
}
