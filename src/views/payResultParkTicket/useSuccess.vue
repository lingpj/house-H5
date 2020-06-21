<template>
  <div class='container'>
    <div class="box">
      <div class="img"></div>
      <div class="resultBox"><img src="../../assets/img/success.png" alt=""><span>使用成功</span></div>
    </div>
    <!-- <p>恭喜您！已经抢到{{$route.query.park}}{{$route.query.room}}房间</p> -->
    <!-- <footer @click="$router.push('/mine')">立即分享使用</footer> -->
    <footer v-if="other!= 2"    @click="$router.push('/mine')">返回首页</footer>
    <!-- <footer>立即补全信息</footer> -->
  </div>
</template>

<script>
export default {
  name: '',
  components:{},
  data () {
    return {
      other:parseInt(sessionStorage.getItem('other'))
    }
  },

  mounted(){
     
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
 .container{
   padding-top: 20px;
   .box{
     .img{
       width: 243px;
       height: 132px;
       background: url('../../assets/img/chenggong2.png') no-repeat;
       background-size: 100% 100%;
       margin: 0 auto;
     }
     img{
       width: 62px;
       margin-bottom: 15px;
     }
     .resultBox{
       text-align: center;
       display: flex;
       flex-direction: column;
       align-items: center;
       position: relative;
       top: -80px;
       font-size: 20px;
     }
     width: calc(100% - 40px);
     margin: 0 auto;
   }
   p{
     margin-top: -30px;
     text-align: center;
   }
   footer{
         color: #fff;
         border-radius: 5px;
         text-align: center;
         height: 43px;
         width: 335px;
         background-color: rgb(45,133,237);
         margin: 20px auto;
         line-height: 43px;
     }
     
 }
</style>
