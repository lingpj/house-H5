<template>
  <div id="app">
    <transition name="fade">
      <router-view class="router-view" />
    </transition>
  </div>
</template>

<script>


export default {
  name: 'App',
  
  data() {
    return {
      
    }
  },
  
  
}
</script>

<style lang="scss">
@import './styles/index.scss'; // 全局自定义的css样式
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // background-color: #fff;
  max-height: calc(100% + 1px);
  color: rgba(0,0,0,.75);
}

.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.router-view {
  width: 100%;
  max-height: calc(100% + 1px);
  // position: absolute;
  // margin: 0 auto;
 
  // overflow-y: auto;
  // overflow-x: hidden;
  // background-color: #fff;
}
</style>
