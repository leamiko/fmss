<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed?'':sysName}}
            </el-col>
            <el-col :span="10">
                <div class="tools" @click.prevent="collapse">
                    <i class="fa fa-align-justify"></i>
                </div>
            </el-col>

            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner"><i class="fa fa-user-o"></i> {{sysUserName}} ({{sysUserCurtain}}) </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <el-menu default-active="$route.path" :router="true" class="el-menu-vertical-demo" :collapse="collapsed">
              <el-submenu v-for="(item,index) in $router.options.routes" :key="index" v-if="checkVisiable(item) && !item.hidden && !item.leaf" :index="index+''">
                <template slot="title" >
                  <i class="menu-i" :class="item.iconCls"></i>
                  <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="(citem,cindex) in item.children" v-if="!citem.hidden" :key="citem.path" :index="citem.path">{{citem.name}}</el-menu-item>
              </el-submenu>
              <el-menu-item v-for="(item,index) in $router.options.routes" :key="index" v-if="!item.hidden && item.leaf" :index="item.path">
                <i class="menu-i" :class="item.iconCls"></i>
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
            </el-menu>
            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <strong class="title">{{$route.name}}</strong>
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                {{ item.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
    </el-row>
</template>

<script>
export default {
  data () {
    return {
      sysName: '华夏管家FMSS',
      collapsed: false,
      sysUserName: '',
      sysUserRole: '',
      sysUserCurtain: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleopen () {
      // console.log('handleopen')
    },
    handleclose () {
      // console.log('handleclose')
    },
    handleselect: function (a, b) {
    },
    checkVisiable: function (item) {
      if (!item.roleCodes) {
        return true
      }
      return item.roleCodes.indexOf(this.sysUserRole) >= 0
    },
    // 退出登录
    logout: function () {
      var _this = this
      this.$confirm('确认退出吗?', '提示', {
        // type: 'warning'
      }).then(() => {
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('token')
        _this.$router.push('/login')
      }).catch(() => {
      })
    },
    // 折叠导航栏
    collapse: function () {
      this.collapsed = !this.collapsed
    },
    showMenu (i, status) {
      this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
    }
  },
  mounted () {
    var user = sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      this.sysUserName = user.name || ''
      this.sysUserRole = user.role
      if (user.role === 'ROLE_ADMIN') {
        this.sysUserCurtain = user.username
      } else {
        this.sysUserCurtain = user.curtain.name
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
    .container 
        position: absolute
        top: 0px
        bottom: 0px
        width: 100%
        .header 
            height: 60px
            line-height: 60px
            background: #20a0ff // 主题颜色
            color:#fff
            .userinfo 
                text-align: right
                padding-right: 35px
                float: right
                .fa-user-o
                    font-size: 24px
                    margin-right: 6px
                .userinfo-inner 
                    cursor: pointer
                    color:#fff
                    img
                        width: 40px
                        height: 40px
                        border-radius: 20px
                        margin: 10px 0px 10px 10px
                        float: right        
            .logo 
                height:60px
                font-size: 22px
                padding-left:20px
                padding-right:20px
                border-color: rgba(238,241,146,0.3)
                border-right-width: 1px
                border-right-style: solid
                img 
                    width: 40px
                    float: left
                    margin: 10px 10px 10px 18px
                .txt 
                    color:#fff
            .logo-width
                width:230px
            .logo-collapse-width
                width:64px
            .tools
                padding: 0px 23px
                width:14px
                height: 60px
                line-height: 60px
                cursor: pointer
        .main 
            display: flex
            position: absolute
            top: 60px
            bottom: 0px
            overflow: hidden
            .el-menu-vertical-demo:not(.el-menu--collapse) 
                background: #eef1f6
                width: 229px
                min-height: 400px
                font-size: 14px
                .el-menu-item
                    background: #e4e8f1
            .menu-i
                color: #48576a
                margin-right: 10px
            .content-container
                flex:1
                overflow-y: scroll
                padding: 20px
                .breadcrumb-container 
                    .title 
                        width: 200px
                        float: left
                        color: #475669
                    .breadcrumb-inner 
                        float: right
                .content-wrapper 
                    background-color: #fff
                    box-sizing: border-box
</style>