import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV);
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta:{
        name:'首页'
      },
      component: _import('/home/index'),
      // component: _import('/chooseHouse/index'),
    },
    {
      path: '/emptyHouse',
      name: 'emptyHouse',
      meta:{
        name:'空置房源'
      },
      component: _import('/emptyHouse/index'),
      // component: _import('/chooseHouse/index'),
    },
    {
      path: '/mine',
      name: 'mine',
      meta:{
        name:'我的'
      },
      component: _import('/mine/index'),
    },
    {
      path: '/houseList',
      name: 'houseList',
      meta:{
        name:'房源列表'
      },
      component: _import('/houseList/index'),
    },
    {
      path: '/writeMsg',
      name: 'writeMsg',
      meta:{
        name:'填写信息'
      },
      component: _import('/writeMsg/index'),
    },
    {
      path: '/settlement',
      name: 'settlement',
      meta:{
        name:'确认购买'
      },
      component: _import('/settlement/index'),
    },
    {
      path: '/houseDetail',
      name: 'houseDetail',
      meta:{
        name:'房源详情'
      },
      component: _import('/houseDetail/index'),
    },
    {
      path: '/myOrder',
      name: 'myOrder',
      meta:{
        name:'房源详情'
      },
      component: _import('/myOrder/index'),
    },
    {
      path: '/success',
      name: 'success',
      meta:{
        name:'选房成功'
      },
      component: _import('/payResult/success'),
    },
    {
      path: '/fail',
      name: 'fail',
      meta:{
        name:'选房失败'
      },
      component: _import('/payResult/fail'),
    },{
      path: '/chooseHouse',
      name: 'chooseHouse',
      meta:{
        name:'查看房源'
      },
      component: _import('/chooseHouse/index'),
    },
    {
      path: '/parkTicket',
      name: 'parkTicket',
      meta:{
        name:'购买停车券'
      },
      component: _import('/parkTicket/index'),
    },
    {
      path: '/settlementParkTicket',
      name: 'settlementParkTicket',
      meta:{
        name:'下单'
      },
      component: _import('/settlementParkTicket/index'),
    },
    {
      path: '/writeMsgParkTicket',
      name: 'writeMsgParkTicket',
      meta:{
        name:'填写信息'
      },
      component: _import('/writeMsgParkTicket/index'),
    },{
      path: '/buyTicketSuccess',
      name: 'buyTicketSuccess',
      meta:{
        name:'购买成功'
      },
      component: _import('/payResultParkTicket/success'),
    },
    {
      path: '/buyTicketFail',
      name: 'buyTicketFail',
      meta:{
        name:'购买失败'
      },
      component: _import('/payResultParkTicket/fail'),
    },
    {
      path: '/parkTicketDetail',
      name: 'parkTicketDetail',
      meta:{
        name:'停车券详情'
      },
      component: _import('/parkTicketDetail/index'),
    },
    {
      path: '/parkTicketUse',
      name: 'parkTicketUse',
      meta:{
        name:'优惠券使用'
      },
      component: _import('/parkTicketUse/index'),
    },
    {
      path: '/useFail',
      name: 'useFail',
      meta:{
        name:'使用失败'
      },
      component: _import('/payResultParkTicket/useFail'),
    },
    {
      path: '/useSuccess',
      name: 'useSuccess',
      meta:{
        name:'使用成功'
      },
      component: _import('/payResultParkTicket/useSuccess'),
    },
    {
      path: '/test',
      name: 'test',
      meta:{
        name:'test'
      },
      component: _import('/test'),
    }
  ]
})
