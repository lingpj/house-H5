<template>
  <div class="container">
    <p class="c-gray">商品信息</p>
    <div class="shadow_block productMsg">
      <div class="img" :style="{backgroundImage:'url('+parkTicketData.thumbnail +')'}"></div>
      <div class="msg">
        <div class="park">{{parkTicketData.proname}}</div>
        <div class="time">适用园区：{{parkTicketData.scope}}</div>
        <div class="time">购买数量：{{parkTicketData.count}}</div>
        <div class="money">支付金额：<span>¥{{parkTicketData.current_price * parkTicketData.count}}</span></div>
      </div>
    </div>
    <p class="c-gray">购买信息</p>
    <ul class="shadow_block buyMsg">
      <li>
        <p>
          <span class="c-gray">部门</span>
          <span>{{userInfo.deptname}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">姓名</span>
          <span>{{userInfo.name}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">联系电话</span>
          <span>{{userInfo.mobile}}</span>
        </p>
      </li>
    </ul>
    <footer>
      <div class="money">实付：{{parkTicketData.current_price * parkTicketData.count}}元</div>
      <div class="pay"  @click="payHandle">立即支付
        <!-- <em class="icon"></em> -->
        <!-- <span>{{restTime}}</span> -->
      </div>
      <!-- <div class="pay" v-else @click="$router.push('/')">订单已失效</div> -->
    </footer>
  </div>
</template>

<script>
import { Indicator,Toast } from 'mint-ui';
export default {
  name: "",
  components: {},
  data() {
    return {
      orderid:'',
      weixin_id:'',
      parkTicketData:{},
      // restTime:'10.00',
      timer:'',
      userInfo:{}
    };
  },
  mounted() {
    this.weixin_id = sessionStorage.getItem('openId')
    this.initData()
    this.getUserInfo()
    // this.$fetch({
    //     url: process.env.on + `/room/weixinPay/shareWxInfo`,
    //     method: 'POST',
    //     data:{
    //        url: window.location.href.slice(0,25),
    //        weixin_id:sessionStorage.getItem('openId'),
    //     }
    //   }).then((res) => {
    //     wx.config({
    //         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //         appId: res.appId, // 必填，公众号的唯一标识
    //         timestamp: res.timestamp, // 必填，生成签名的时间戳
    //         nonceStr: res.nonceStr, // 必填，生成签名的随机串
    //         signature: res.signature,// 必填，签名
    //         jsApiList: [
    //             'hideMenuItems'
    //         ],
    //     });
    //     wx.ready(function() {
    //         WeixinJSBridge.call('hideOptionMenu');
    //     });
    //   })
      
  },
  methods: {
    initData(){
        var self = this
        this.parkTicketData = JSON.parse(sessionStorage.getItem('parkTicketDetail'))

        // var time = this.parkTicketData.createtime + 10*60*1000
        // self.timer = setInterval(() => {
        //   self.restTime = self.countTime(time)
        //   if(!self.restTime){
        //     clearInterval(self.timer)
        //     self.timer = null
        //   }
        // }, 1000);
    },
    // 倒计时
    countTime(time){
           var nTime = new Date(time).getTime() - new Date().getTime()
           console.log('>>', new Date(time) ,new Date())
           if(nTime <0){
             return false
           }else if(nTime == 0){
             console.log('为0')
             return 0
           }
           var day=0,h=0,m=0,s=0
           
           var result3 = parseInt(nTime / 1000 /60 %60)
           m = result3 <10 ? '0' + result3 : result3

           var result4 =  parseInt(nTime / 1000 % 60)
           s = result4 <10 ? '0' + result4 : result4
           return  m+'.'+s
    },
    // 获取当前用户信息
    getUserInfo(){
      this.$fetch({
        url: process.env.on + `/room/employee/info`,
        method: 'POST',
        data:{
           weixinid:sessionStorage.getItem('openId'),
        }
      }).then((res) => {
        this.userInfo = res
      })
    },
    // 支付下单
    payHandle(){
      Indicator.open('正在加载...');
      var list = []
      for(var i=0;i<this.parkTicketData.count;i++){
        list.push({
          num:1,
          pro_code:this.parkTicketData.procode
        })
      }
      this.$fetch({
        url: process.env.on + `/room/payinfo/unifiedorder`,
        method: 'post',
        data:{
          "paynumber": "1000001254376742",
          "list":list,
          "weixin_id":sessionStorage.getItem('openId')
        }
      }).then((res) => {
         Indicator.close()
        //  if(parseInt(res.status) == 200){
            this.onBridgeReady({
              "appId": res.appId,     //公众号名称，由商户传入     
              "timeStamp": res.timeStamp,         //时间戳，自1970年以来的秒数     
              "nonceStr": res.nonceStr, //随机串     
              "package": res.package,
              "signType": res.signType,         //微信签名方式：     
              "paySign": res.paySign //微信签名 
            })
        //  }else{
        //      Toast(res.message)
        //  }
      }).catch(err=>{
          Indicator.close()
      })
    },
    // 调起微信支付
    onBridgeReady: function(params) {
      Indicator.open('正在加载...');
      var self = this
      wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: params.appId, // 必填，公众号的唯一标识
            timestamp: params.timestamp, // 必填，生成签名的时间戳
            nonceStr: params.nonceStr, // 必填，生成签名的随机串
            signature: params.signature,// 必填，签名
            jsApiList: ['onMenuShareTimeline',
              'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
          });
          Indicator.close()
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId": params.appId,     //公众号名称，由商户传入     
          "timeStamp": params.timeStamp,         //时间戳，自1970年以来的秒数     
          "nonceStr": params.nonceStr, //随机串     
          "package": params.package,
          "signType": params.signType,         //微信签名方式：     
          "paySign": params.paySign //微信签名 
        },
        function(res) {
         Indicator.close()
        //  alert(res.err_msg)
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            self.$router.push({
              path:'/buyTicketSuccess',
            })
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }else{
            self.$router.push({
              path:'/buyTicketFail',
            })
          }
          Indicator.close()
        });
    },
  }
};
</script>

<style lang='scss' scoped>
.c-gray {
  color: gray;
}
.container {
  padding: 15px;
  .shadow_block {
    padding: 15px;
    box-shadow: 0 0 5px lightgray;
    border-radius: 5px;
    margin-top: 15px;
  }
  .productMsg {
    display: flex;
    margin-bottom: 30px;
    .img {
      width: 80px;
      height: 80px;
      background: url("http://www.baidu.com/img/bd_logo1.png?qua=high")
        no-repeat;
      background-size: 100% 100%;
      margin-right: 10px;
    }
    .msg {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // padding: 10px 0;
      font-size: 14px;
      .money span{
          color:  rgb(255,18,18);
      }
    }
  }
  .buyMsg {
    li {
      font-size: 14px;
      padding-bottom: 15px;
      margin-bottom: 15px;
      border-bottom: 1px dotted #eee;
      p {
        display: flex;
        justify-content: space-between;
      }
    }
    li:last-child {
      border: none;
      // margin:none;
      padding: 0;
    }
  }
  footer{
    z-index: 9;
    position: fixed;
    width:100%;
    left:0;
    bottom:0;
    border-top: 1px solid #eee;
    display: flex;
    div{
      width: 50%;
      height: 55px;
      line-height: 55px;
      text-align: center;
    }
    .pay{
      em{
        height: 12px;
        width: 12px;
        background: url('../../assets/img/daojishi2.png') no-repeat;
        background-size: 100% 100%;
        display: inline-block;
      }
      color: #fff;
      background-color: rgb(255,18,18);
    }
  }
}
</style>
