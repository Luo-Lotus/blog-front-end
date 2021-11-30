<script setup lang="ts">
import Header from "./views/header/header.vue"
</script>

<template>

  <Header></Header>
  <div id="router-view">
    <router-view></router-view>
  </div>
</template>

<style>
#app{
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  height: 100vh;
  background-attachment: scroll;
}
body{
  background: linear-gradient(to top, #94b0b7, #c2c8c5) fixed;
}
#router-view{
  margin:20px;
  margin-bottom: 0px;
}

@media screen and (max-width: 1280px){
  .el-affix .el-affix--fixed{
      position: static ;
  }
}

</style>