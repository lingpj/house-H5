<template>
  <div class='container'>
    <p class="tip">您已锁定该房源请填写补全如下信息</p>
    <ul>
        <li>
            <div>销售人员姓名</div>
            <input type="text" maxlength="10" v-model="salesman" placeholder="请输入业务员姓名">
        </li>
        <li>
            <div>联系电话</div>
            <input type="text"  maxlength="11" v-model="mobile" placeholder="请输入联系电话">
        </li>
        <li>
            <div>招商部门</div>
            <input type="text"  maxlength="10" v-model="dept" placeholder="请输入招商部门">
        </li>
        <li>
            <div>客户公司名称</div>
            <input type="text"  maxlength="15" v-model="enterprice" placeholder="请输入客户公司名称">
        </li>
    </ul>
    <footer @click="bindOrder">下一步</footer>
  </div>
</template>

<script>
import { Indicator,Toast } from 'mint-ui';
export default {
  name: '',
  components:{},
  data () {
    return {
        orderid:'',
        // 企业名称
        enterprice:'',
        // 电话
        mobile:'',
        // 销售人员
        salesman:'',
        // 销售部门
        dept:'',
    }
  },

  mounted(){
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
      
      this.weixin_id = sessionStorage.getItem('openId')
      // 获取订单id,pro_code
       console.log(this.$route.query)
      var { orderid,pro_code,weixin_id } = this.$route.query
      this.orderid = orderid
      this.pro_code = pro_code
      this.weixin_id = weixin_id
     
  },
  methods: {
    bindOrder(){
        var r1 = this.salesman.trim() == ''
        var r2 = this.dept.trim() == ''
        var r3 = this.enterprice.trim() == ''
        if(r1 || r2 || r3){
            Toast('请填写完整信息！')
            return 
        }
        if(!(/^1[34578]\d{9}$/.test(this.mobile))){ 
            Toast('手机号码格式有误！')
            return false; 
        } 
      Indicator.open('正在加载...');
      this.$fetch({
        url: process.env.on + `/room/order/modify`,
        method: 'put',
        data:{
            pro_code:this.pro_code,
            orderid:this.orderid,
            enterprice:this.enterprice,
            mobile:this.mobile,
            salesman:this.salesman,
            dept:this.dept,
             weixin_id:this.weixin_id
        }
      }).then((res) => {
         Indicator.close()
         if(parseInt(res.status) == 200){
             this.$router.push({
                 path:'/settlement',
                 query:{
                     pro_code:this.pro_code,
                     orderid:this.orderid,
                 }
             })
         }else{
             this.$router.push('/fail')
         }
      }).catch(err=>{
          Indicator.close()
      })
    },
  }
}
</script>

<style lang='scss' scoped>
 .container{
     padding: 10px;
     .tip{
         color: rgb(252,85,65);
         font-size: 14px;
     }
     ul{
         li{
             margin-top: 20px;
             padding: 5px;
             border: 1px solid #eee;
             display: flex;
             align-items: center;
             font-size: 14px;
             div{
                 border-right: 1px solid #eee;
                 padding-right: 10px;
                 width:100px;
                 text-align: right;
             }
             input{
                 outline: none;
                 border: none;
                 margin-left: 10px;
                //  padding: 10px 0;
                width: 50%;
                font-size: 16px;
                 height: 40px;
                 line-height: 40px;
             }
         }
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
 }
</style>
