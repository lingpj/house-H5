<template>
  <div class="container">
    <div>
      <h2>阿萨德</h2>
      <table>
        <tr>
          <td>所属楼栋</td>
          <td>房号</td>
        </tr>
        <tr>
          <td>1</td>
          <td>2</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },

  mounted() {
      this.initData()
  },
  methods: {
    initData() {
      this.$fetch({
        url: process.env.on + "/room/parkinfo/name/list",
        method: "get",
        params: {}
      }).then(res=>{
          console.log(res)
      })
    }
  }
};
</script>

<style lang='scss' scoped>
.container {
  padding: 10px;
  h2 {
    margin-bottom: 5px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid lightgray;
    margin-bottom: 50px;
    td {
      font-size: 14px;
      border: 1px solid lightgray;
      width: 50%;
      padding: 5px 10px;
      text-align: center;
    }
  }
}
</style>
