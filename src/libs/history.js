
const History = {
    _history: [], // 历史记录堆栈
    _params:{},   //参数
    install(Vue) {
        // 提供Vue插件所需安装方法
        Object.defineProperty(Vue.prototype, '$routerHistory', {
            get() {
                return History;
            }
        })
    },
    push(path,params,name) { // 入栈
        this._history.push(path);
        this._params = params;
        this._name = name
    },
    pop() {
        this._history.pop();
    },
    canBack(){
        return this._history.length > 1;
    }

}
export default History;