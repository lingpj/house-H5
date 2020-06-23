<template>
  <div class="container">
    <p class="park" @click="chooseParkHandle">
      <span>{{parkAndFloor == '' ? '请选择园区' : parkAndFloor}}</span>
      <span>></span>
    </p>
    <div class="sumView">
      <div
        class="b-black"
        :class="{ activeTabIndex :activeTabIndex == 0 }"
        @click="getScrollData(0)"
      >
        <p class="c-black c-black">全部</p>
        <p>{{sumView['view1'].total +sumView['view2'].total+sumView['view3'].total+sumView['view4'].total}}套</p>
        <p>100%</p>
      </div>
      <div
        class="b-blue"
        :class="{ activeTabIndex :activeTabIndex == 1 }"
        @click="getScrollData(1)"
      >
        <p class="c-blue c-bold">已租</p>
        <p>{{sumView['view1'].total}}套</p>
        <p>{{sumView['view1'].percent}}</p>
      </div>
      <div
        class="b-yellow"
        :class="{ activeTabIndex :activeTabIndex == 2 }"
        @click="getScrollData(2)"
      >
        <p class="c-yellow c-bold">预租</p>
        <p>{{sumView['view2'].total}}套</p>
        <p>{{sumView['view2'].percent}}</p>
      </div>
      <div class :class="{ activeTabIndex :activeTabIndex == 5 }" @click="getScrollData(5)">
        <p class="c-lightgray c-bold">预公示</p>
        <p>{{sumView['view5'].total}}套</p>
        <p>{{sumView['view5'].percent}}</p>
      </div>
      <div :class="{ activeTabIndex :activeTabIndex == 3 }" @click="getScrollData(3)">
        <p class="c-green c-bold">未租</p>
        <p>{{sumView['view3'].total}}套</p>
        <p>{{sumView['view3'].percent}}</p>
      </div>
      <div class="b-red" :class="{ activeTabIndex :activeTabIndex == 4 }" @click="getScrollData(4)">
        <p class="c-red c-bold">保留</p>
        <p>{{sumView['view4'].total}}套</p>
        <p>{{sumView['view4'].percent}}</p>
      </div>
    </div>
    <div class="chadow_block">
      <p>搜索条件</p>
      <br>
      <div class="flexBox">
        <input type="text" v-model="greateThan">m²-
        <input type="text" v-model="smallThan">m²
        <div class="searchBtn" @click="getScrollData">搜索</div>
        <div class="searchBtn" @click="resetDataHandle">重置</div>
      </div>
      <ul class="searchConditionList">
        <li
          :class="{ active:activeIndex == index  }"
          v-for="(item,index) in searchConditionList"
          @click="searchConditionHandle(item,index)"
        >{{item.name}}</li>
      </ul>
    </div>
    <p class="c-gray unit">单元</p>

    <div class="scrollBox">
      <div class="indexScroll" :style="{transform: 'scale('+scale+')',marginTop:top-20+'px',transformOrigin: transformOriginTool}">
        <p v-for="view in detailView" class="index">{{view.floor}}F</p>
      </div>
      <v-touch
        @pinchout="pinchout"
        @pinchin="pinchin"
        @panmove="panmove"
        @panstart="panstart"
        class="touch-container"
        @panend="panend"
        :pinch-options="{ threshold: 0.09 }"
        :pan-options="{ threshold: 0.01 }"
        :style="{transform: 'scale('+scale+')',position:'absolute' ,transformOrigin: transformOrigin,top:top + 'px',left:left + 'px'}"
      >
        <div v-for="view in detailView">
          <div
            class="block"
            v-for="item in view.data"
            @click="viewClickHandle(item)"
            :class="returnClassByStatus(item.status)"
          >
            <em v-if="item.url" class="vr"></em>
            <div>
              <span class="room">{{item.room}}</span>
              <span class="componyName">{{item.enterprise}}</span>
            </div>
            <p>
              <span v-if="item.status !=1">{{item.rent}}元/天/m²</span>
              <span>{{item.built_up_area}}m²</span>
            </p>
          </div>
          <br>
        </div>
      </v-touch>
    </div>

    <div class="popup">
      <popup v-model="popupVisible">
        <div class="content">
          <p class="tool">
            <span class="cancel" @click="popupVisible = false">取消</span>
            <span class="title">选择园区</span>
            <span class="certain" @click="certainSelectorHandle">确定</span>
          </p>
          <group>
            <selector
              ref="defaultValueRef"
              @on-change="selectorChangeHandle"
              :options="selectorList"
              v-model="defaultSelector"
            ></selector>
          </group>
          <div class="floorBox">
            <div
              v-for="(item,index) in floorArr"
              @click="chooseFloorHandle(item,index)"
              :class="{activeFloor :index == activeFloorIndex}"
            >{{item.buildname}}</div>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import { Selector, Group, Popup } from "vux";
export default {
  name: "",
  components: { Popup, Selector, Group },
  data() {
    return {
      seatScale:1,
       scale:1,
      touchStatus: false,
      top: 0,
      left: 0,
      startX: 0, // ---移动的起点X轴 单位px
      startY: 0, // ---移动的起点Y轴 单位px
      parkAndFloor: "",
      popupVisible: false,
      defaultSelector: "",
      selectorList: [],
      floorArr: [],
      activeFloorIndex: 0,
      activeTabIndex: 0,
      sumView: {
        view1: {
          visible: false,
          total: 0,
          percent: 0
        },
        view2: {
          visible: false,
          total: 0,
          percent: 0
        },
        view3: {
          visible: false,
          total: 0,
          percent: 0
        },
        view4: {
          visible: false,
          total: 0,
          percent: 0
        },
        view5: {
          visible: false,
          total: 0,
          percent: 0
        }
      }, //总概览
      // 园区和楼座详情
      detailView: [],
      smallThan: "",
      greateThan: "",
      searchConditionList: [
        { name: "200m²以下", smallThan: "200", greateThan: "0" },
        { name: "200m²-400m²", smallThan: "400", greateThan: "200" },
        { name: "400m²-600m²", smallThan: "600", greateThan: "400" },
        { name: "600m²-1000m²", smallThan: "1000", greateThan: "600" },
        { name: "1000m²以上", smallThan: "10000000", greateThan: "1000" }
      ],
      activeIndex: -1
    };
  },
  watch: {
    activeFloorIndex(val) {
      console.log(">>>>>", val);
    }
  },
  computed:{
    transformOrigin: function () {
     
      // return 0.474598076923077 * 100 + '%' + 0.475 * 100 + '%'
      return 50+ '%' +50 + '%'
    },
    // css样式控制.seat-tool缩放中心点
    transformOriginTool: function () {
      return '0 ' + 0.5 * 100 + '%'
    },
  },
  mounted() {
    //   检查权限
    if (window.location.href.indexOf("?") > -1) {
      var token = window.location.href.split("?");
      sessionStorage.setItem("openId", decodeURIComponent(token[1].slice(6)));
    }
    this.checkPower();
    console.log(this.$route.query.park, this.$route.query.build);
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

    this.$fetch({
      url: process.env.on + "/room/parkinfo/name/list",
      method: "get",
      params: {}
    }).then(res => {
      if (res.data) {
        this.selectorList = (res.data.rows || []).map((item, index) => {
          return {
            key: index,
            value: item
          };
        });
        var str = sessionStorage.getItem("houseSelectHistory");
        if (str && str != "") {
          var obj = JSON.parse(str);
          this.defaultSelector = obj.defaultSelector;
        } else {
          if (this.$route.query.park) {
            this.defaultSelector = this.selectorList.findIndex(
              item => item.value == this.$route.query.park
            );
          } else {
            this.defaultSelector = this.selectorList[0].key;
          }
        }
        console.log(">>", obj);
        this.$nextTick(() => {
          this.activeFloorIndex = JSON.parse(str).activeFloorIndex;
        });
        this.getFloor();
      }
    });
  },
  methods: {
     // 当手指拖动的过程中
    panmove: function(ev) {
      let _this = this;
      if (_this.touchStatus) {
        // 本次座位图移动横纵坐标rem的值
        // _this.top = (ev.deltaY + _this.startY) / _this.screenRem;
        _this.top = (ev.deltaY + _this.startY)   
        _this.left = (ev.deltaX + _this.startX) 
        console.log( _this.top, _this.left)
      }
    },
    // 当手指拖动开始的时候
    panstart: function(ev) {
      console.log(ev)
      let _this = this;
      _this.touchStatus = true;
      // 获取上次记录的xy坐标作为起点
      _this.startY = _this.top  
      _this.startX = _this.left
    },
    // 当手指拖动结束的时候
    panend: function(ev) {
      let _this = this;
      _this.touchStatus = false;
      // if (_this.scale === 1) {
      //   // _this.top = 0;
      //   // _this.left = 0;
      // } else {
      //   // 如果宽度度移动超过了边界值 把移动置为边界值
      //   if (_this.left > _this.crossleft) {
      //     _this.left = _this.crossleft;
      //   } else if (_this.left < -_this.crossleft) {
      //     _this.left = -_this.crossleft;
      //   }

      //   // 如果高度移动超过了边界值 把移动置为边界值
      //   if (_this.top > _this.crosstop) {
      //     _this.top = _this.crosstop;
      //   } else if (_this.top < -_this.crosstop) {
      //     _this.top = -_this.crosstop;
      //   }
      // }
    },
    // 当缩放 放大的时候触发
    pinchout: function() {
      let _this = this;
      if (_this.scale >= 0 && _this.scale) {
        _this.scale += 0.02;
      }
    },
    // 当缩放 缩小的时候触发
    pinchin: function() {
      let _this = this;
      if (_this.scale > 0.3) {
        _this.scale -= 0.02;
      }
    },
    checkPower() {
      Indicator.open("正在加载...");
      this.$fetch({
        url: process.env.on + `/room/employee/pageList`,
        method: "POST",
        data: {
          // 05d618c1-109f-4e81-ba04-5d11b9589f9b
          weixinid: sessionStorage.getItem("openId"),
          limit: 1,
          page: 1
        }
      }).then(res => {
        Indicator.close();
        if (res.list.length > 0) {
        } else {
          this.$router.push("/writeMsgParkTicket");
        }
      });
    },
    //   给view返回色块
    returnClassByStatus(status) {
      status = parseInt(status);
      var str = "bg-red";
      if (status == 1) {
        str = "bg-blue";
      } else if (status == 2) {
        str = "bg-yellow";
      } else if (status == 3) {
        str = "bg-green";
      } else if (status == 5) {
        str = "b-lightgray";
      }

      return str;
    },
    //   重置
    resetDataHandle() {
      this.greateThan = "";
      this.smallThan = "";
      this.activeIndex = -1;
      this.activeTabIndex = 0;
      this.getScrollData(0);
    },
    viewClickHandle(data) {
      console.log(data);
      sessionStorage.setItem("houseDetail", JSON.stringify(data));
      sessionStorage.setItem(
        "houseSelectHistory",
        JSON.stringify({
          defaultSelector: this.defaultSelector,
          activeFloorIndex: this.activeFloorIndex
        })
      );
      this.$router.push("/houseDetail");
    },
    //   根据园区name取楼座
    getFloor() {
      this.$fetch({
        url: process.env.on + "/room/parkinfo/pageList",
        method: "post",
        data: {
          limit: 10000000,
          page: 1,
          parkname: this.selectorList.find(
            item => item.key == this.defaultSelector
          ).value
        }
      }).then(res => {
        this.floorArr = res.list;
        if (this.$route.query.build) {
          this.activeFloorIndex = this.floorArr.findIndex(
            item => item.buildname == this.$route.query.build
          );
        }
        this.getStatusByParkFloor();
        this.getScrollData();
      });
    },
    // 查询园区楼座状态
    getStatusByParkFloor() {
      var park = this.selectorList.find(
        item => item.key == this.defaultSelector
      ).value;

      var floor = this.floorArr.find(
        (item, index) => index == this.activeFloorIndex
      ).buildname;
      this.$fetch({
        url: process.env.on + "/room/room/total",
        method: "post",
        data: {
          build: floor,
          park: park
        }
      }).then(res => {
        var self = this;
        for (var key in this.sumView) {
          this.sumView[key].visible = false;
          this.sumView[key].total = 0;
          this.sumView[key].percent = 0;
        }
        res.list.forEach(item => {
          console.log(item.status);

          self.sumView["view" + item.status].visible = true;
          self.sumView["view" + item.status].total = item.totalcount;
          self.sumView["view" + item.status].percent =
            ((item.totalcount / res.totalcount) * 100).toFixed(2) + "%";
        });
      });
    },
    // 滚动区域数据
    getScrollData(status) {
      Indicator.open("正在加载...");
      if (status === undefined) {
        status = this.activeTabIndex;
      } else if (!(status instanceof Object)) {
        this.activeTabIndex = status;
      }
      var park = this.selectorList.find(
        item => item.key == this.defaultSelector
      ).value;
      var floor = this.floorArr.find(
        (item, index) => index == this.activeFloorIndex
      ).buildname;
      var data = {
        park: park,
        build: floor,
        limit: 100000000,
        smallThan: "built_up_area|" + this.smallThan,
        greateThan: "built_up_area|" + this.greateThan,
        page: 1,
        status: isNaN(status) || status == 0 ? "" : status,
        openid: sessionStorage.getItem("openId") || ""
      };
      if (!this.smallThan || !this.greateThan) {
        delete data.smallThan;
        delete data.greateThan;
      }
      this.$fetch({
        url: process.env.on + "/room/room/permiss/pageList",
        method: "post",
        data: data
      }).then(res => {
        Indicator.close();

        console.log('数据：',res)

        var park = this.selectorList.find(
          item => item.key == this.defaultSelector
        ).value;
        var floor = this.floorArr.find(
          (item, index) => index == this.activeFloorIndex
        ).buildname;
        this.parkAndFloor = park + " - " + floor;

        var obj = {};
        var result = [];
        res.list.forEach(item => {
          if (!obj[item.floor]) {
            obj[item.floor] = true;
            result.push({
              floor: item.floor,
              data: [item]
            });
          } else {
            var o = result.find(o => o.floor == item.floor);
            o.data.push(item);
          }
        });
        result = result.sort((a,b)=>{
          return a.floor - b.floor
        })
        this.detailView = result;
      });
    },
    //  选择条件
    searchConditionHandle(data, index) {
      console.log(data);
      this.smallThan = data.smallThan;
      this.greateThan = data.greateThan;
      this.activeIndex = index;
      this.getScrollData();
    },
    // 确定选择
    certainSelectorHandle() {
      this.popupVisible = false;
      this.getStatusByParkFloor();
      this.getScrollData();
    },
    // 园区变化
    selectorChangeHandle(value) {
      console.log("--", value);
      this.activeFloorIndex = 0;
      this.getFloor();
      document.body.scrollTop = 0;
    },
    // 楼座变化
    chooseFloorHandle(item, index) {
      console.log(item, index);
      console.log("==");
      this.activeFloorIndex = index;
    },
    chooseParkHandle() {
      this.popupVisible = true;
    }
  }
};
</script>

<style lang='scss' scoped>
@media screen and (max-width: 320px) {
  input {
    width: 70px !important;
  }
}
.c-lightgray {
  color: gray;
}
.b-lightgray {
  background-color: gray;
}
.vr {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 20px;
  height: 20px;
  background: url("../../assets/vr.png") no-repeat;
  background-size: 100% 100%;
}
.touch-container{
  padding-left: 30px;
}
.container {
  font-size: 14px;
  .activeTabIndex {
    box-shadow: 0 0 10px gray inset;
  }
  .flexBox {
    display: flex;
    //  justify-content: space-between;
    align-items: center;
  }
  .componyName {
    display: inline-block;
    width: 80px;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    // top: 8px;
  }
  .active {
    background-color: rgb(58, 130, 237);
    color: #fff;
  }
  .searchConditionList {
    width: 100%;
    margin-top: 10px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;

    //  justify-content: space-between;
    li {
      margin-right: 10px;
      // min-width: 110px;
      padding: 5px;
      // height: 30px;
      // line-height: 30px;
      text-align: center;
      border: 1px solid gray;
      border-radius: 5px;
      margin-top: 10px;
    }
  }
  input {
    width: 100px;
    text-align: center;
    border-radius: 3px;
    box-shadow: none;
    outline: none;
    border: 1px solid gray;
  }
  .searchBtn {
    display: inline-block;
    background-color: rgb(58, 130, 237);
    color: #fff;
    float: right;
    width: 80px;
    border-radius: 5px;
    margin-left: 10px;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
  .chadow_block {
    padding: 20px 5px;
    box-shadow: 0 0 2px gray;
  }
  .unit {
    padding: 10px;
  }
  .popup /deep/ .content {
    height: calc(100vh - 210px);
    background-color: #fff;
    .tool {
      background-color: #eee;
      padding: 20px 20px;
      display: flex;
      justify-content: space-between;
      line-height: 150%;
      .title {
        font-size: 16px;
      }
      .certain {
        color: rgb(58, 130, 237);
      }
    }
    .floorBox {
      div {
        width: calc(33.33% - 13px);
        height: 40px;
        border: 1px solid #eee;
        padding: 10px;
        text-align: center;
        display: inline-block;
        margin-left: 10px;
        margin-top: 20px;
        border-radius: 5px;
        line-height: 150%;
      }
    }
  }
  .activeFloor {
    color: rgb(58, 130, 237);
    border-color: rgb(58, 130, 237) !important;
  }
  .c-gray {
    color: gray;
  }
  .b-red {
    border-color: rgb(255, 59, 35);
  }
  .b-yellow {
    border-color: rgb(253, 199, 67);
  }
  .b-blue {
    border-color: rgb(30, 126, 255);
  }
  .b-green {
    border-color: rgb(149, 129, 255);
  }
  .c-red {
    color: rgb(255, 59, 35);
  }
  .c-yellow {
    color: rgb(253, 199, 67);
  }
  .c-blue {
    color: rgb(30, 126, 255);
  }
  .c-green {
    color: rgb(149, 129, 255);
  }
  .bg-red {
    background-color: rgb(255, 59, 35);
  }
  .bg-yellow {
    background-color: rgb(253, 199, 67);
  }
  .bg-blue {
    background-color: rgb(30, 126, 255);
  }
  .bg-green {
    //  background-color: rgb(149,129,255);
    border: 1px solid rgb(149, 129, 255);
    color: rgb(149, 129, 255) !important;
  }
  .c-bold {
    font-weight: bold;
  }
  .park {
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    border-bottom: 1px solid #eee;
    margin: 10px;
  }
  .sumView {
    //  display: flex;
    overflow: hidden;
    //  justify-content: space-between;
    padding: 10px 0;
    div {
      box-sizing: border-box;
      border-radius: 5px;
      border-width: 1px;
      border-style: solid;
      padding: 5px;
      width: 22%;
      float: left;
      margin-left: 1.65%;
      height: 90px;
      margin-bottom: 10px;
      p {
        text-align: right;
        padding: 5px 0;
      }
      p:first-child {
        font-size: 16px;
        letter-spacing: 3px;
      }
      p:nth-child(2) {
        font-size: 16px;
      }
    }
    div:nth-child(3n) {
      margin-right: 50px;
    }
  }
  .scrollBox {
    width: calc(100% - 20px);
    //  height: 400px;
    margin-left: 10px;
    margin-right: 10px;
    height: calc(100vh - 210px);
    //  background-color: #f9f9f9;
    overflow: scroll;
    border: 1px solid #eee;
    white-space: nowrap;
    // padding-left: 30px;
    padding-top: 20px;
    position: relative;
    .indexScroll {
      float: left;
      position: sticky;
      left: 0;
      background-color: #fff;
      z-index: 10;
      .index {
        text-align: center;
        width: 30px;
        height: 50px;
        margin-bottom: 10px;
        line-height: 50px;
        font-size: 16px;
      }
    }
    .block {
      position: relative;
      color: #fff;
      border-radius: 5px;
      margin-left: 10px;
      margin-bottom: 10px;
      display: inline-block;
      min-width: 140px;
      height: 50px;
      line-height: 24px;

      padding: 0 5px;
      text-align: center;
      font-size: 16px;
      & > div {
        display: flex;
        align-items: center;
        position: relative;
        top: 4px;
      }
      .room {
        float: left;
        position: relative;
        // top: 8px;
      }
      p {
        font-size: 12px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
