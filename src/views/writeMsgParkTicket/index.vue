<template>
  <div class='container'>
    <p class="tip">填写基本信息</p>
    <ul>
        <li>
            <div>部门</div>
                 <selector style="flex:1" @on-change="parkChangeHandle" :options="partList" v-model="currentPart"></selector>

        </li>
        <li>
            <div>姓名</div>
                <selector style="flex:1" @on-change="salemanChangeHandle" :options="salesmanList" v-model="currentSaleman"></selector>
        </li>
        <li>
            <div>联系电话</div>
            <input type="text" disabled maxlength="11" v-model="mobile" placeholder="">
        </li>
        <li>
            <div>验证码</div>
            <input type="text"  maxlength="6" v-model="code" placeholder="请输入验证码">
            <section class="c-blue" @click="sendCode">{{msg}}</section>
        </li>
    </ul>
    <footer @click="bindOrder">下一步</footer>
  </div>
</template>

<script>
import { Indicator,Toast } from 'mint-ui';
import {  Selector, Group  ,Popup} from 'vux'
export default {
  name: '',
  components:{Popup,Selector , Group},
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
        timer:null,
        msg:'获取',
        partList:[],
        currentPart:'',
        currentSaleman:'',
        salesmanList:[],
        code:''
    }
  },

  mounted(){
    //   http://pwmall.parkwing.cn/room/#/writeMsgParkTicket?token=b1F6NDc2RWJfbXJDclBMakJQNl9QSTlRYndmNA==
    if(window.location.href.indexOf('?') > -1){
      var token = window.location.href.split('?')
      sessionStorage.setItem('openId',decodeURIComponent(token[1].slice(6)))
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
      this.getPartList()
  },
  methods: {
    //   获取部门
    getPartList(){
         this.$fetch({
            url: process.env.on + `/room/dept/pageList`,
            method: 'POST',
            data:{
                 "limit": "100",
                "page": "1",
                "parentid": "1"
            }
        }).then((res) => {
           this.partList = res.list.map(item =>{
               return {
                   key:item.id,
                   value:item.name
               }
           })
        })
    },
    //   部门change
      parkChangeHandle(){
         this.$fetch({
            url: process.env.on + `/room/userinfo/pageList`,
            method: 'POST',
            data:{
                 "limit": "100",
                "page": "1",
                "department": this.currentPart
            }
        }).then((res) => {
           this.salesmanList = res.list.map(item =>{
               return {
                   key:item.mobile,
                   value:item.name.slice(0,1)+'*'+item.name.slice(2),
                   
               }
           })
        })
      },
    //   人员change
    salemanChangeHandle(){
        this.mobile = this.currentSaleman.slice(0,3)+'****'+this.currentSaleman.slice(7)
    },
    //   发送验证码
      sendCode(){
          var self = this
          if(!this.timer){
              this.$fetch({
                    url: process.env.on + `/room/sms/send`,
                    method: 'POST',
                    data:{
                        mobile:this.currentSaleman
                    }
                }).then((res) => {
                   if(res.status == 200){
                       Toast('发送成功！')
                   }else{
                       Toast('发送失败！')
                   }
                })
              this.msg = 60
              this.timer = setInterval(() => {
                  console.log(self.msg)
                    if(self.msg>0){
                        self.msg -=1 
                    }else{
                        self.msg = '获取'
                        clearInterval(self.timer)
                        self.timer = null
                    }
              }, 1000);
          } 
        
        
      },
    bindOrder(){
        console.log(this.currentPart)
        var r1 = (this.currentPart+'').trim() == ''
        var r2 = (this.currentSaleman+'').trim() == ''
        var r3 = (this.code+'').trim() == ''
        if(r1 || r2 || r3){
            Toast('请填写完整信息！')
            return 
        }
        if(!(/^1[34578]\d{9}$/.test(this.currentSaleman))){ 
            Toast('手机号码格式有误！')
            return false; 
        } 
      Indicator.open('正在加载...');
      this.$fetch({
        url: process.env.on + `/room/employee/bind`,
        method: 'post',
        data:{
            "weixinid":sessionStorage.getItem('openId'),
            "mobile":this.currentSaleman,
            "code":this.code,
            "status":"1"
        }
      }).then((res) => {
         Indicator.close()
         if(res.status == 200){
             Toast('绑定成功！')
             this.$router.push('/')
         }else{
             Toast('绑定失败！')
         }
      }).catch(err=>{
          Indicator.close()
      })
    },
  }
}
</script>

<style lang='scss' scoped>
/deep/ .vux-selector::before{
    display: none;
    
}
/deep/ .vux-selector{
    border-right: none;
}
 .container{
     padding: 10px;
     .tip{
         color: rgb(252,85,65);
         font-size: 14px;
     }
     .c-blue{
         color:blue;
         float: right;
     }
     input:disabled {
         color: gray;
         background-color: transparent;
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
                
                 padding-right: 10px;
                 
                 text-align: right;
             }
             div:first-child{
                 width: 100px;
                  border-right: 1px solid #eee;
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
