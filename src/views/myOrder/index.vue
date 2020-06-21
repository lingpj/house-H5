<template>
  <div class="container">
    <p class="c-gray">我抢到的房源</p>
    <ul class="shadow_block buyMsg">
      <li>
        <p>
          <span class="c-gray">下单时间</span>
          <span>虹桥</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">支付时间</span>
          <span>012</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">所属园区</span>
          <span>张三</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">序号</span>
          <span>百度科技有限公司</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">支付金额</span>
          <span>百度科技有限公司</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">销售人员</span>
          <span>百度科技有限公司</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">招商部门</span>
          <span>百度科技有限公司</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">客户信息</span>
          <span>百度科技有限公司</span>
        </p>
      </li>
    </ul>
    
  </div>
</template>

<script>

import { Indicator,Toast } from 'mint-ui';
export default {
  name: "",
  components: {},
  data() {
    return {
      limit:1,
      page:10,
    };
  },

  mounted() {
    this.getOrders()
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
      
  },
  methods: {
    getOrders(){
      this.$fetch({
        url: process.env.on + `/room/trade/pageList`,
        method: 'POST',
        data:{ 
          limit:this.limit,
          page:this.page,
          weixin_id:sessionStorage.getItem('openId'),
        }
      }).then((res) => {
         Indicator.close()
         if(parseInt(res.status) == 200){
              
         }else{
             Toast(res.message)
         }
      }).catch(err=>{
          Indicator.close()
      })
    }
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
      padding: 10px 0;
      font-size: 14px;
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
  
}
</style>
