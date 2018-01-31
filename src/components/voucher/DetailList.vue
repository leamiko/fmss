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
                    <el-input placeholder="选择科目" v-model="filters.subjectName" :disabled="true">
                      <el-button slot="append" icon="el-icon-search" @click="showSubject"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button-group size="mini">
                    <el-button type="primary" icon="el-icon-search" @click="getDetailList">查询</el-button>
                    <el-button type="primary" icon="el-icon-download" :loading="exportLoading" @click="exportExcel">导出</el-button>
                  </el-button-group>
                </el-form-item>
            </el-form>
        </el-col>
        <!--弹出树形框-->
        <el-dialog title="选择科目" v-model="seleSub" :visible.sync="seleSubVisible" :close-on-click-modal="false" >
          <subjecttree :curtainId="curtainId" :rootSelect="true" v-on:selectedSubject="assignSubject"></subjecttree>
        </el-dialog>
         <!--列表-->
        <el-table :data="detailList" highlight-current-row v-loading="listLoading" style="width: 100%;" size="mini">
            <el-table-column type="index" width="40" >
            </el-table-column>
            <el-table-column prop="voucher.createDate" label="记账日期" width="100">
            </el-table-column>
            <el-table-column prop="voucher.code" label="凭证编号" width="100">
            </el-table-column>
            <el-table-column prop="subject.code" label="科目编码" width="100">
            </el-table-column>
            <el-table-column prop="subject.name" label="科目名称" width="180">
            </el-table-column>
            <el-table-column prop="description" label="摘要" width="100">
            </el-table-column>
            <el-table-column prop="debit" label="借方" width="100" :formatter="formatNumberDebit">
            </el-table-column>
            <el-table-column prop="credit" label="贷方" width="100" :formatter="formatNumberCredit">
            </el-table-column>
            <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row, 'U')">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
          <el-pagination layout="prev, pager, next, total" @current-change="handleCurrentChange" :page-size="10" :total="pagetotal" style="float:right;">
          </el-pagination>
  </div>
    

  </section>
</template>

<script>
import subjecttree from '../subject/SubjectTree'
import {getDetailList, exportDetailExcel} from '../../api/index'
import util from '../../common/js/util'
export default {
  data () {
    return {
      curtainId: '',
      sysUserName: '',
      listLoading: false,
      exportLoading: false,
      detailList: [],
      filters: {
        date: util.getMonthDates(),
        subjectId: '',
        subjectName: '',
        page: 1
      },
      pagetotal: 0,
      seleSubVisible: false,
      seleSub: {},
      index: 0 // 当前光标所在的index
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
    showSubject: function (value, index) {
      this.seleSubVisible = true
    },
    assignSubject: function (data) {
      this.filters.subjectId = data.id
      this.filters.subjectName = data.name
      this.seleSubVisible = false
    },
    getDetailList: function () {
      this.filters.curtainId = this.curtainId
      this.filters.startDate = util.formatDate.format(this.filters.date[0], 'yyyy-MM-dd')
      this.filters.endDate = util.formatDate.format(this.filters.date[1], 'yyyy-MM-dd')
      let para = this.filters
      this.listLoading = true
      getDetailList(para).then((res) => {
        this.detailList = res.data.detailList
        // console.log(this.detailList)
        this.pagetotal = res.data.pageTotal
        this.listLoading = false
      })
    },
    handleCurrentChange (val) {
      this.filters.page = val
      this.getDetailList()
    },
    exportExcel () {
      let para = {
        curtainId: this.curtainId,
        startDate: util.formatDate.format(this.filters.date[0], 'yyyy-MM-dd'),
        endDate: util.formatDate.format(this.filters.date[1], 'yyyy-MM-dd'),
        subjectId: this.filters.subjectId
      }
      this.exportLoading = true
      exportDetailExcel(para).then((res) => {
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
    this.getDetailList()
  }
}
</script>
<style lang="stylus">
</style>