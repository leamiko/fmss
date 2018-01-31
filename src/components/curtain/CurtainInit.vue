<template>
    <section>
            <h2>帐套：{{curtain.name}}</h2>
            <!--工具条-->
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" size="mini">
                <el-form-item>
                    <el-button size="mini" type="primary" @click="checkSum" :loading="checkSumLoading">试算</el-button>
                </el-form-item>
                <el-form-item style="color:gray;">
                    {{checkResult}} &nbsp;&nbsp; {{checkData}}
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="subjects" highlight-current-row v-loading="listLoading" style="width: 100%;" size="mini" :row-class-name="tableRowClassName">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="code" label="科目编码" width="120">
            </el-table-column>
            <el-table-column prop="name" label="科目名称" width="260">
            </el-table-column>
            <el-table-column prop="balance" label="方向" width="140" :formatter="formatBalance">
            </el-table-column>
            <el-table-column label="期初余额" width="200">
                <template slot-scope="scope">
                    <input v-model="scope.row.amount" @keyup.enter="$event.target.blur()" @blur="submitRow(scope.row)" :disabled="scope.row.isLeaf == 'N'" />
                </template>
            </el-table-column>
        </el-table>

    </section>
</template>

<script>
// import util from '../../common/js/util'
import { getCurtainById, getInitCurtainBalance, updateCurtainBalance, checkSum } from '../../api/index'
export default {
  data () {
    return {
      curtain: {
        name: '',
        id: this.$route.params.curtainId
      },
      listLoading: false,
      checkSumLoading: false,
      checkResult: '',
      checkData: '',
      comFlag: '',
      subjects: [{
        code: '',
        name: '',
        balance: '',
        amount: ''
      }]
    }
  },
  methods: {
    // 显示余额方向
    formatBalance: function (row, column) {
      if (row.balance) {
        return row.balance === 'debit' ? '借方' : '贷方'
      }
      return ''
    },
    getCurtain () {
      let para = { 'curtainId': this.curtain.id }
      getCurtainById(para).then((res) => {
        this.curtain = res.data
      })
    },
    getBalanceList () {
      this.listLoading = true
      let para = { 'curtainId': this.curtain.id }
      getInitCurtainBalance(para).then((res) => {
        this.subjects = res.data
        this.listLoading = false
      })
    },
    tableRowClassName ({row, rowIndex}) {
      if (row.isLeaf === 'N') {
        return 'warning-row'
      }
      return ''
    },
    submitRow (row) {
      // alert(row.amount)
      // 往父级科目汇总,获得由哪些父级科目需要更新
      let para = {}
      para.curtainId = this.curtain.id + ''
      para.subs = [{
        code: row.code,
        amount: row.amount
      }]
      let code = row.code
      while (code.length > 4) {
        let len = code.length - 3
        code = code.substring(0, len)
        let amount = 0
        let objNew = {}
        this.subjects.forEach(function (obj) {
          if (obj.code.length > len && obj.code.substring(0, len) === code && obj.amount) {
            amount += parseFloat(obj.amount)
            // console.log('---' + obj.amount)
          }
          if (obj.code.length === len && obj.code.substring(0, len) === code) {
            objNew = obj
          }
        })
        this.$set(objNew, 'amount', amount.toFixed(2))
        para.subs.push({
          code: code,
          amount: amount.toFixed(2) + ''
        })
      }
      updateCurtainBalance(para).then((res) => {
        if (res.data.errno !== '0') {
          this.$message.error('保存失败!请稍后重试')
        }
      })
    },
    checkSum () {
      this.checkSumLoading = true
      let para = { curtainId: this.curtain.id }
      checkSum(para).then((res) => {
        this.checkSumLoading = false
        this.checkResult = res.data.errno === '1' ? '试算成功' : '试算失败'
        this.checkData = res.data.resultData
      })
    }
  },
  mounted () {
    var user = sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      this.comFlag = user.username
    }
    this.getCurtain()
    this.getBalanceList()
  }
}
</script>
<style lang="stylus">
.el-table 
  .warning-row
    background: oldlace
</style>