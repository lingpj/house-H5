<template>
  <div class="container">
    <v-touch @pinchout="pinchout" @pinchin="pinchin" :style="{transform: 'scale('+scale+')'}">
      <img src="../assets/1.jpg" style="width:100%">
      <br>
      123
    </v-touch>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
        scale:1
    };
  },

  mounted() {},
  methods: {
    // 当缩放 放大的时候触发
    pinchout: function() {
      let _this = this;
      if (_this.scale >= 0 && _this.scale ) {
        _this.scale += 0.1;
      }
    },
    // 当缩放 缩小的时候触发
    pinchin: function() {
      let _this = this;
      if (_this.scale > 1) {
        _this.scale -= 0.1;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.container {
}
</style>
