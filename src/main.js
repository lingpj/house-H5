// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui';  // 引入mint-ui
import store from './store/index'
import 'mint-ui/lib/style.css'
import * as filters from './filters'; // 全局vue filter
import './assets/iconfont/iconfont.css'
import  { LoadingPlugin,ToastPlugin   } from 'vux'
import fetch from './utils/fetch';
import 'swiper/dist/css/swiper.css';
import animate from 'animate.css'
import { InfiniteScroll } from 'mint-ui';
import VueTouch from 'vue-touch'
Vue.use(VueTouch, {name: 'v-touch'})
import VConsole from 'vconsole';

  // var vConsole = new VConsole();
  // vConsole.setOption('maxLogNumber', 1000);

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-unused-vars
  let vConsole = new VConsole()
}

Vue.use(InfiniteScroll);
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(Mint);
Vue.config.productionTip = false
// 日期格式化拓展
Date.prototype.format = function (fmt) { //author: meizz   
  var o = {
    "M+": this.getMonth() + 1,                 //月份   
    "d+": this.getDate(),                    //日   
    "h+": this.getHours(),                   //小时   
    "m+": this.getMinutes(),                 //分   
    "s+": this.getSeconds(),                 //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
    "S": this.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

router.beforeEach((to, from, next) => {
  console.log(to)
  document.title = to.meta.name
  if(to.meta.name == '首页' || to.meta.name=='我的'){
    store.commit('changeTabbarTitle',to.meta.name)
  }
  next()
});

Vue.prototype.$fetch = fetch

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
