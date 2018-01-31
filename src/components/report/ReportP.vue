<template>
    <section>
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
                    <el-button icon="el-icon-search" type="primary" @click="getReports">查询</el-button>
                    <el-button icon="el-icon-circle-plus-outline" type="primary" @click="createReport" :loading="createLoading">生成报表</el-button>
                    <el-button icon="el-icon-circle-close-outline" type="primary" @click="cancelReport" :loading="cancelLoading">删除报表</el-button>
                    <el-button icon="el-icon-download" type="primary" @click="exportExcel" :loading="exportLoading">导出</el-button>
                  </el-button-group>
                </el-form-item>
                
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="reports" highlight-current-row v-loading="listLoading"  border style="width:100%;" size="mini">
            <el-table-column prop="name" label="项目" width="240">
            </el-table-column>
            <el-table-column prop="row" label="行次" width="50">
            </el-table-column>
            <el-table-column prop="monthNum" label="本月数" width="100">
            </el-table-column>
            <el-table-column prop="yearNum" label="本年累计" width="100">
            </el-table-column>            
        </el-table>
    </section>
</template>

<script>
import util from '../../common/js/util'
import { createReportp, getReportps, exportReportpExcel, removeReportP } from '../../api/index'
export default {
  data () {
    return {
      curtainId: '',
      sysUserName: '',
      filters: {
        month: ''
      },
      reports: [],
      listLoading: false,
      createLoading: false,
      cancelLoading: false,
      exportLoading: false,
      comFlag: ''
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
    getReports () {
      this.listLoading = true
      if (!this.checkMonth()) {
        this.listLoading = false
        return
      }
      let monthStr = util.formatDate.format(this.filters.month, 'yyyy-MM')
      let para = { curtainId: this.curtainId, month: monthStr }
      getReportps(para).then((res) => {
        this.reports = res.data
        this.listLoading = false
      })
    },
    createReport () {
      this.createLoading = true
      if (!this.checkMonth()) {
        this.createLoading = false
        return
      }
      let monthStr = util.formatDate.format(this.filters.month, 'yyyy-MM')
      let para = { curtainId: this.curtainId, month: monthStr }
      createReportp(para).then((res) => {
        if (res.data.message === '1') {
          this.$message.success('生成报表成功')
        } else {
          this.$message.error(res.data.message)
        }
        this.createLoading = false
      })
    },
    exportExcel () {
      this.exportLoading = true
      if (!this.checkMonth()) {
        this.exportLoading = false
        return
      }
      let monthStr = util.formatDate.format(this.filters.month, 'yyyy-MM')
      let para = {curtainId: this.curtainId, month: monthStr}
      exportReportpExcel(para).then((res) => {
        this.exportLoading = false
        if (res.data) {
          util.downloadExcel(res)
        }
      })
    },
    // 删除
    cancelReport: function (index, row) {
      this.$confirm('确认删除报表吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.cancelLoading = true
        if (!this.checkMonth()) {
          this.cancelLoading = false
          return
        }
        let monthStr = util.formatDate.format(this.filters.month, 'yyyy-MM')
        let para = {curtainId: this.curtainId, month: monthStr}
        removeReportP(para).then((res) => {
          this.cancelLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {
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
.title-div
  background-color: #e4e4e4
</style>