<template>
  <div style="padding-bottom:75px">
    <ul>
      <!-- <li @click="$router.push('/chooseHouse')">
        <em></em>
        <div>
          <h1>房源报表</h1>
          <p>最新房源信息</p>
        </div>
      </li> -->
      <li @click="$router.push('/houseList')">
        <em></em>
        <div>
          <h1>房源秒杀</h1>
          <p>抢订热门房源</p>
        </div>
      </li>
      <li @click="$router.push('/parkTicket')">
        <em></em>
        <div>
          <h1>停车券</h1>
          <p>购买停车券</p>
        </div>
      </li>
      <li @click="meetingHandle">
        <em></em>
        <div>
          <h1>会议室</h1>
          <p>会议室预定</p>
        </div>
      </li>
      <!-- <li @click="chartHandle">
        <em></em>
        <div>
          <h1>报表</h1>
          <p>报表分析</p>
        </div>
      </li> -->
    </ul>
    <homeFooter></homeFooter>
  </div>
</template>



<script>
import homeFooter from "../../components/homeFooter";
import { getQueryObject } from "../../utils/index";
import Cookies from "js-cookie";
import store from "../../store";
import { getWxParams } from "../../utils/wxShare";
export default {
  name: "",
  components: {
    homeFooter
  },
  data() {
    return {
      swipeDataArr: [
        { url: "/assets/1.jpg" },
        { url: "../../assets/2.jpg" },
        { url: "../../assets/3.jpg" }
      ],
      goodsList: []
    };
  },
  mounted() {

    // sessionStorage.setItem('openId','b1F6NDc2S1ZvSUJsNHp0ODhoam1hbVpjb1lvYw==')
    if(window.location.href.indexOf('?') > -1){
      var token = window.location.href.split('?')
      sessionStorage.setItem('openId',decodeURIComponent(token[1].slice(6)))
    }else{
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9a05dd1e7ac51030&redirect_uri=http%3a%2f%2fdropdbandescape.parkwing.cn%2froom%2fauthorize%2fspike&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
    }
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
   
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    meetingHandle(){
      window.location.href = `http://dropdbandescape.parkwing.cn/room/meetingroom/authorize/${sessionStorage.getItem('openId')}`
    },
    chartHandle(){
      window.location.href = `http://pwmall.parkwing.cn/vacancyRate.html`
    }
  }
};
</script>

<style lang='scss' scoped>
ul {
  // padding: 0 10px;
  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
    em {
      width: 38px;
      height: 38px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: block;
    }
    h1 {
      color: #fff;
      margin-bottom: 10px;
    }
    p {
      color: #fff;
      font-size: 12px;
    }
  }
  li:first-child {
    height: 98px;
    width: 100%;
    background: url("../../assets/img/back_f@2x.png") no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;
    em {
      margin-left: 30px;
      margin-right: 20px;
      background-image: url("../../assets/img/fangyuan.png");
    }
  }
  li:nth-child(2) {
    height: 98px;
    margin-left: 5px;
    width: calc(100% - 10px);
    background: url("../../assets/img/back.png") no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;
    em {
      margin-left: 25px;
      margin-right: 20px;
      background-image: url("../../assets/img/miaosha.png");
    }
  }
  li:nth-child(3) {
    height: 98px;
    margin-left: 5px;
    width: calc(100% - 10px);
    background: url("../../assets/img/2.png") no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;
    em {
      margin-left: 25px;
      margin-right: 20px;
      background-image: url("../../assets/img/1.png");
    }
  }
  li:nth-child(4) {
    height: 98px;
    margin-left: 5px;
    width: calc(100% - 10px);
    background: url("../../assets/img/a.jpg") no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;
    em {
      margin-left: 25px;
      margin-right: 20px;
      background-image: url("../../assets/img/a.png");
    }
  }
  li:nth-child(5) {
    height: 98px;
    margin-left: 5px;
    width: calc(100% - 10px);
    background: url("../../assets/img/q.jpg") no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;
    em {
      margin-left: 25px;
      margin-right: 20px;
      background-image: url("../../assets/img/q.png");
    }
  }
}
.myswipe {
  height: auto;
  & /deep/ .mint-swipe-items-wrap > div {
    height: inherit;
  }
  & /deep/ .mint-swipe-items-wrap {
    height: 200px;
  }
}

.guessLike {
  font-size: 14px; // padding-bottom: 50px;
  max-height: calc(100% + 1px);
  & > div {
    padding: 10px 15px;
  }
  ul {
    // display: flex; // padding: 0 5px;
    // flex-wrap: wrap;
    background-color: #eee;
    li {
      display: inline-block;
      width: 50%; // margin-bottom: 10px;
      border-bottom: 10px solid #eee; // padding: 0 5px;
      .img {
        background-size: 100% 100%;
        background-position: center center;
        width: 100%;
        height: 185px; // border: 1px solid #eee;
        background-color: #e2e2e2;
      }
      .title {
        padding: 8px 10px 4px 10px;
        font-size: 13px;
        background-color: #fff;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .description {
        padding: 4px 10px 4px 10px;
        font-size: 11px;
        color: #888;
        background-color: #fff;
      }
      .price {
        background-color: #fff;
        padding-left: 10px;
        padding-top: 5px;
        color: #888;
        font-size: 11px;
        .nowPrice {
          // color: #F43530;
          color: #111;
          font-size: 14px;
          letter-spacing: 1px;
          font-weight: 550;
          margin-right: 5px;
        }
      }
    }
    li:nth-child(2n + 1) {
      border-right: 5px solid #eee;
      border-left: 5px solid #eee; // padding-right: 5px;
      // float: left;
    }
    li:nth-child(2n) {
      border-right: 5px solid #eee;
      border-left: 5px solid #eee; // padding-left: 5px;
      // float: right;
    }
  }
}
</style>
