<template>
    <section>
        <div class="subalance-list">
      <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item>
                    <div class="block">
                      <el-date-picker
                        v-model="filters.month"
                        type="month"
                        placeholder="选择月份">
                      </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button-group size="mini">
                      <el-button type="primary" icon="el-icon-search" @click="getBalanceList">查询</el-button>
                      <el-button type="primary" icon="el-icon-edit" @click="chargeUp" :loading="chargeUpLoading">登账</el-button>
                      <el-button type="primary" icon="el-icon-download" :loading="exportLoading" @click="exportExcel">导出</el-button>
                      <el-button type="primary" icon="el-icon-sort" @click="checkSum" :loading="checkSumLoading">试算</el-button>
                    </el-button-group>
                </el-form-item>
                <el-form-item style="color:gray;">
                    {{checkResult}} &nbsp;&nbsp; {{checkData}}
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="subjects" highlight-current-row v-loading="listLoading" size="mini" :row-class-name="tableRowClassName" @row-click="expandLine" :height="screenHeight">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="code" label="科目编码" width="120">
            </el-table-column>
            <el-table-column prop="name" label="科目名称" width="192">
            </el-table-column>
            <el-table-column label="期初余额">
              <el-table-column prop="curtainBalance.oriDebit" label="借方" width="100"></el-table-column>
              <el-table-column prop="curtainBalance.oriCredit" label="贷方" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="本期发生">
              <el-table-column prop="curtainBalance.debitAt" label="借方" width="100"></el-table-column>
              <el-table-column prop="curtainBalance.creditAt" label="贷方" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="期末余额">
              <el-table-column prop="curtainBalance.debit" label="借方" width="100"></el-table-column>
              <el-table-column prop="curtainBalance.credit" label="贷方" width="100"></el-table-column>
            </el-table-column>
            
        </el-table>
      </div>
    </section>
</template>

<script>
import util from '../../common/js/util'
import { getSubalances, chargeUp, checkSum, exportBalanceExcel } from '../../api/index'
export default {
  data () {
    return {
      screenHeight: document.documentElement.clientHeight - 200,
      curtainId: '',
      sysUserName: '',
      filters: {
        month: ''
      },
      listLoading: false,
      chargeUpLoading: false,
      checkSumLoading: false,
      exportLoading: false,
      checkResult: '',
      checkData: '',
      comFlag: '',
      expandCodes: [], // 需要展开的父类科目编号的集合
      allSubjects: [],
      subjects: [{
        code: '',
        name: '',
        balance: '',
        amount: ''
      }]
    }
  },
  methods: {
    checkMonth () {
      let month = this.filters.month
      if (!month) {
        this.$message({
          message: '先选择月份',
          type: 'warning'
        })
        return false
      }
      return true
    },
    getBalanceList () {
      this.listLoading = true
      if (!this.checkMonth()) {
        this.listLoading = false
        return
      }
      let monthStr = util.formatDate.format(this.filters.month, 'yyyy-MM')
      let para = { curtainId: this.curtainId, month: monthStr }
      getSubalances(para).then((res) => {
        this.allSubjects = res.data
        this.listLoading = false
        this.filterSubjects()
      })
    },
    chargeUp () {
      if (this.chargeUpLoading) {
        return
      }
      this.chargeUpLoading = true
      if (!this.checkMonth()) {
        this.chargeUpLoading = false
        return
      }
      let monthStr = util.formatDate.format(this.filters.month, 'yyyy-MM')
      let para = { curtainId: this.curtainId, month: monthStr }
      chargeUp(para).then((res) => {
        if (res.data.message === '1') {
          this.$message.success('登账成功')
        } else {
          this.$message.error(res.data.message)
        }
        this.chargeUpLoading = false
      })
    },
    filterSubjects () {
      this.subjects = this.allSubjects.filter(subject => {
        if (subject.code.length === 4) {
          // console.log(subject)
          let cb = subject.curtainBalance
          if (!cb || (!cb.oriDebit && !cb.oriCredit && !cb.debitAt && !cb.creditAt && !cb.debit && !cb.credit)) {
            return false
          }
          return true
        } else {
          let code = subject.code.substring(0, 4)
          if (this.expandCodes.indexOf(code) !== -1) {
            return true
          }
        }
        return false
      })
    },
    tableRowClassName ({row, rowIndex}) {
      if (row.isLeaf === 'N') {
        return 'warning-row'
      } else if (row.isLeaf === 'G') {
        return 'gray-row'
      }
      return ''
    },
    expandLine (row) {
      if (row.isLeaf !== 'N') {
        return
      }
      let code = row.code
      if (this.expandCodes.indexOf(code) !== -1) {
        this.expandCodes.splice(this.expandCodes.indexOf(code), 1)
      } else {
        this.expandCodes.push(code)
      }
      this.filterSubjects()
    },
    checkSum () {
      this.checkSumLoading = true
      let monthStr = util.formatDate.format(this.filters.month, 'yyyy-MM')
      let para = { curtainId: this.curtainId, month: monthStr }
      checkSum(para).then((res) => {
        this.checkSumLoading = false
        this.checkResult = res.data.errno === '1' ? '试算成功' : '试算失败'
        this.checkData = res.data.resultData
      })
    },
    exportExcel () {
      let monthStr = util.formatDate.format(this.filters.month, 'yyyy-MM')
      let para = { curtainId: this.curtainId, month: monthStr }
      this.exportLoading = true
      exportBalanceExcel(para).then((res) => {
        this.exportLoading = false
        if (res.data) {
          util.downloadExcel(res)
        }
      })
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
.el-table 
  .warning-row
    background: oldlace
  .gray-row
    background: #f17063
</style>