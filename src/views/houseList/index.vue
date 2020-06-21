<template>
  <div class="container">
    <ul v-infinite-scroll="loadMoreHandle" infinite-scroll-immediate-check="false" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <li v-for="item in list">
         <p class="time">抢购时间：<span class="c-red">{{item.spike_time | parseTime}}</span></p>
        <div class="img" :style="{backgroundImage:'url('+item.pic_info+')'}">
          <p class="park">{{item.park}}</p>
        </div>
        <div class="msg">
          <p class="room">{{item.build }}</p>
          <p>{{item.room}}</p>
          <p class="money">预付定金：<span class="c-red">{{item.price}}元</span></p>
        </div>
        <div class="rightBox">
          <p class="endTime" :class="{ 'moreThan' : item.countTime.length > 9}" v-if="item.countTime">
            <em></em>
            {{item.countTime}}
          </p>
          <p class="btn b-red" v-if="item.btnFlag == 1" @click="addOrder(item)">立即抢购</p>
          <p class="btn" v-if="item.btnFlag == 2"  >即将开放</p>
          <p class="btn b-gray" v-if="item.btnFlag == 3"  >支付中...</p>
          <p class="btn b-blue" v-if="item.btnFlag == 4" >已下架</p>
          <p class="btn b-blue" v-if="item.btnFlag == 5" >已售罄</p>
        </div>
      </li>
       <divider class="divider" v-if="dividerVisible">我是有底线的</divider>
    </ul>
    <homeFooter></homeFooter>
  </div>
</template>

<script>
import {  Divider } from 'vux'
import { Indicator ,Toast } from 'mint-ui';
import homeFooter from "../../components/homeFooter";
export default {
  name: "",
  components: {
    homeFooter,
    Divider
  },
  data() {
    return {
      list: [
        {
          park: "华新园",
          build:'',
          room: "B栋202",
          time: "2019.03.17 19:55",
          money: "¥20000",
          pic_info: "http://www.baidu.com/img/bd_logo1.png?qua=high",
        },
      ],
      // 分页
      pageNum:1,
      pageSize:6,
      // 微信id
      weixin_id:'',
      dividerVisible:false
    };
  },
  watch:{
    $route(to,from){
      console.log('route:',to.path,from);
    }
  },
  mounted() {
    this.$fetch({
        url: process.env.on + `/room/weixinPay/shareWxInfo`,
        method: 'POST',
        data:{
           url: window.location.href.slice(0,25),
           weixin_id:sessionStorage.getItem('openId'),
        }
      }).then((res) => {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appId, // 必填，公众号的唯一标识
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.nonceStr, // 必填，生成签名的随机串
            signature: res.signature,// 必填，签名
            jsApiList: [
                'hideMenuItems'
            ],
        });
        wx.ready(function() {
            WeixinJSBridge.call('hideOptionMenu');
        });
      })
      
    // 'b1dKZmkwNFMwME9wN0ZsRUVBTFJoajFKbmN5VQ=='
    this.weixin_id = sessionStorage.getItem('openId')
    this.getTableList()
  },
  methods: {
    addOrder(data){
      Indicator.open('正在加载...');
      this.$fetch({
        url: process.env.on + `/room/order/add`,
        method: 'POST',
        data:{
            pro_code:data.code,
            weixin_id:this.weixin_id,
        }
      }).then((res) => {
         Indicator.close()
         if(parseInt(res.status) == 200){
          this.$router.push({path:'/writeMsg',query:{
            orderid:res.data.orderid,
            pro_code:res.data.pro_code,
            weixin_id:res.data.weixin_id
          }})
         }else{
           this.$router.push('/fail')
         }
      }).catch(err=>{
          Indicator.close()
      })
    },
    // 载入更多
    loadMoreHandle() {
      this.pageSize += 3
      this.getTableList()
    },
    countTime(time){
           var nTime = new Date(time).getTime() - new Date().getTime()
           if(nTime <0){
             return false
           }else if(nTime == 0){
             console.log('为0')
             return 0
           }
           var day=0,h=0,m=0,s=0
           
           var result1 = parseInt(nTime / 1000 / 24 / 60 /60)
           day = result1
          
           var result2 = parseInt(nTime / 1000 / 60/60 %24)
           h = result2 <10 ? '0' + result2 : result2

           var result3 = parseInt(nTime / 1000 /60 %60)
           m = result3 <10 ? '0' + result3 : result3

           var result4 =  parseInt(nTime / 1000 % 60)
           s = result4 <10 ? '0' + result4 : result4
           return (day == 0 ? '': day+'天') + h+'时' + m+'分' + s+'秒'
    },
    getTableList(){
      Indicator.open('正在加载...');
      this.$fetch({
        url: process.env.on + `/room/room/publish/list/${this.pageNum}/${this.pageSize}`,
        method: 'get',
        params:{}
      }).then((res) => {
        Indicator.close()
        
        this.list = res.data
        if (res.data.length == this.list.length) {
          this.dividerVisible = true
        }
        // this.list.forEach((item,index)=>{
        //   if(item.opentime){
        //     item.opentime = new Date(item.opentime.replace(/-/g,"/")).getTime() 
        //   }
        //   if(item.ordertime){
        //     item.ordertime = new Date(item.ordertime.replace(/-/g,"/")).getTime()  
        //   }
        //   if(item.spike_time){
        //     item.spike_time = new Date(item.spike_time.replace(/-/g,"/")).getTime()  
        //   }
        // })
        console.log(this.list)
        this.list.forEach((item,index) =>{
           
          //  秒杀时间-当前时间 
          // 1、大于0，即将开始 
          // 2、小于0，立即抢购 
           if(item.status == 1){
             item.btnFlag = 1    // 立即抢购
           }
           if(item.status == 3 || item.status == 1){
             var self = this
            //  item.spike_time = '2019-03-30 00:22:50'
            // item.spike_time = item.spike_time.replace(/-/g,"/");
             item.countTime = this.countTime(item.spike_time)
             if(item.countTime){
               item.timer = setInterval(() => {
                //  item.spike_time = item.spike_time.replace(/-/g,"/");
                  item.countTime = self.countTime(item.spike_time)
                  if(!item.countTime){
                    clearInterval(item.timer)
                    item.timer = null
                    item.btnFlag = 1
                  }
                  self.list = self.list.slice()
              }, 1000);
              item.btnFlag = 2    // 即将开始
             }else{
               item.btnFlag = 1
             }
           }
           if(item.orderstatus==1){
             var self = this
            //  item.opentime = '2019-03-30 11:08:50'
            //  item.opentime = item.opentime.replace(/-/g,"/");
             item.countTime = this.countTime(item.opentime )
              if(item.countTime){
                 item.timer = setInterval(() => {
                  //  item.opentime = item.opentime.replace(/-/g,"/");
                      item.countTime = self.countTime(item.opentime)
                      if(!item.countTime){
                        clearInterval(item.timer)
                        item.timer = null
                        item.btnFlag = 1
                      }
                      self.list = self.list.slice()
                  }, 1000);
                  item.btnFlag = 3    // 支付中...
              }else{
                item.btnFlag = 1
              }
           }
           if(item.status==2){
             item.btnFlag = 4    // 已下架
           }
           if(item.status == 4){
             item.btnFlag = 5
           }
         })
         this.list = this.list.filter(item =>{
           if((new Date().getTime() - item.spike_time) >= 7*24*60*60*1000){
             return false
           }
           return true
         })
         this.list = this.list.sort(function(a,b){
           return a.btnFlag - b.btnFlag
         })
      }).catch(err =>{
        Indicator.close()
      })
    }
  }
};
</script>

<style lang='scss' scoped>
@media screen and (max-width: 330px) {
    .img {
      // height:60px !important;
        // width: 60px !important;
    }
    .msg{
      line-height: 150%;
    }
    .btn{
      font-size: 12px !important;
      width: 60px  !important;
    }
    .rightBox{
      margin-top: 20px;
      position: static !important;
      overflow: hidden;
    }
}
.moreThan{
  position: relative;
  left:-30px;
  width: 150px;
}
.endTime {
  text-align: right;
}
.b-red{
    background-color:rgb(255,18,18) !important;
}
.b-gray{
  background-color: rgb(205,205,205) !important;
}
.c-red{
    color:rgb(255,18,18);
}
.b-blue{
   background-color: rgb(174,201,255) !important;
}
.container {
  .divider {
    margin-top: 15px;
  }
  ul {
    height: calc(100vh - 55px);
    overflow: scroll;
    li {
      padding: 37px 10px 20px 10px;
      border-bottom: 1px solid #eee;
      display: flex;
      font-size: 12px;
    //   background-color: lightblue;
      position: relative;
      .time{
        position: absolute;
        top: 20px;
        left:10px;
      }
      em {
        width: 12px;
        height: 12px;
        display: inline-block;
        background: url("../../assets/img/daojishi.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: 2px;
      }
      .img {
        border: 1px solid #eee;
        width: 80px;
        height: 80px;
        position: relative;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        margin-right: 10px;
        .park {
          position: absolute;
          left: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          color: #fff;
          text-align: center;
          width: 100%;
          height: 18px;
          line-height: 18px;
          font-size: 10px;
        }
      }
      .msg {
        flex: 1;
        display: flex;
        flex-direction:column;
        justify-content: space-between;
        padding: 10px 0;
        .room{
            font-size: 14px;
        }
      }
      .rightBox{
          position: absolute;
          right: 7px;
          top: 0;
          height: 100%;
          width: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .btn{
              height: 30px;
              color: #fff;
              text-align: center;
              line-height: 30px;
              font-size: 14px;
              border-radius: 5px;
              margin-top: 10px;
              width:calc(100% - 10px);
              background-color: rgb(92,137,255);
          }
      }
    }
  }
}
</style>
