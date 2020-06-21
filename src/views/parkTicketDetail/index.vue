<template>
  <div class="container">
    <ul class="shadow_block buyMsg">
      <li>
        <p>
          <span class="c-gray">创建时间</span>
          <span>{{dataObj.createtime | formatDate}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">价格</span>
          <span>{{dataObj.price | formatPrice}}元</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">券码</span>
          <span>{{dataObj.pro_code}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">订单号</span>
          <span>{{dataObj.child_order}}</span>
        </p>
      </li>
      <li v-if="dataObj.status!==0">
        <p>
          <span class="c-gray">销账车牌</span>
          <span>{{dataObj.plate_no}}</span>
        </p>
      </li>
      <li v-if="dataObj.status!==0">
        <p>
          <span class="c-gray">销账时间</span>
          <span>{{dataObj.use_time | formatDate}}</span>
        </p>
      </li>
    </ul>
    <footer
      :class="{ disabled2:dataObj.status===1}"
      @click="useHandle"
    >{{dataObj.status===0 ?'使用':'已使用'}}</footer>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      dataObj: {
        createtime: "",
        price: "",
        pro_code: "",
        child_order: "",
        status: "",
        plate_no:'',
        use_time:'',
      }
    };
  },
  filters: {
    formatPrice(val) {
      if(typeof val =='string'){
        val = parseInt(val)
      }
      return (val / 100).toFixed(2);
    },
    formatDate(val) {
      // if(typeof val =='string'){
      //   return val
      // }
      console.log('>>>>  ',val)
      return new Date(parseInt(val)).format("yyyy-MM-dd hh:mm:ss");
    }
  },
  mounted() {
    var isShare = false
    if (location.href.indexOf("cid") > -1) {
      isShare = true
      this.dataObj.child_order = this.getQueryString("cid");
      this.dataObj.parent_order = this.getQueryString("oid");
      this.dataObj.createtime = this.getQueryString("createtime");
      this.dataObj.price = this.getQueryString("price");
      this.dataObj.pro_code = this.getQueryString("pro_code");
      this.dataObj.status = parseInt(this.getQueryString("status"));
      this.dataObj.plate_no = this.getQueryString("plate_no");
      this.dataObj.use_time = this.getQueryString("use_time");
      sessionStorage.setItem('other',this.getQueryString("other"))
      sessionStorage.setItem('buyedParkTicketDetail',JSON.stringify(this.dataObj))
    } else {
      this.dataObj = this.$set(
        this,
        "dataObj",
        JSON.parse(sessionStorage.getItem("buyedParkTicketDetail"))
      );
    }
    if(isShare) return
    var self = this;
    this.$fetch({
      url: process.env.on + "/room/weixinPay/shareWxInfo",
      method: "post",
      data: {
        url: location.href.split("#")[0]
      }
    }).then(res => {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature, // 必填，签名
        jsApiList: [
          "showAllNonBaseMenuItem",
          "onMenuShareTimeline",
          "onMenuShareAppMessage"
        ] // 必填，需要使用的JS接口列表
      });

      setTimeout(() => {
        wx.ready(function() {
          wx.showAllNonBaseMenuItem();
          var shareUrl =
            process.env.on +
            "/room/ticket/wx/share/" +
            self.dataObj.parent_order +
            "/" +
            self.dataObj.child_order+
            "/" +
            self.dataObj.createtime+
            "/" +
            self.dataObj.price+
            "/" +
            self.dataObj.pro_code+
            "/" +
            self.dataObj.status;
          // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
          var obj = {
            title: "您收到一张停车券", // 分享标题
            desc:
              "专注于高端智慧商务平台的开发，为助推区域产业发展升级提供实力保障和品牌保证。", // 分享描述
            link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: "http://pwmall.parkwing.cn/file/shop/pic/dsafsda.png" // 分享图标
          };
          wx.onMenuShareTimeline(obj);
          wx.onMenuShareAppMessage(obj);
        });
      }, 300);
    });
  },
  methods: {
    getQueryString(name) {
      var str = location.href.slice(location.href.indexOf('?')+1)
      var list = str.split('&')
      var str = ''
      list.forEach(item =>{
        if(item.indexOf(name) >-1){
          str = item.slice(name.length+1)
        }
      })
      return str
    },
    useHandle() {
      if (this.dataObj.status === 0) {
        this.$router.push("/parkTicketUse");
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@media screen and (max-width: 320px) {
  * {
    font-size: 12px;
  }
}
.c-blue {
  color: blue;
}
.disabled2 {
  color: gray !important;
  background-color: lightgray !important;
}
footer {
  color: #fff;
  border-radius: 5px;
  text-align: center;
  height: 43px;
  width: 100%;
  background-color: rgb(45, 133, 237);
  margin: 20px auto;
  line-height: 43px;
}
.parkTicketList {
  .content {
    display: flex;
    margin-top: 5px;
    font-size: 14px;
    margin: 10px 0;
    .desc {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }
  }

  .title {
    height: 30px;
    border-bottom: 1px solid lightgray;
    // padding-bottom: 15px;
  }
  .img {
    width: 80px;
    height: 80px;
    background: url("http://www.baidu.com/img/bd_logo1.png?qua=high") no-repeat;
    background-size: 100% 100%;
    margin-right: 10px;
    border: 1px solid #eee;
  }
}
.c-gray {
  color: gray;
}
.child-tabs {
  display: flex;
  // box-shadow: 0 0 5px lightgray;
  li {
    flex: 1;
    padding: 10px;
    text-align: center;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
  }
}
.tabs {
  display: flex;
  li {
    flex: 1;
    padding: 10px;
    text-align: center;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
  }
}
.active {
  border-bottom: 2px solid red !important;
  color: red;
}
.shadow_block {
  padding: 15px;
  box-shadow: 0 0 5px lightgray;
  border-radius: 5px;
  margin-top: 15px;
}
.container {
  padding: 15px;
  padding-bottom: 70px;
  .divider {
    margin-top: 15px;
  }
  .none {
    text-align: center;
    color: gray;
    margin-top: 50px;
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
  .payBtn {
    float: right;
    background-color: rgb(255, 18, 18);
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    border-radius: 5px;
  }
}
</style>