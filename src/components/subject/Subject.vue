<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item>
                  <el-select v-model="curtainId" placeholder="帐套">
                    <el-option
                      v-for="item in curtainOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.code" placeholder="编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" :disabled="hasCurtainId" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="datasubjects" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" size="mini" height="430">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="level" label="级次" width="120" :filters="filters.level" :filter-method="filterLevel">
            </el-table-column>
            <el-table-column prop="code" label="编号" width="100">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="200">
            </el-table-column>
            <el-table-column prop="type" label="类别" width="120" :filters="typeOptions" :filter-method="filterType">
            </el-table-column>
            <el-table-column prop="balance" label="余额方向" min-width="180" :formatter="formatBalance">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; margin-bottom: 0px;">
          <el-form :inline="true" size="mini">
                <el-form-item>
                  <el-select v-model="toCurtainId" placeholder="复制到帐套">
                    <el-option
                      v-for="item in toCurtainOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="handleCopy">开始复制</el-button>
                </el-form-item>
                <el-form-item>
                    <span style="color:red;font-size:14px">{{copyerror}}</span>
                </el-form-item>
            </el-form>
        </el-col>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false" >
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" size="mini">
                <el-form-item label="编号" prop="code">
                    <el-input v-model="addForm.code" auto-complete="off" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="父科目" v-show="!isEdit"> 
                    <el-input v-model="addForm.parent" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="类别" v-show="!isEdit">
                    <el-input v-model="addForm.type" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="余额方向">
                    <el-select v-model="addForm.balance" placeholder="请选择" :disabled="addForm.code.length>4">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
// import util from '../../common/js/util'
// import NProgress from 'nprogress'
import { getSubjectList, removeSubject, addSubject, getCurtainList, getFilterTypes, validateCode, copySubject } from '../../api/index'
export default {
  data () {
    var validateSubjectCode = (rule, value, callback) => {
      if (this.isEdit) {
        callback()
      }
      let para = {'code': value, 'curtainId': this.curtainId}
      validateCode(para).then((res) => {
        // console.log(res.data)
        if (res.data.errno === '1') {
          callback(new Error(res.data.message))
        } else {
          this.addForm.parent = res.data.parent
          this.addForm.type = res.data.type
          this.addForm.balance = res.data.balance
          callback()
        }
      })
    }
    return {
      comFlag: '',
      curtainId: '',
      toCurtainId: '',
      filters: {
        name: '',
        code: '',
        level: [
          { text: '一级', value: 1 },
          { text: '二级', value: 2 },
          { text: '三级', value: 3 }
        ]
      },
      options: [{
        value: 'debit',
        label: '借方'
      }, {
        value: 'credit',
        label: '贷方'
      }],
      curtainOptions: [],
      typeOptions: [],
      subjects: [],
      sels: [], // 列表选中列
      copyerror: '',
      listLoading: false,
      editLoading: false,
      isEdit: false,
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        code: [
          { required: true, message: '请输入编号', trigger: 'blur' },
          { validator: validateSubjectCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      // 新增界面数据
      addForm: {
        id: '',
        curtainId: '',
        code: '',
        name: '',
        parent: '',
        type: '',
        balance: ''
      }
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
    handleCurrentChange (val) {
      this.page = val
      this.getSubjects()
    },
    // 获得帐套被选项
    getFilterCurtains () {
      let para = { comFlag: this.comFlag }
      getCurtainList(para).then((res) => {
        this.curtainOptions = res.data.map((curtain) => {
          return {
            value: curtain.id,
            label: curtain.name
          }
        })
      })
    },
    // 获得类型备选项
    getFilterTypes () {
      getFilterTypes().then((res) => {
        this.typeOptions = res.data.map((option) => {
          return {
            text: option.text,
            value: option.text
          }
        })
      })
    },
    // 获取用户列表
    getSubjects () {
      let para = {
        'curtainId': this.curtainId
      }
      if (this.curtainId) {
        this.listLoading = true
        getSubjectList(para).then((res) => {
          this.subjects = res.data
          this.listLoading = false
        })
      }
    },
    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { id: row.id }
        removeSubject(para).then((res) => {
          this.listLoading = false
            // NProgress.done()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getSubjects()
        })
      }).catch(() => {
      })
    },
    // 显示编辑界面
    handleEdit: function (index, row) {
      this.addFormVisible = true
      this.isEdit = true
      this.addForm = Object.assign({}, row)
    },
    // 显示新增界面
    handleAdd: function () {
      this.addFormVisible = true
      this.isEdit = false
      let _curtainId = this.curtainId
      this.addForm = {
        id: '',
        curtainId: _curtainId,
        code: '',
        name: '',
        parent: '',
        type: '',
        balance: ''
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
            addSubject(para).then((res) => {
              this.addLoading = false
              // NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getSubjects()
            })
          })
        }
      })
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    filterLevel: function (value, row) {
      return row.level === value
    },
    filterType: function (value, row) {
      return row.type === value
    },
    handleCopy: function () {
      var ids = this.sels.map(item => item.id)
      if (ids.length === 0) {
        this.copyerror = '请先选择科目'
        return
      }
      if (!this.toCurtainId) {
        this.copyerror = '请选择复制到哪个帐套'
        return
      }
      this.copyerror = ''
      this.$confirm('确认复制科目到新的帐套吗？', '提示', {}).then(() => {
        this.addLoading = true
        let para = {
          toCurtainId: this.toCurtainId,
          subjectIds: ids
        }
        copySubject(para).then((res) => {
          this.addLoading = false
          this.$message({
            message: '复制成功',
            type: 'success'
          })
        })
      })
    }
  },
  computed: {
    datasubjects: function () {
      let name = this.filters.name
      let code = this.filters.code
      return this.subjects.filter(subject => {
        if (name && subject.name.indexOf(name) === -1) {
          return false
        }
        if (code && subject.code.indexOf(code) === -1) {
          return false
        }
        return true
      })
    },
    hasCurtainId: function () {
      return this.curtainId === ''
    },
    toCurtainOptions: function () {
      return this.curtainOptions.filter(option => {
        if (option.value === this.curtainId) {
          return false
        }
        return true
      })
    }
  },
  watch: {
    curtainId: function (curtainId) {
      this.getSubjects()
    }
  },
  mounted () {
    var user = sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      this.comFlag = user.username
    }
    this.getSubjects()
    this.getFilterCurtains()
    this.getFilterTypes()
  }
}
</script>
<style lang="stylus">
</style>