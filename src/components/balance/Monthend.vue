<template>
    <section>
      <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" size="mini">
                <el-form-item>
                    <div class="block">
                      <el-date-picker
                        v-model="month"
                        type="month"
                        placeholder="选择月份">
                      </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                  <el-button-group size="mini">
                    <el-button type="primary" icon="el-icon-circle-check-outline" @click="autoSettle" :loading="transferLoading">自动结转</el-button>
                    <el-button type="primary" icon="el-icon-remove-outline" @click="autoSettleCancel" :loading="cancel1Loading">反结转</el-button>
                    <el-button type="primary" icon="el-icon-circle-check" @click="chargeUpMonth" :loading="autoSettleLoading">月末结账</el-button>
                    <el-button type="primary" icon="el-icon-remove" @click="chargeUpCancel" :loading="cancel2Loading">反结账</el-button>
                    <el-button type="primary" icon="el-icon-sort" @click="checkSum" :loading="checkSumLoading">试算</el-button>
                  </el-button-group>
                </el-form-item>
                <el-form-item style="color:gray;">
                    {{checkResult}} &nbsp;&nbsp; {{checkData}}
                </el-form-item>
            </el-form>
            <el-steps :active="active" finish-status="success" style="margin-top:50px;">
              <el-step title="审核"></el-step>
              <el-step title="结转"></el-step>
              <el-step title="月末结账"></el-step>
              <el-step title="生成报表"></el-step>
            </el-steps>
        </el-col>

    </section>
</template>

<script>
import util from '../../common/js/util'
import { autoSettle, checkSum, chargeUp, autoSettleCancel, chargeUpCancel, getActive } from '../../api/index'
export default {
  data () {
    return {
      curtainId: '',
      sysUserName: '',
      active: 0,
      month: '',
      transferLoading: false,
      autoSettleLoading: false,
      checkSumLoading: false,
      cancel1Loading: false,
      cancel2Loading: false,
      checkResult: '',
      checkData: '',
      comFlag: ''
    }
  },
  methods: {
    checkMonth () {
      let month = this.month
      if (!month) {
        this.$message({
          message: '先选择月份',
          type: 'warning'
        })
        return false
      }
      return true
    },
    getActive () {
      if (!this.checkMonth()) {
        return
      }
      let monthStr = util.formatDate.format(this.month, 'yyyy-MM')
      let para = { curtainId: this.curtainId, month: monthStr }
      getActive(para).then((res) => {
        this.active = res.data.active
      })
    },
    autoSettle () {
      this.transferLoading = true
      if (!this.checkMonth()) {
        this.transferLoading = false
        return
      }
      let monthStr = util.formatDate.format(this.month, 'yyyy-MM')
      let para = { curtainId: this.curtainId, month: monthStr }
      autoSettle(para).then((res) => {
        if (res.data.message === '1') {
          this.getActive()
          this.$message.success('结转成功')
        } else {
          this.$message.error(res.data.message)
        }
        this.transferLoading = false
      })
    },
    chargeUpMonth () {
      if (this.chargeUpLoading) {
        return
      }
      this.chargeUpLoading = true
      if (!this.checkMonth()) {
        this.chargeUpLoading = false
        return
      }
      let monthStr = util.formatDate.format(this.month, 'yyyy-MM')
      let para = { curtainId: this.curtainId, month: monthStr, type: 'month' }
      chargeUp(para).then((res) => {
        if (res.data.message === '1') {
          this.getActive()
          this.$message.success('月末结账成功')
        } else {
          this.$message.error(res.data.message)
        }
        this.chargeUpLoading = false
      })
    },
    // 反结转
    autoSettleCancel () {
      this.$confirm('反结转，将删除已经生成的结转凭证，确定反结转吗', '提示', {
        type: 'warning'
      }).then(() => {
        this.cancel1Loading = true
        if (!this.checkMonth()) {
          this.cancel1Loading = false
          return
        }
        let monthStr = util.formatDate.format(this.month, 'yyyy-MM')
        let para = {curtainId: this.curtainId, month: monthStr}
        autoSettleCancel(para).then((res) => {
          this.cancel1Loading = false
          if (res.data.message === '1') {
            this.getActive()
            this.$message({
              message: '反结转成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
      }).catch(() => {
      })
    },
    // 反结账
    chargeUpCancel () {
      this.$confirm('反结账，将删除月末结账，确定反结账吗', '提示', {
        type: 'warning'
      }).then(() => {
        this.cancel2Loading = true
        if (!this.checkMonth()) {
          this.cancel2Loading = false
          return
        }
        let monthStr = util.formatDate.format(this.month, 'yyyy-MM')
        let para = {curtainId: this.curtainId, month: monthStr}
        chargeUpCancel(para).then((res) => {
          this.cancel2Loading = false
          if (res.data.message === '1') {
            this.getActive()
            this.$message({
              message: '反结账成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
      }).catch(() => {
      })
    },
    checkSum () {
      this.checkSumLoading = true
      let monthStr = util.formatDate.format(this.month, 'yyyy-MM')
      let para = {curtainId: this.curtainId, month: monthStr}
      checkSum(para).then((res) => {
        this.checkSumLoading = false
        this.checkResult = res.data.errno === '1' ? '试算成功' : '试算失败'
        this.checkData = res.data.resultData
      })
    }
  },
  watch: {
    month: function (newMonth) {
      this.getActive()
    }
  },
  mounted () {
    var user = sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      this.curtainId = user.curtain.id
      this.sysUserName = user.name
    }
    // this.getBalanceList()
  }
}
</script>
<style lang="stylus">
</style>