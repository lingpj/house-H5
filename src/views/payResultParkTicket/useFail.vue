<template>
  <div class='container'>
    <div class="box">
      <div class="img"></div>
      <div class="resultBox"><img src="../../assets/img/fail.png" alt=""><span>使用失败</span></div>
    </div>
    <!-- <p>很遗憾您未抢到该房源，若其抢到房源未支付，您仍有机会抢到该房源，尽情关注！</p> -->
    <footer  v-if="other!= 2"   @click="$router.push('/')">返回首页</footer>
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

  mounted(){},
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
       visibility: hidden;
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
     width: calc(100% - 40px);
     margin-left: auto;
     margin-right: auto;
     line-height: 25px;
   }
   footer{
         color: #fff;
         border-radius: 5px;
         text-align: center;
         height: 43px;
         width: 335px;
        //  background-color: rgb(233,18,44);
        color: rgb(233,18,44);
         border: 1px solid rgb(233,18,44);
         margin: 20px auto;
         line-height: 43px;
     }
 }
</style>
