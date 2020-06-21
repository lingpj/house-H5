<template>
  <div class="container">
    <div class="backBtn"><span class="arrow"><</span>房源</div>
    <swiper :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
 
      <!-- <swiper-slide  >
        <img class="swiper-img" data-index="666" :src="source.path" alt>
      </swiper-slide> -->
      <swiper-slide  v-for="(item,index) in swiperData" :key="index">
        <img class="swiper-img" :src="item" alt>
      </swiper-slide>

      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-scrollbar" slot="scrollbar"></div>
    </swiper>
    <!-- <div class="shadow_block productMsg">
      <div
        class="img"
        @click="clickHandle"
        :style="{backgroundImage:'url('+(source.path ?source.path:'http://www.baidu.com/img/bd_logo1.png?qua=high')+')'}"
      ></div>
    </div> -->
    <div class="msg">
      <div class="park">房号：{{source.room}}</div>
      <div class="time">出租面积：{{source.built_up_area}}m²</div>
      <div class="money">租金：{{source.rent}}元/m²/天</div>
    </div>
    <p class="c-gray">基本信息</p>
    <ul class="shadow_block buyMsg">
      <li>
        <p>
          <span class="c-gray">所属园区</span>
          <span>{{source.park}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">楼栋</span>
          <span>{{source.build}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">楼层</span>
          <span>{{source.floor}}F</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">朝向</span>
          <span>{{source.direction}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">房号</span>
          <span>{{source.room}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">出租面积</span>
          <span>{{source.built_up_area}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">租金</span>
          <span>{{source.rent}}</span>
        </p>
      </li>
      <!-- <li>
        <p>
          <span class="c-gray">实际面积</span>
          <span>{{source.real_area}}m²</span>
        </p>
      </li>-->
      <!-- <li>
        <p>
          <span class="c-gray">层面积</span>
          <span>{{source.floor_area}}m²</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">层租金</span>
          <span>{{source.floor_rent}}元</span>
        </p>
      </li>-->
      <li v-if="source.enterprise">
        <p>
          <span class="c-gray">企业</span>
          <span>{{source.enterprise}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">状态</span>
          <span>{{source.status | fmtStatus}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">费用交纳期</span>
          <span>{{source.rent_date | fmtDate}}</span>
        </p>
      </li>
      <li>
        <p>
          <span class="c-gray">招商人员</span>
          <span>{{source.merchants}}</span>
        </p>
      </li>
      <li v-if="source.url">
        <p>
          <span class="c-gray">360VR看房</span>
          <span style="color:blue" @click="lookVR">查看</span>
        </p>
      </li>
      <li v-if="source.status == '5'">
        <p>
          <span class="c-gray">失效日期</span>
          <span >{{source.dead_time | fmtDate2}}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { parseTime } from "../../filters/index.js";
export default {
  name: "",
  components: { swiper, swiperSlide },
  data() {
    return {
      source: {
      },
      swiperData:[],
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        },
        autoplay: {
          disableOnInteraction: false
        },
        loopAdditionalSlides: 3,
        on: {
          click:this.handle
        }
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  mounted() {
    this.swiper.autoplay.start();
    console.log(this.swiper);
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

    var data = JSON.parse(sessionStorage.getItem("houseDetail"));
    console.log('----------------',data)
    this.source = {
      ...data,
    };
    this.swiperData = data.path.split(',')
  },
  filters: {
    fmtDate2(val) {
      console.log(">>", val);
      if (val && val !== "") {
        return parseTime(new Date(val))
      }
      return "";
    },
    fmtDate(val) {
      console.log(">>", val);
      if (val && val !== "") {
        return parseTime(new Date(val)).slice(0, 10);
      }
      return "";
    },
    fmtStatus(status) {
      var str = "";
      status = parseInt(status);
      if (status == 1) {
        str = "已租";
      } else if (status == 2) {
        str = "已付意向金";
      } else if (status == 3) {
        str = "空置";
      } else {
        str = "销控";
      }
      return str;
    }
  },
  methods: {
    handle(ev) {
      console.log(ev.target.src)
      window.open(ev.target.src);
    },
    callback() {},
    lookVR() {
      location.href = this.source.url;
    },
    payHandle() {
      this.$router.push("/");
    },
    clickHandle() {
      this.source.url && window.open(this.source.url);
    }
  }
};
</script>

<style lang='scss' scoped>
.c-gray {
  color: gray;
}
.swiper-img {
  width: 100%;
}
.container {
  padding: 15px;
  .backBtn{
    border-radius: 10px;
    padding:  5px 0;
    // color: #111;
    background-color: lightgray;
    text-align: center;
    color: #111;
    margin-bottom: 10px;
    font-size: 14px;
    .arrow{
      color:#007aff;
      float: left;
      transform: scaleY(2);
      margin-left: 10px;
    }
  }
  .shadow_block {
    padding: 15px;
    box-shadow: 0 0 5px lightgray;
    border-radius: 5px;
    margin-top: 15px;
  }
  .msg {
    // flex: 1;
    display: flex;
    // flex-direction: column;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 12px;
    margin-bottom: 20px;
  }
  .productMsg {
    display: flex;

    .img {
      width: 100%;
      height: 170px;
      background-image: url("http://www.baidu.com/img/bd_logo1.png?qua=high");
      background-repeat: no-repeat;
      background-size: 100% 100%;
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
