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
                  <el-button size="mini" type="primary" @click="getVouchers">查询</el-button>
                  <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
                  <el-button size="mini" type="success" :loading="auditLoading" @click="handleAudit">审核</el-button>
                  <el-button size="mini" type="success" :loading="auditLoading" @click="handleAuditAll">审核全部</el-button>
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
    <el-dialog title="" v-model="voucherForm" :visible.sync="voucherVisible" width="660px" :close-on-click-modal="false" >
    <div class="voucher-div">
      <div v-for="(border,index) in borders" class="background-border" v-bind:style="{right:index*8-1+'px',borderRight:border}"></div>
      <div v-for="(border,index) in borders" class="background-border" v-bind:style="{right:120+index*8+'px',borderRight:border}"></div>
      <p class="title">
        <span>记</span><span>账</span><span>凭</span><span>证</span>
      </p>
      <el-row style="font-size:12px">
        <el-col :span="5"><div class="grid-content bg-purple" style="padding-left:4px;">记&nbsp;字&nbsp; {{voucherForm.code}}</div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple">No：&nbsp; {{voucherForm.sysCode}}</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">制单日期：&nbsp; {{voucherForm.createDate}}</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">附单据数：<input type="text" class="billnum-input" v-model="voucherForm.billNum"></div></el-col>
      </el-row>
      <div class="table-div">
        <ul class="th">
          <li>摘要</li>
          <li class="kemu">科目名称</li>
          <li>借方金额</li>
          <li>贷方金额</li>
        </ul>
        <div class="tbody">
          <ul class="tr" v-for="(item,index) in voucherForm.voucherDetailList">
            <li> <input type="text" v-model="voucherForm.voucherDetailList[index].description"></li>
            <li class="kemu"> <input v-model="voucherForm.voucherDetailList[index].subject.fullName" @keyup.enter="showSubject(voucherForm.voucherDetailList[index].subject.fullName,index)" @change="clearSubject(index)"></li>
            <li class="jie"> <input v-model.lazy="voucherForm.voucherDetailList[index].debit" @blur="formatNumDebitEn(index)" @keyup.enter="$event.target.blur()" @focus="formatNumDebitDe(index)" :class="{'color-red':voucherForm.voucherDetailList[index].debitMinus}"></li>
            <li class="dai"> <input v-model.lazy="voucherForm.voucherDetailList[index].credit" @blur="formatNumCreditEn(index)" @keyup.enter="$event.target.blur()" @focus="formatNumCreditDe(index)" :class="{'color-red':voucherForm.voucherDetailList[index].creditMinus}"></li>
          </ul>
        </div>
        <ul class="heji">
          <li class="heji-li1">&nbsp;
            <span class="heji-li1-span1">票号</span>
            <span class="heji-li1-span2">日期</span>
            <span class="heji-li1-span3">单价</span>
            <span class="heji-li1-span4">数量</span>
          </li>
          <li class="heji-li2">&nbsp;合&nbsp;计</li>
          <li class="heji-li3"> <input type="text" :class="{'color-red':voucherForm.debitMinus}" v-model="voucherForm.debit" readonly="true"></li>
          <li class="heji-li3"> <input type="text" :class="{'color-red':voucherForm.creditMinus}" v-model="voucherForm.credit" readonly="true"></li>
        </ul>
        <ul class="info">
          <li class="info-li1">备注</li>
          <li class="info-li2"> &nbsp;
            <span class="info-li2-span1">项目</span>
            <span class="info-li2-span2">部门</span>
            <span class="info-li2-span3">个人</span>
            <span class="info-li2-span4">客户</span>
            <span class="info-li2-span5">业务员</span>
          </li>
        </ul>
      </div>
      <el-row style="font-size:12px">
        <el-col :span="4"><div class="grid-content bg-purple">&nbsp;</div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple" style="padding-left:4px;">记账</div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple">审核&nbsp;&nbsp;{{voucherForm.shenName}}</div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple">出纳</div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple">制单&nbsp;&nbsp;{{voucherForm.zhiName}}</div></el-col>
      </el-row>
    </div>
    <div class="button-group">
     <el-button-group>
        <el-button type="primary" v-show="voucherForm.voucherStatus==='C' && (voucherFormStatus=='A' || voucherFormStatus=='U')" @click="saveVoucher">保存</el-button>
        <el-button type="primary" v-show="voucherForm.voucherStatus==='C' && voucherFormStatus=='S'" @click="auditVoucher" :loading="auditOneLoading">审核</el-button>
        <el-button type="primary" v-show="voucherFormStatus!=='A'" @click="preVoucher">上一页</el-button>
        <el-button type="primary" v-show="voucherFormStatus!=='A'" @click="nextVoucher">下一页</el-button>
      </el-button-group>
    </div>  
    </el-dialog>
      <!--弹出树形框-->
    <el-dialog title="选择科目" v-model="seleSub" :visible.sync="seleSubVisible" :close-on-click-modal="false" >
      <subjecttree :curtainId="curtainId" :filterCode="subjectCode" v-on:selectedSubject="assignSubject"></subjecttree>
    </el-dialog>
  </section>
</template>

<script>
import subjecttree from '../subject/SubjectTree'
import { getVouchers, getUserList, getStatusOptions, auditVouchers, auditAllVouchers, getVoucherDetails, saveVoucher, getVoucherForm, cancelAudit } from '../../api/index'
import util from '../../common/js/util'
export default {
  data () {
    var borders = [] // 凭证借贷背景线
    for (let i = 0; i < 15; i++) {
      if (i === 2) {
        borders[i] = '1px solid rgba(255,0,0,0.5)'
      } else if ((i - 2) % 3 === 0) {
        borders[i] = '1px solid rgba(0,0,255,0.5)'
      } else {
        borders[i] = '1px solid rgba(128,128,128,0.5)'
      }
    }
    return {
      curtainId: '',
      sysUserName: '',
      listLoading: false,
      auditLoading: false, // 列表审核按钮
      auditOneLoading: false, // 凭证内部审核按钮
      activeName: 'first',
      focusLine: 0, // 在凭证明细里面光标所在的行
      subjectCode: '',
      userOptions: [], // 查询人员
      statusOptions: [], // 凭证状态合集
      sels: [], // 列表选中列
      borders,
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
      voucherFormStatus: '', // 新增：A；修改：U；审核：S
      voucherForm: {
        id: '',
        curtainId: '',
        createDate: '',
        code: '',
        billNum: '',
        jiName: '',
        shenName: '',
        chuName: '',
        zhiName: '',
        debit: '',
        debitMinus: false,
        credit: '',
        creditMinus: false,
        voucherDetailList: ''
      }

    }
  },
  components: {
    subjecttree
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
      this.voucherForm = {
        id: '',
        curtainId: this.curtainId,
        code: '',
        billNum: '',
        jiName: '',
        shenName: '',
        chuName: '',
        zhiName: this.sysUserName,
        debit: '',
        debitMinus: false,
        credit: '',
        creditMinus: false,
        sysCode: '',
        voucherDetailList: [],
        voucherStatus: 'C'
      }
      this.calUlNumber()
    },
    handleEdit (index, row, formStatus) {
      console.log(row)
      let para = {
        voucherId: row.id
      }
      // this.voucherForm = Object.assign({}, row) 采用该方法，不符合深入响应原则，Vue 不能检测到对象属性的添加或删除
      // 下面的方法可以把voucherForm的voucherDetailList属性带着，上面的方法不可以
      this.voucherForm = Object.assign({}, this.voucherForm, row)
      // 处理借贷金额负数
      if (this.voucherForm.debit < 0) {
        this.voucherForm.debitMinus = true
        this.voucherForm.debit = this.voucherForm.debit * -1
      }
      if (this.voucherForm.credit < 0) {
        this.voucherForm.creditMinus = true
        this.voucherForm.credit = this.voucherForm.credit * -1
      }
      this.voucherForm.voucherDetailList = []
      // console.log(this.voucherForm)
      let _this = this
      getVoucherDetails(para).then((res) => {
        res.data.forEach(function (obj) {
          _this.voucherForm.voucherDetailList.unshift(obj)
        })
        this.calUlNumber()
        this.voucherFormStatus = formStatus
        this.voucherVisible = true
      })
      // this.seleSubVisible = true
    },
    clearSubject (index) {
      let fullName = this.voucherForm.voucherDetailList[index].subject.fullName
      if (!fullName) {
        this.voucherForm.voucherDetailList[index].subject.id = ''
      }
    },
    handleCurrentChange (val) {
      // console.log('page---' + val)
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
    showSubject: function (value, index) {
      this.subjectCode = value
      // console.log('--' + value)
      this.index = index
      this.seleSubVisible = true
    },
    assignSubject: function (data) {
      // console.log(data)
      this.voucherForm.voucherDetailList[this.index].subject.id = data.id
      this.voucherForm.voucherDetailList[this.index].subject.fullName = data.name
      this.calUlNumber()
      this.seleSubVisible = false
    },
    calUlNumber: function () {
      let count = 0 // 如果空行小于2，则自动增加两行
      this.voucherForm.voucherDetailList.forEach(function (obj) {
        if (!obj.subject.id) {
          count++
        }
      })
      while (this.voucherForm.voucherDetailList.length < 6 || count < 2) {
        this.voucherForm.voucherDetailList.push({
          description: '',
          subject: {
            id: '',
            name: '',
            fullName: ''
          },
          debit: '',
          debitMinus: false,
          credit: '',
          creditMinus: false
        })
        count++
      }
    },
    formatNumEn: function (val) { // 借贷金额格式化
      let value = parseFloat(val)
      if (value.toString() !== 'NaN') {
        return Math.round(value * 100)
      } else {
        return ''
      }
    },
    formatNumDe: function (val) { // 借贷金额解析
      let value = parseFloat(val)
      if (value !== 0 && value.toString() !== 'NaN') {
        return (value / 100).toFixed(2)
      } else {
        return ''
      }
    },
    formatNumDebitEn: function (index) {
      let value = this.voucherForm.voucherDetailList[index].debit
      value = parseFloat(value)
      if (value < 0) {
        this.voucherForm.voucherDetailList[index].debitMinus = true
        value = value * -1
      } else {
        this.voucherForm.voucherDetailList[index].debitMinus = false
      }
      this.voucherForm.voucherDetailList[index].debit = this.formatNumEn(value)
      this.computerTotal()
    },
    formatNumCreditEn: function (index) {
      let value = this.voucherForm.voucherDetailList[index].credit
      value = parseFloat(value)
      if (value < 0) {
        this.voucherForm.voucherDetailList[index].creditMinus = true
        value = value * -1
      } else {
        this.voucherForm.voucherDetailList[index].creditMinus = false
      }
      this.voucherForm.voucherDetailList[index].credit = this.formatNumEn(value)
      this.computerTotal()
    },
    formatNumDebitDe: function (index) {
      // console.log(this.voucherForm.voucherDetailList[index])
      let value = this.voucherForm.voucherDetailList[index].debit
      if (value && this.voucherForm.voucherDetailList[index].debitMinus) {
        value = value * -1
      }
      this.voucherForm.voucherDetailList[index].debit = this.formatNumDe(value)
    },
    formatNumCreditDe: function (index) {
      let value = this.voucherForm.voucherDetailList[index].credit
      if (value && this.voucherForm.voucherDetailList[index].creditMinus) {
        value = value * -1
      }
      this.voucherForm.voucherDetailList[index].credit = this.formatNumDe(value)
    },
    computerTotal: function () {
      this.voucherForm.debit = 0
      this.voucherForm.debitMinus = false
      this.voucherForm.credit = 0
      this.voucherForm.creditMinus = false
      for (let index in this.voucherForm.voucherDetailList) {
        let obj = this.voucherForm.voucherDetailList[index]
        if (obj.debit) {
          if (obj.debitMinus) {
            this.voucherForm.debit -= obj.debit
          } else {
            this.voucherForm.debit += obj.debit
          }
        }
        if (obj.credit) {
          if (obj.creditMinus) {
            this.voucherForm.credit -= obj.credit
          } else {
            this.voucherForm.credit += obj.credit
          }
        }
      }
      if (this.voucherForm.debit < 0) {
        this.voucherForm.debitMinus = true
        this.voucherForm.debit = -1 * this.voucherForm.debit
      }
      if (this.voucherForm.credit < 0) {
        this.voucherForm.creditMinus = true
        this.voucherForm.credit = -1 * this.voucherForm.credit
      }
    },
    saveVoucher: function () { // 保存凭证
      // 判断借贷金额是否相等
      if (this.voucherForm.debitMinus !== this.voucherForm.creditMinus || this.voucherForm.debit !== this.voucherForm.credit) {
        this.$message.error('保存失败!借贷金额不相等.')
        return
      }
      let voucherDetailList = []
      for (let index in this.voucherForm.voucherDetailList) {
        let obj = Object.assign({}, this.voucherForm.voucherDetailList[index])
        obj.debit = obj.debitMinus ? -obj.debit : obj.debit
        obj.credit = obj.creditMinus ? -obj.credit : obj.credit
        if (obj.subject.id && (obj.debit || obj.credit)) { // 全部为空
          voucherDetailList.push(obj)
        } else if (!obj.subject.id && !obj.debit && !obj.credit) {
          continue
        } else {
          this.$message.error('保存失败!请检查科目和借贷金额是否完整.')
          return
        }
      }
      let para = Object.assign({}, this.voucherForm)
      para.debit = para.debitMinus ? -para.debit : para.debit
      para.credit = para.creditMinus ? -para.credit : para.credit
      para.voucherDetailList = voucherDetailList
      saveVoucher(para).then((res) => {
        console.log(res.data)
        if (res.data.errno === '0') {
          this.$message({
            message: '保存成功!',
            type: 'success'
          })
          this.getVouchers()
          this.voucherVisible = false
        } else {
          this.$message.error(res.data.message)
        }
      })
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
    },
    preVoucher: function () { // 上一页
      let para = {
        id: this.voucherForm.id,
        flag: 'pre'
      }
      getVoucherForm(para).then((res) => {
        if (res.data.errno === '0') {
          this.voucherForm = res.data.voucher
          this.calUlNumber()
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    nextVoucher: function () { // 下一页
      let para = {
        id: this.voucherForm.id,
        flag: 'next'
      }
      getVoucherForm(para).then((res) => {
        if (res.data.errno === '0') {
          this.voucherForm = res.data.voucher
          this.calUlNumber()
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
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
    this.getVouchers()
    this.setUserOptions()
    this.getStatusOptions()
  }
}
</script>
<style lang="stylus">
.voucher-div
  width: 600px
  margin:auto
  position:relative
  .background-border
    zindex: -99
    width:0
    height:266px
    border-right:1px solid rgba(128,128,128,0.4)
    position:absolute
    top:89px
  .title
    width: 128px
    margin: auto
    color:#008080
    border-bottom:2px solid #008080
    margin-bottom:6px
    font-size: 24px
    span
      padding: 0 4px 0 4px
      border-bottom:2px solid #008080
  .billnum-input
    width: 30px
    height: 20px
    line-height:20px
    border: 0
  .table-div
    width:100%
    border-top: #646464 1px solid
    border-left: #646464 1px solid
    border: #000080 2px solid
    .tbody
      height:206px
      width:620px
      overflow-y:auto
    ul
      list-style:none
      padding:0px
      margin:0px
      height:40px
      line-height:40px
      border-top:0px
      font-size:12px
      margin-top:0px
      &.th 
        height:30px
        line-height:30px
        font-size: 16px
        color: #008080
        text-align:center
      li:nth-child(-n+3)
        border-right: #646464 1px solid  
      li 
        display:block
        width:120px
        float:left
        border-bottom: #646464 1px solid
        .color-red
          color: red
        input 
          width: 98%
          height: 30px
          padding-right: 0
          border: 0
        &.kemu
          width:236px
        &.jie
          text-align:right
          input
            letter-spacing:0.5px
            text-align:right
        &.dai
          text-align:right
          input
            letter-spacing:0.5px
            text-align:right
        &.heji-li1
          width:300px
          position: relative
          .heji-li1-span1
            position: absolute
            line-height:20px
            top:0px
            left:0
          .heji-li1-span2
            position: absolute
            line-height:20px
            top:20px
            left:0
          .heji-li1-span3
            position: absolute
            line-height:20px
            top:20px
            left:120px
          .heji-li1-span4
            position: absolute
            line-height:20px
            top:40px
            left:120px  
        &.heji-li2
          width:56px
        &.heji-li3
          text-align:right
          input
            letter-spacing:0.5px
            text-align:right
            padding-right: 0
        &.info-li1
          width:56px
        &.info-li2
          width:542px 
          position: relative
          border-right: 0
          .info-li2-span1
            position: absolute
            line-height:20px
            top:0px
            left:0
          .info-li2-span2
            position: absolute
            line-height:20px
            top:0px
            left:220px 
          .info-li2-span3
            position: absolute
            line-height:20px
            top:0px
            left:400px
          .info-li2-span4
            position: absolute
            line-height:20px
            top:20px
            left:0px  
          .info-li2-span5
            position: absolute
            line-height:20px
            top:20px
            left:220px         
      &.heji
        height:60px
        line-height: 60px
.button-group
  margin: 20px 0 10px 0
          
</style>