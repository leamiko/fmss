<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">华夏管家FMSS</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="curtainId">
      <el-select v-model="ruleForm.curtainId" placeholder="帐套" v-show="curtainVisible">
        <el-option
          v-for="item in curtainOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>
<script>
  import { requestLogin, getRoleByLoginName } from '../../api/index'
  import _ from 'lodash'
  // import NProgress from 'nprogress'
  export default {
    data () {
      return {
        logining: false,
        role: '',
        curtainOptions: [],
        ruleForm: {
          account: '',
          checkPass: '',
          curtainId: ''
        },
        rules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          checkPass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          curtainId: [
            {type: 'number', required: true, message: '请选择帐套', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      account: function () {
        return this.ruleForm.account
      },
      curtainVisible: function () {
        return this.role !== 'ROLE_ADMIN'
      }
    },
    methods: {
      requestAccount: _.debounce(
        function () {
          let para = {
            'loginName': this.account
          }
          if (this.account !== '') {
            this.listLoading = true
            getRoleByLoginName(para).then((res) => {
              this.role = res.data.role
              // this.curtainOptions = res.data.curtains
              this.curtainOptions = res.data.curtains.map((curtain) => {
                return {
                  value: curtain.id,
                  label: curtain.name
                }
              })
              this.listLoading = false
            })
          }
        },
        // 这是我们为判定用户停止输入等待的毫秒数
        500
      ),
      handleReset () {
        this.$refs.ruleForm.resetFields()
      },
      handleSubmit (ev) {
        // console.log('-' + this.ruleForm.curtainId)
        if (!this.curtainVisible) {
          this.ruleForm.curtainId = 0 // 不需要选择帐套时，直接设置一个帐套
        }
        // console.log('---' + this.ruleForm.curtainId)
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let _this = this
            _this.logining = true
            var loginParams = { username: this.ruleForm.account, password: this.ruleForm.checkPass }
            requestLogin(loginParams).then((response) => {
              _this.logining = false
              console.log(response.data)
              let token = response.data.token
              let user = response.data.user
              if (!token) {
                _this.$message({
                  message: '用户名或密码错误！',
                  type: 'error'
                })
              } else {
                if (this.ruleForm.curtainId !== 0) {
                  user.curtain = { // 设置帐套
                    id: _this.ruleForm.curtainId,
                    name: _this.curtainOptions.find(i => i.value === _this.ruleForm.curtainId).label
                  }
                }
                sessionStorage.setItem('user', JSON.stringify(user))
                sessionStorage.setItem('token', token)
                if (user.role === 'ROLE_ADMIN') {
                  _this.$router.push({ path: '/user' })
                } else {
                  _this.$router.push({ path: '/voucher' })
                }
              }
            }).catch(function (error) {
              _this.logining = false
              var status = error.response.status
              if (status === 403) {
                _this.$message({
                  message: '用户名或密码错误！',
                  type: 'error'
                })
              } else {
                _this.$message({
                  message: '网络错误！',
                  type: 'error'
                })
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    watch: {
      account: function (newAccount) {
        this.requestAccount()
      }
    }
  }
</script>

<style lang="stylus">
  .login-container 
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px
    border-radius: 5px
    -moz-border-radius: 5px
    background-clip: padding-box
    margin: 180px auto
    width: 350px
    padding: 35px 35px 15px 35px
    background: #fff
    border: 1px solid #eaeaea
    box-shadow: 0 0 25px #cac6c6
    .title
      margin: 0px auto 40px auto
      text-align: center
      color: #505458
    .remember 
      margin: 0px 0px 35px 0px
    
  
</style>