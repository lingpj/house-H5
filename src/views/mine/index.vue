<template>
  <div>
    <ul class="tabs">
      <li :class="{active:active == 0}" @click="active =0 ">秒杀房源</li>
      <li :class="{active:active == 1}" @click="active =1 ">我的停车券</li>
    </ul>
    <ul class="child-tabs" v-if="active == 1">
      <li :class="{active:childActive == 2}" @click="childTabsHandle(2,2)">待使用</li>
      <li :class="{active:childActive == 3}" @click="childTabsHandle(4,3)">已使用</li>
    </ul>
    <div
      class="container"
      v-infinite-scroll="loadMoreParkTicketHandle"
      infinite-scroll-immediate-check="false"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10">
      <ul v-if="active ==0" class="shadow_block buyMsg" v-for="item in list">
        <li>
          <p>
            <span class="c-gray">下单时间</span>
            <span>{{item.createtime | fmtDate}}</span>
          </p>
        </li>
        <li>
          <p>
            <span class="c-gray">支付时间</span>
            <span>{{item.createtime | fmtDate}}</span>
          </p>
        </li>
        <li>
          <p>
            <span class="c-gray">支付状态</span>
            <span>{{item.status| formatStatus}}</span>
          </p>
        </li>
        <li>
          <p>
            <span class="c-gray">所属园区</span>
            <span>{{item.park}}</span>
          </p>
        </li>
        <li>
          <p>
            <span class="c-gray">楼栋</span>
            <span>{{item.build}}</span>
          </p>
        </li>
        <li>
          <p>
            <span class="c-gray">楼层</span>
            <span>{{item.floor}}</span>
          </p>
        </li>
        <li>
          <p>
            <span class="c-gray">房号</span>
            <span>{{item.room}}</span>
          </p>
        </li>
        <li>
          <p>
            <span class="c-gray">支付金额</span>
            <span>{{item.price}}元</span>
          </p>
        </li>
        <li>
          <p>
            <span class="c-gray">销售人员</span>
            <span>{{item.salesman}}</span>
          </p>
        </li>
        <li>
          <p>
            <span class="c-gray">招商部门</span>
            <span>{{item.dept}}</span>
          </p>
        </li>
        <li>
          <p>
            <span class="c-gray">客户信息</span>
            <span>{{item.enterprice}}</span>
          </p>
        </li>
        <li v-if="item.status == 1" style="margin-bottom:0">
          <div class="payBtn" @click="payHandle(item)">立即支付</div>
          <div style="clear:both"></div>
        </li>
      </ul>
      <ul v-if="active ==1" class="shadow_block parkTicketList" v-for="(item,index) in parkTicketList">
        <li @click="liHandle(item,index)">
          <p class="title">
            购买时间: <span class="c-blue">{{item.createtime | formatDate}}</span>
            <span style="float:right" v-if="parseInt(item.status) ==2">待使用</span>
            <span style="float:right" v-if="parseInt(item.status) ==4">已使用</span>
          </p>
          <!-- <div class="content"> -->
            <!-- <div class="img"></div> -->
            <!-- <div class="desc"> -->
              <!-- <p>购买时间:{{item.createtime | formatDate}}</p>
              <p>数量:{{item.list.length }}</p>
              <p>总价:{{item.price2 }}</p> -->
            <!-- </div> -->
          <!-- </div> -->
          <div class="footer"  v-for="ticket in item.list" v-if="item.childVisible">
            <div  @click.stop="go2detail(ticket)" :class="{ img1:parseInt(item.status) ==4}" class="img" alt=""></div>
            <!-- <div>{{ticket.child_order}}</div> -->  
            <!-- <div>{{ticket.price | formatPrice}}元</div> -->
            <!-- <div class="c-blue" @click.stop="go2detail(ticket)">查看详情</div> -->
          </div>
        </li>
      </ul>
    </div>
    <homeFooter></homeFooter>
  </div>
</template>

<script>
import homeFooter from "../../components/homeFooter";
import { parseTime } from "../../filters/index.js";
import { Divider } from "vux";
import { Indicator, Toast } from "mint-ui";
export default {
  name: "",
  components: { Divider, homeFooter },
  data() {
    return {
      list: [],
      parkTicketList:[],
      limit: 5,
      parkTicketLimit:5,
      page: 1,
      dividerVisible: false,
      ticketDividerVisible:false,
      currentData: {},
      active:0,
      childActive:2,
      currentFlag:2,
    };
  },
  mounted() {
    // alert(decodeURIComponent(window.location.href))
    if(window.location.href.indexOf('token=') > -1){
      var token = window.location.href.split('token=')[1]
      sessionStorage.setItem('openId',decodeURIComponent(token))
    }
    if(this.$route.query.flag == 1){
      this.active = 1
    }
    this.getOrders();
    this.getParkTicketHandle()
    this.$fetch({
      url: process.env.on + `/room/weixinPay/shareWxInfo`,
      method: "POST",
      data: {
        url: window.location.href.slice(0, 25),
        weixin_id: sessionStorage.getItem("openId")
      }
    }).then(res => {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature, // 必填，签名
        jsApiList: ["hideMenuItems"]
      });
      wx.ready(function() {
        WeixinJSBridge.call("hideOptionMenu");
      });
    });
  },
  filters: {
    formatPrice(val){
      return (val / 100).toFixed(2)
    },
    formatDate(val){
      return new Date(val).format('yyyy-MM-dd hh:mm:ss')
    },
    fmtDate(val) {
      return parseTime(new Date(val));
    },
    formatStatus(val) {
      var arr = ["支付中", "已支付 ", " 订单关闭"];
      return arr[val - 1];
    }
  },
  methods: {
    // 查看停车券详情
    go2detail(item){
      sessionStorage.setItem('buyedParkTicketDetail',JSON.stringify(item))
      console.log(item)
      this.$router.push('/parkTicketDetail')
    },
    // 展开停车券
    liHandle(item,index){
      
      item.childVisible = !item.childVisible
      this.parkTicketList.splice(index,1,item)
      console.log(item.childVisible)
    },
    // 获取停车券
    loadMoreParkTicketHandle(){
      if(this.active==0){
         this.limit += 3;
        this.getOrders();
      }else{
        this.parkTicketLimit +=3
        this.getParkTicketHandle()
      }
    },
    getParkTicketHandle(flag){
      // 1:支付中 2:支付完成(未使用) 3:已关闭 4: 已使用
        Indicator.open("正在加载...");
        this.$fetch({
          url: process.env.on + `/room/payorder/orderlist`,
          method: "POST",
          data: {
              "limit": this.parkTicketLimit,
              "page": 1,
              "weixin_id": sessionStorage.getItem('openId'),
              "status":this.currentFlag
          }
        })
          .then(res => {
            Indicator.close();
            console.log('->>>>>>>>>>>>>>',res)
             this.parkTicketList = res.orderlist
            //  this.parkTicketList = [
            //    { list:[{},{}]}
            //  ]
             this.parkTicketList.forEach(item =>{
               item.childVisible = true
               item.price2 = (item.price / 100).toFixed(2)
             })
          })
          .catch(err => {
            Indicator.close();
          });
    },
    // 获取房源订单
    getOrders() {
      Indicator.open("正在加载...");
      this.$fetch({
        url: process.env.on + `/room/trade/pageList`,
        method: "POST",
        data: {
          weixin_id: sessionStorage.getItem("openId"),
          limit: this.limit,
          page: this.page,
          order: "createtime"
        }
      })
        .then(res => {
          Indicator.close();
          this.list = res.list;
          if (res.list.length == this.list.length) {
            this.dividerVisible = true;
          }
        })
        .catch(err => {
          Indicator.close();
        });
    },
    // 载入更多
    loadMoreHandle() {
      this.limit += 5;
      this.getOrders();
    },
    childTabsHandle(n,n2){
      this.childActive = n2
      this.currentFlag = n+''
      this.parkTicketLimit = 5
      this.getParkTicketHandle()
    },
  }
};
</script>

<style lang='scss' scoped>
.c-blue{
  color: blue;
}
.parkTicketList{
  .content{
    display: flex;
    margin-top: 5px;
    font-size: 14px;
    margin: 10px 0;
    height: 120px;
    background: url('../../assets/ticket.png') no-repeat;
    background-size: 100% 100%;
    // .desc{
    //   display: flex;
    //   justify-content:space-between;
    //   flex-direction: column;
    // }
  }
  .footer{
    border-top: 1px solid lightgray;
    padding: 15px 0;
    display: flex;
    justify-content:space-between;
    font-size: 14px;
    color: gray;
    .img{
      width: 100%;
    }
  }
  .title{
    // height: 30px;
    padding-bottom: 10px;
    font-size: 14px;
    border-bottom: 1px solid lightgray;
    // padding-bottom: 15px;

  }
  .img {
      width: 80px;
      height: 100px;
      background: url("../../assets/img/cart.jpg")
        no-repeat;
      background-size: 100% 100%;
      margin-right: 10px;
      border: 1px solid #eee;
    }
    .img1{
      width: 80px;
      height: 100px;
      
      margin-right: 10px;
      border: 1px solid #eee;
      background: url("http://pwmall.parkwing.cn/1111.jpg")
        no-repeat;
        background-size: 100% 100%;
        // http://pwmall.parkwing.cn/1111.jpg
    }
}
.c-gray {
  color: gray;
}
.child-tabs{
  display:flex;
  // box-shadow: 0 0 5px lightgray;
  li{
    flex:1;
    padding: 10px;
    text-align: center;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
  }
}
.tabs{
  display:flex;
  li{
    flex:1;
    padding: 10px;
    text-align: center;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
  }
}
.active{
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
