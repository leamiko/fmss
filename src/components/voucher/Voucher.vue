<template>
  <section>
    <div class="voucher-list">
      <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item>
                    <div class="block">
                      <span class="demonstration">日期</span>
                      <el-date-picker
                        v-model="filters.date"
                        type="daterange"
                        :clearable="false"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    凭证号
                    <el-input placeholder="开始编号" v-model="filters.startCode" style="width:40%;"></el-input>
                    -
                    <el-input placeholder="结束编号" v-model="filters.endCode" style="width:40%;"></el-input>
                </el-form-item>
                 <el-form-item>
                    状态
                    <el-select v-model="filters.status" clearable placeholder="请选择" >
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    制单人
                    <el-select v-model="filters.zhiName" clearable placeholder="请选择" >
                      <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    审核人
                    <el-select v-model="filters.shenName" clearable placeholder="请选择" >
                      <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    关联号
                    <el-input placeholder="开始编号" v-model="filters.sysCode" style="width:70%;"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button-group size="mini">
                    <el-button type="primary" icon="el-icon-search" @click="getVouchers">查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
                    <el-button type="success" icon="el-icon-check" :loading="auditLoading" @click="handleAudit">审核</el-button>
                    <el-button type="success" icon="el-icon-success" :loading="auditLoading" @click="handleAuditAll">审核全部</el-button>
                  </el-button-group>
                </el-form-item>
            </el-form>
        </el-col>
         <!--列表-->
        <el-table :data="vouchers" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" size="mini">
            <el-table-column type="selection" width="40" :selectable="handleStatus">
            </el-table-column>
            <el-table-column type="index" width="40" >
            </el-table-column>
            <el-table-column prop="createDate" label="记账日期" width="100">
            </el-table-column>
            <el-table-column prop="code" label="凭证编号" width="80">
            </el-table-column>
            <el-table-column prop="sysCode" label="业务编号" width="80">
            </el-table-column>
            <el-table-column prop="description" label="摘要" width="100">
            </el-table-column>
            <el-table-column prop="debit" label="借方金额合计" width="100" :formatter="formatNumberDebit">
            </el-table-column>
            <el-table-column prop="credit" label="贷方金额合计" width="100" :formatter="formatNumberCredit">
            </el-table-column>
            <el-table-column prop="zhiName" label="制单人" width="80">
            </el-table-column>
            <el-table-column prop="shenName" label="审核人" width="80">
            </el-table-column>
            <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row, 'U')">查看</el-button>
                    <el-button size="mini" type="success" v-show="handleStatus(scope.row,scope.$index)" @click="handleEdit(scope.$index, scope.row,'S')">审核</el-button>
                    <el-button size="mini" type="warning" v-show="scope.row.voucherStatus === 'G'" @click="cancelVouchers(scope.row)">取消</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
          <el-pagination layout="prev, pager, next, total" @current-change="handleCurrentChange" :page-size="10" :total="pagetotal" style="float:right;">
          </el-pagination>
  </div>
    <!--凭证-->
    <el-dialog title="" :visible.sync="voucherVisible" width="660px" :close-on-click-modal="false" >
      <voucherdetail :curtainId="curtainId" :voucherFormStatus="voucherFormStatus" :vouVisible="voucherVisible" :voucherId="voucherId" v-on:callbackSave="callbackSave"></voucherdetail>
    </el-dialog>
  </section>
</template>

<script>
import voucherdetail from './VoucherDetail'
import { getVouchers, getUserList, getStatusOptions, auditVouchers, auditAllVouchers, cancelAudit } from '../../api/index'
import util from '../../common/js/util'
export default {
  data () {
    return {
      curtainId: '',
      voucherId: '',
      sysUserName: '',
      listLoading: false,
      auditLoading: false, // 列表审核按钮
      auditOneLoading: false, // 凭证内部审核按钮
      subjectCode: '',
      userOptions: [], // 查询人员
      statusOptions: [], // 凭证状态合集
      sels: [], // 列表选中列
      vouchers: [],
      filters: {
        date: util.getMonthDates(),
        startDate: '',
        endDate: '',
        startCode: '',
        endCode: '',
        zhiName: '',
        shenName: '',
        status: '',
        sysCode: '',
        page: 1
      },
      pagetotal: 0,
      voucherVisible: false,
      seleSubVisible: false,
      seleSub: {},
      index: 0, // 当前光标所在的index
      voucherFormStatus: '' // 新增：A；修改：U；审核：S
    }
  },
  components: {
    voucherdetail
  },
  methods: {
    // 格式化数字，显示
    formatNumberDebit: function (row, column) {
      return util.formatLongNumber(row.debit)
    },
    formatNumberCredit: function (row, column) {
      return util.formatLongNumber(row.credit)
    },
    setUserOptions: function () {
      let para = {
        curtainId: this.curtainId
      }
      getUserList(para).then((res) => {
        this.userOptions = res.data.map(function (user) {
          return {
            value: user.name,
            label: user.name
          }
        })
        this.userOptions.push({
          value: 'auto',
          label: 'auto'
        }, {
          value: 'chong',
          label: 'chong'
        }, {
          value: 'zhuan',
          label: 'zhuan'
        })
      })
    },
    getStatusOptions: function () {
      getStatusOptions().then((res) => {
        this.statusOptions = res.data
      })
    },
    handleStatus: function (row, index) {
      if (row.voucherStatus === 'C') {
        return true
      }
      return false
    },
    handleAdd () {
      this.voucherFormStatus = 'A'
      this.voucherVisible = true
    },
    handleEdit (index, row, formStatus) {
      this.voucherId = row.id
      this.voucherFormStatus = formStatus
      this.voucherVisible = true
    },
    callbackSave () {
      this.getVouchers()
      this.voucherVisible = false
    },
    handleCurrentChange (val) {
      this.filters.page = val
      this.getVouchers()
    },
    getVouchers () {
      this.filters.curtainId = this.curtainId
      this.filters.startDate = util.formatDate.format(this.filters.date[0], 'yyyy-MM-dd')
      this.filters.endDate = util.formatDate.format(this.filters.date[1], 'yyyy-MM-dd')
      let para = this.filters
      this.listLoading = true
      getVouchers(para).then((res) => {
        this.vouchers = res.data.voucherList
        this.pagetotal = res.data.pageTotal
        this.listLoading = false
      })
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    handleAudit: function () { // 审核选项
      var ids = this.sels.map(item => item.id)
      if (ids.length === 0) {
        this.$message.error('请先选择凭证!')
        return
      }
      this.$confirm(`共${ids.length}张凭证，确认审核吗？`, '提示', {}).then(() => {
        this.auditLoading = true
        let para = {
          ids: ids.join(','),
          userName: this.sysUserName
        }
        auditVouchers(para).then((res) => {
          this.auditLoading = false
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.getVouchers()
        })
      })
    },
    cancelVouchers: function (row) {
      let para = {
        id: row.id
      }
      cancelAudit(para).then((res) => {
        if (res.data.message === '1') {
          this.$message({
            message: '取消审核成功',
            type: 'success'
          })
          this.getVouchers()
        } else {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
        }
      })
    },
    auditVoucher: function () { // 审核某个凭证
      this.$confirm(`确认审核该凭证吗？`, '提示', {}).then(() => {
        this.auditOneLoading = true
        let para = {
          ids: this.voucherForm.id,
          userName: this.sysUserName
        }
        auditVouchers(para).then((res) => {
          this.auditOneLoading = false
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.getVouchers()
          this.voucherVisible = false
        })
      })
    },
    handleAuditAll: function () { // 审核所有未审核
      this.auditLoading = true
      this.filters.curtainId = this.curtainId
      this.filters.startDate = util.formatDate.format(this.filters.date[0], 'yyyy-MM-dd')
      this.filters.endDate = util.formatDate.format(this.filters.date[1], 'yyyy-MM-dd')
      let para = this.filters
      getVouchers(para).then((res) => {
        this.vouchers = res.data.voucherList
        this.pagetotal = res.data.pageTotal
      }).then(() => {
        this.$confirm(`共${this.pagetotal}张凭证，确认审核吗？`, '提示', {}).then(() => {
          para.userName = this.sysUserName
          auditAllVouchers(para).then((res) => {
            this.auditLoading = false
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.getVouchers()
          })
        }).catch(() => {
          this.auditLoading = false
        })
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
    this.getVouchers()
    this.setUserOptions()
    this.getStatusOptions()
  }
}
</script>
<style lang="stylus">
</style>