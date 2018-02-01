<template>
  <section style="width:800px;margin:auto;">
      <p class="voucher-title">
        <span>记</span><span>账</span><span>凭</span><span>证</span>
      </p>
        <p style="margin:0;width:320px;display:inline-block;">核算单位：[{{curtain.code}}]{{curtain.name}}</p>
        <p style="margin:0;width:300px;display:inline-block;">制单时间：{{voucher.createDate}}</p>
        <p style="margin:0;width:160px;display:inline-block;">凭证号：{{voucher.code}}</p>
         <!--列表-->
        <el-table :data="details" highlight-current-row v-loading="listLoading" border style="width: 800px;border: 1px solid #666666;color:black;" size="mini">
            <el-table-column prop="description" label="摘要" width="250">
            </el-table-column>
            <el-table-column prop="subject.fullName" label="会计科目" width="250">
            </el-table-column>
            <el-table-column prop="debit" label="借方金额" width="150" :formatter="formatNumberDebit">
            </el-table-column>
            <el-table-column prop="credit" label="贷方金额" width="150" :formatter="formatNumberCredit">
            </el-table-column>
        </el-table>
        <p style="margin-top:6px;width:160px;display:inline-block;">财务主管：</p>
        <p style="margin-top:6px;width:160px;display:inline-block;">记账：{{voucher.jiName}}</p>
        <p style="margin-top:6px;width:160px;display:inline-block;">复核：{{voucher.shenName}}</p>
        <p style="margin-top:6px;width:150px;display:inline-block;">出纳：{{voucher.chuName}}</p>
        <p style="margin-top:6px;width:150px;display:inline-block;">制单：{{voucher.zhiName}}</p>
  </section>
</template>

<script>
import { getVoucherPrintInfo } from '../../api/index'
import util from '../../common/js/util'
export default {
  data () {
    return {
      voucherId: this.$route.params.voucherId,
      details: [],
      voucher: {},
      curtain: {}
    }
  },
  methods: {
    // 格式化数字，显示
    formatNumberDebit: function (row, column) {
      if (row.debit) {
        return util.formatLongNumber(row.debit)
      }
    },
    formatNumberCredit: function (row, column) {
      if (row.credit) {
        return util.formatLongNumber(row.credit)
      }
    },
    getStatusOptions: function () {
      let para = {voucherId: this.voucherId}
      getVoucherPrintInfo(para).then((res) => {
        this.details = res.data.details
        this.voucher = res.data.voucher
        this.curtain = res.data.curtain
        this.$nextTick(() => {
          window.print()
        })
      })
    }
  },
  mounted () {
    // console.log(this.$route)
    this.getStatusOptions()
  }
}
</script>
<style lang="stylus">
.voucher-title
  width: 128px
  margin-left: 336px
  color:#008080
  border-bottom:2px solid #008080
  margin-bottom:6px
  font-size: 24px
  span
    padding: 0 4px 0 4px
    border-bottom:2px solid #008080
</style>