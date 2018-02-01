<template>
  <section>
    <!--凭证-->
    <div class="voucher-div">
      <div v-for="(border,index) in borders" class="background-border" v-bind:style="{right:40+index*8-1+'px',borderRight:border}"></div>
      <div v-for="(border,index) in borders" class="background-border" v-bind:style="{right:160+index*8+'px',borderRight:border}"></div>
      <p class="voucher-title">
        <span>记</span><span>账</span><span>凭</span><span>证</span>
      </p>
      <el-row style="font-size:12px">
        <el-col :span="5"><div class="grid-content bg-purple" style="padding-left:4px;">记&nbsp;字&nbsp; {{voucherForm.code}}</div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple">No：&nbsp; {{voucherForm.sysCode}}</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">制单日期：<input type="text" class="date-input" v-model="voucherForm.createDate"></div></el-col>
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
     <el-button-group>
        <el-button size="mini" icon="el-icon-arrow-left" type="primary" :disabled="voucherFormStatus=='A'" @click="preVoucher">上一页</el-button>
        <el-button size="mini" icon="el-icon-circle-plus-outline" type="success" v-show="voucherForm.voucherStatus==='C' && (voucherFormStatus=='A' || voucherFormStatus=='U')" @click="saveVoucher">保存</el-button>
        <el-button size="mini" icon="el-icon-check" type="success" v-show="voucherForm.voucherStatus==='C' && voucherFormStatus=='S'" @click="auditVoucher" :loading="auditOneLoading">审核</el-button>
        <el-button size="mini" icon="el-icon-close" type="success" v-show="voucherForm.voucherStatus==='C' && voucherFormStatus=='U'" @click="cancelVoucher" :loading="cancelLoading">作废</el-button>      
         <el-button size="mini" icon="el-icon-printer" type="success" v-show="voucherFormStatus!=='A'" @click="printVoucher" :loading="auditOneLoading">打印</el-button>
        <el-button size="mini" type="primary" :disabled="voucherFormStatus=='A'" @click="nextVoucher">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group> 
      <a :href="'#/printvoucher/' + voucherId " target="_blank" ref="printa"></a>
      <!--弹出树形框-->
    <el-dialog title="选择科目" v-model="seleSub" :visible.sync="seleSubVisible" :modal-append-to-body="false" :close-on-click-modal="false" :modal="false">
      <subjecttree :curtainId="curtainId" :rootSelect="false" :filterCode="subjectCode" v-on:selectedSubject="assignSubject"></subjecttree>
    </el-dialog>
  </section>
</template>

<script>
import subjecttree from '../subject/SubjectTree'
import { auditVouchers, getVoucherInfo, saveVoucher, getVoucherForm, cancelVoucher } from '../../api/index'
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
      sysUserName: '',
      auditOneLoading: false, // 凭证内部审核按钮
      cancelLoading: false,
      focusLine: 0, // 在凭证明细里面光标所在的行
      subjectCode: '',
      borders,
      seleSubVisible: false,
      seleSub: {},
      index: 0, // 当前光标所在的index
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
  props: {
    curtainId: {
      type: Number
    },
    voucherFormStatus: { // 新增：A；修改：U；审核：S
      type: String
    },
    voucherId: {
      type: Number
    },
    vouVisible: {
      type: Boolean
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
    handleAdd () {
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
    handleEdit () {
      let para = {
        voucherId: this.voucherId
      }
      // this.voucherForm = Object.assign({}, row) 采用该方法，不符合深入响应原则，Vue 不能检测到对象属性的添加或删除
      // 下面的方法可以把voucherForm的voucherDetailList属性带着，上面的方法不可以
      // this.voucherForm = Object.assign({}, this.voucherForm, row)
      let _this = this
      getVoucherInfo(para).then((res) => {
        this.voucherForm = res.data.voucher
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
        res.data.details.forEach(function (obj) {
          _this.voucherForm.voucherDetailList.unshift(obj)
        })
        this.calUlNumber()
      })
    },
    clearSubject (index) {
      let fullName = this.voucherForm.voucherDetailList[index].subject.fullName
      if (!fullName) {
        this.voucherForm.voucherDetailList[index].subject.id = ''
      }
    },
    cancelVoucher () { // 作废
      this.$confirm('确认作废该凭证吗？', '提示', {}).then(() => {
        let para = {
          voucherId: this.voucherId
        }
        this.cancelLoading = true
        cancelVoucher(para).then((res) => {
          this.cancelLoading = false
          this.$message({
            message: '该凭证已作废！',
            type: 'success'
          })
          this.$emit('callbackSave')
        })
      })
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
        if (res.data.errno === '0') {
          this.$message({
            message: '保存成功!',
            type: 'success'
          })
          this.$emit('callbackSave')
        } else {
          this.$message.error(res.data.message)
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
          this.$emit('callbackSave')
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
    },
    printVoucher () {
      console.log('1111222')
      this.$refs.printa.click()
    },
    handleForm () {
      if (this.voucherFormStatus === 'A') {
        this.handleAdd()
      } else {
        this.handleEdit()
      }
    }
  },
  watch: {
    vouVisible: function (val) { // 每次打开的时候从服务器获得信息
      if (val) {
        this.handleForm()
      }
    }
  },
  mounted () {
    var user = sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      this.sysUserName = user.name
      this.handleForm()
    }
  }
}
</script>
<style lang="stylus">
.background-border
  zindex: -99
  width:0
  height:266px
  border-right:1px solid rgba(128,128,128,0.4)
  position:absolute
  top:144px
.voucher-title
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
.date-input
    width: 80px
    height: 20px
    line-height:20px
    border: 0  
.table-div
  width:599px
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
          
</style>