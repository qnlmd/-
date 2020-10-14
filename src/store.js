import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 实例化仓库
const store = new Vuex.Store({
  // 数据
  state: {
    //标题
    fbTitle: '',
    // 记录头部是否显示
    tState:'',
    // 记录底部是否显示
    fState:'',
    // 历史地址
    url:''
  },
  mutations: {
    // 修改头部
    changeFbTitle(state, newFbTitle) {
      state.fbTitle = newFbTitle.name
      state.tState  = newFbTitle.tState
    },
    // 修改尾部
    changeFbFoot(state,newFbFoot){
      state.fState  =  newFbFoot
    },
    //记录返回地址
    changeUrl(state,newUrl){
      state.url = newUrl
    }
  }
})
// 暴露出去
export default store
