<template>
  <div id="app">
    <transition name="fade"
                mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="stylus">
body
  margin: 0px
  padding: 0px
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif
  font-size: 14px
  -webkit-font-smoothing: antialiased
#app
  position: absolute
  top: 0px
  bottom: 0px
  width: 100%
.el-submenu [class^=fa]
  vertical-align: baseline
  margin-right: 10px
.el-menu-item [class^=fa] 
  vertical-align: baseline
  margin-right: 10px
.toolbar 
  background: #f2f2f2
  padding: 10px
  // border:1px solid #dfe6ec;
  margin: 10px 0px
  .el-form-item
    margin-bottom: 10px
.fade-enter-active, .fade-leave-active 
  transition: all .2s ease
.fade-enter, .fade-leave-active
  opacity: 0
//重写按钮  
// .el-button
//   padding: 10px 16px;
// .el-button--small, .el-button--small.is-round
//   padding: 7px 9px 
// 重写table  
// .el-table 
//   td, th
//     padding: 5px 0
// 重写form
// .el-form
//   .el-form-item
//     margin-bottom: 10px
//   .el-form-item__error
//     padding-top: 0px  
//   .el-input__inner
//     height: 36px
//   .el-input-number
//     line-height: 34px;

</style>
