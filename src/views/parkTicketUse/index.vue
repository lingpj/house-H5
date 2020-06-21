<template>
  <div class='container'>
    <div>
        <p >输入车牌:</p>
        <input  type="text" v-model="plateNo">
        <p  >停车优惠券:</p>
        <p  >{{dataObj.pro_code}}</p>
        <p  >抵扣金额:<span>{{dataObj.price | formatPrice}} 元</span></p>
        <footer @click="useHandle">立即使用</footer>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
export default {
  name: '',
  components:{},
  data () {
    return {
        dataObj:{
            child_order:'',
            parent_order:'',
        },
        plateNo:''
    }
  },
    filters: {
        formatPrice(val){
            return (val / 100).toFixed(2)
        },
    },
  mounted(){
      
        this.dataObj = JSON.parse(sessionStorage.getItem('buyedParkTicketDetail'))   
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
    
      useHandle(){
           Indicator.open("正在加载...");
            this.$fetch({
                url: process.env.on + `/room/payorder_details/use`,
                method: "POST",
                data: {
                     "plateNo":this.plateNo,
                    "cid":this.dataObj.child_order,
                    "oid":this.dataObj.parent_order
                }
            })
            .then(res => {
                Indicator.close();
                if(res.status == 200){
                    Toast('使用成功！')
                    this.$router.push('/useSuccess')
                }else{
                    Toast('使用失败！')
                    this.$router.push('/useFail')
                }
            })
            .catch(err => {
                Indicator.close();
            });
      }
  }
}
</script>

<style lang='scss' scoped>
 .container{
     padding: 10px;
     .c-blue{
         color: blue;
     }
     &>div{
         box-shadow:  0 0 5px lightgray;
         padding: 5px;
     }
     footer{
         color: #fff;
         border-radius: 5px;
         text-align: center;
         height: 43px;
         width: 100%;
         background-color: rgb(45,133,237);
         margin: 20px auto;
         line-height: 43px;
     }
     p{
         margin: 10px 0;
     }
     input{
         padding: 5px;
         font-size: 14px;
     }
 }
</style>
