<template>
  <div class="container">
     <h1>停车券商品</h1>
     <div v-for="item in list" class="item">
       <div class="img" :style="'background-image:url('+ item.thumbnail +')'"></div>
        <div class="goods">
          <p class="title">{{item.proname}} <span class="desc">适用:{{item.scope}}</span> </p>
          <!-- <p></p> -->
          <p class="price"><span class="new">¥{{item.current_price}}</span><del class="old">¥{{item.cost_price}}</del></p>
          <div class="util">
            <span class="add" @click="count <99 ? count++: count">十</span>
            <input type="number"  v-model="count" >
            <span class="reduce" @click="count >1 ? count--: count">一</span>
            <div class="btn" @click="buyHandle(item)">购买</div>
          </div>
          
        </div>
     </div>
    <!-- <homeFooter></homeFooter> -->
  </div>
</template>



<script>
import { Indicator,Toast } from 'mint-ui';
import homeFooter from "../../components/homeFooter";
import { getWxParams } from "../../utils/wxShare";
export default {
  name: "",
  components: {
    homeFooter
  },
  data() {
    return {
      count :1,   // 数量
      list:[]
    };
  },
  mounted() {
     this.$fetch({
        url: process.env.on + `/room/paking/ticket/pageList`,
        method: 'POST',
        data:{
           "limit":"20",
           "page":1,
           "order":"createtime"
        }
      }).then((res) => {
          this.list = res.list || []
      })
  },
  methods: {
    buyHandle(item){
       Indicator.open('正在加载...'); 
       this.$fetch({
        url: process.env.on + `/room/employee/pageList`,
        method: 'POST',
        data:{
          // 05d618c1-109f-4e81-ba04-5d11b9589f9b
            "weixinid": sessionStorage.getItem('openId'),
            "limit": 1,
            "page": 1
        }
      }).then((res) => {
        Indicator.close()
        sessionStorage.setItem('parkTicketDetail',JSON.stringify({
            ...item,
            count:this.count
          }))
        if(res.list.length >0){
          
          this.$router.push('/settlementParkTicket')
        }else{
          this.$router.push('/writeMsgParkTicket')
        }
      })
    }
    
  }
};
</script>

<style lang='scss' scoped>
.container{
  padding: 10px;
  .img{
    width: 100%;
    height: 150px;
    background: url('../../assets/ticket.png') no-repeat ;
    background-size: 100% 100%;
  }
  h1{
    text-align: center;
    margin-bottom:10px;
  }
  .item{
    box-shadow: 0 0 5px lightgray;
    padding: 5px;
  }
  .goods{
    
    p{
      margin: 10px 0;
    }
    .price{
      .new{
        color: red;
      }
      .old{
        color: gray;
        font-size: 12px;
      }
    }
    .desc{
      float: right;
      font-size: 12px;
      color: gray;
    }
    input{
      width: 50px;
      text-align: center;
    }
    .util{
      padding-top: 5px;
      overflow: hidden;
      // display: flex;
      // align-items: center;
      span{
        display: inline-block;
        text-align: center;
        border-radius: 50%;
        border: 1px solid gray;
        width: 20px;
        height:20px;
        font-size: 14px;
        transform: scale(.8,.8);
        line-height: 20px;
      }
      input{
        // margin: 0 10px;
      }
    }
    .btn{
      float: right;
      background-color: rgb(22,155,213);
      color:#fff;
      width: 100px;
      height: 30px;
      line-height: 30px;
      border-radius: 5px;
      text-align: center;
      // margin-top: 10px;
      position: relative;
      top: -5px;
    }
  }
}
</style>
