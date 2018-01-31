<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="dataelements" highlight-current-row v-loading="listLoading" style="width:100%;" :height="screenHeight" size="mini">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="code" label="编号" width="80" sortable>
            </el-table-column>
            <el-table-column prop="name" label="名称" width="160">
            </el-table-column>
            <el-table-column prop="row" label="行次" width="80">
            </el-table-column>
            <el-table-column prop="type" label="类型" width="80" :formatter="formatTypes">
            </el-table-column>
            <el-table-column prop="subjectCodes" label="对应科目" width="300" :formatter="formatSubjectCodes">
            </el-table-column>
            <el-table-column label="操作" width="260">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="primary" @click="handleSubjectEdit(scope.$index, scope.row)">配置科目</el-button>
                    <!-- <el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false" >
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm" size="mini">
               <el-form-item label="编号" prop="code">
                    <el-input v-model="addForm.code" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="行次" prop="row">
                    <el-input v-model="addForm.row" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="addForm.type" filterable placeholder="请选择">
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计算公式" prop="row">
                    <el-input v-model="addForm.calFun" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--配置人员-->
        <el-dialog title="配置科目" v-model="subjectVisible" :visible.sync="subjectVisible" :close-on-click-modal="false" >
            <el-form ref="form" :model="addForm" label-width="80px">
              <el-form-item label="科目">
                <el-transfer v-model="selectSubjectCodes" :data="allSubjects"></el-transfer>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="subjectVisible = false">取消</el-button>
                <el-button type="primary" @click.native="updateSubjects" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
// import util from '../../common/js/util'
// import NProgress from 'nprogress'
import { getSubjectsCode1List, getReportBElements, removeReportBElement, addReportBElement, updateReportBSubjects } from '../../api/index'
export default {
  data () {
    return {
      filters: {
        name: ''
      },
      screenHeight: document.documentElement.clientHeight - 200,
      comFlag: '',
      elements: [],
      listLoading: false,
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        code: [
          { type: 'string', required: true, message: '请输入编号', trigger: 'blur' }
        ]
      },
      // 新增界面数据
      addForm: {
        comFlag: this.comFlag,
        code: '',
        name: '',
        row: '',
        type: '',
        calFun: ''
      },
      typeOptions: [
        {value: 'T', label: '标题'},
        {value: 'N', label: '汇总'},
        {value: 'C', label: '计算'},
        {value: 'B', label: '空格'}
      ],
      subjectVisible: false,
      selectSubjectCodes: [],
      allSubjects: []
    }
  },
  computed: {
    dataelements: function () {
      let name = this.filters.name
      return this.elements.filter(ele => {
        if (name && ele.name.indexOf(name) === -1) {
          return false
        }
        return true
      })
    }
  },
  methods: {
    // 获得科目名称
    formatSubjectCodes: function (row, column) {
      let codes = []
      let _this = this
      row.subjectCodes.forEach(function (obj) {
        codes.push(_this.allSubjects.find(i => i.key === obj).label)
      })
      return codes.join(',')
    },
    // 获得类型
    formatTypes: function (row, column) {
      return this.typeOptions.find(i => i.value === row.type).label
    },
    // 获取元素列表
    getElements () {
      // console.log('---')
      // console.log(this.screenHeight)
      this.listLoading = true
      let para = { 'comFlag': this.comFlag }
      getReportBElements(para).then((res) => {
        // console.log(res.data)
        this.elements = res.data
        this.listLoading = false
      })
    },
    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let para = { id: row.id }
        removeReportBElement(para).then((res) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getElements()
        })
      }).catch(() => {
      })
    },
    // 显示科目配置界面
    handleSubjectEdit: function (index, row) {
      this.subjectVisible = true
      this.selectSubjectCodes = row.subjectCodes
      this.addForm.id = row.id
    },
    // 显示编辑界面
    handleEdit: function (index, row) {
      this.addFormVisible = true
      this.addForm = Object.assign({}, row)
    },
    // 显示新增界面
    handleAdd: function () {
      this.addFormVisible = true
      this.addForm = {
        code: '',
        name: '',
        row: '',
        type: '',
        comFlag: this.comFlag,
        calFun: ''
      }
    },
    // 新增
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            // NProgress.start();
            let para = Object.assign({}, this.addForm)
            addReportBElement(para).then((res) => {
              this.addLoading = false
              this.$refs.addForm.resetFields()
              // NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.addFormVisible = false
              this.getElements()
            })
          })
        }
      })
    },
    updateSubjects: function () {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.addLoading = true
        let para = {
          'id': this.addForm.id,
          'subjectCodes': this.selectSubjectCodes
        }
        updateReportBSubjects(para).then((res) => {
          this.addLoading = false
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.subjectVisible = false
          this.getElements()
        })
      })
    },
    // 获取用户列表
    getSubjects () {
      this.listLoading = true
      let para = {
        comFlag: this.comFlag
      }
      return getSubjectsCode1List(para).then((res) => {
        this.allSubjects = res.data.map(function (sub) {
          return {
            key: sub.code,
            label: sub.name
          }
        })
      })
    }
  },
  mounted () {
    var user = sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      this.comFlag = user.username
    }
    this.getSubjects().then(this.getElements())
  }
}
</script>
<style lang="stylus">
</style>