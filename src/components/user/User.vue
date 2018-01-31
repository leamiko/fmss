<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filter" size="mini">
                <el-form-item>
                    <el-input v-model="filter.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="datausers" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" size="mini">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="loginName" label="登录名" width="120" >
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" >
            </el-table-column>
            <el-table-column prop="birth" label="生日" width="120" >
            </el-table-column>
            <el-table-column prop="roleCode" label="岗位" min-width="120" :formatter="formatRole">
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" @click="updatePassword(scope.$index, scope.row)">修改密码</el-button>
                    <el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false" >
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" size="mini">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off" :disabled="editForm"></el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="loginName">
                    <el-input v-model="addForm.loginName" auto-complete="off" :disabled="editForm"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-show="!editForm">
                    <el-input v-model="addForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleCode">
                  <el-select v-model="addForm.roleCode" placeholder="请选择">
                    <el-option
                      v-for="item in roleOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--修改密码-->
        <el-dialog title="修改密码" :visible.sync="updatePwdVisible" :close-on-click-modal="false" >
            <el-form :model="updatePwd" :rules="updatePwdRules" ref="updatePwd" label-width="80px" size="mini">              
              <el-form-item label="密码" prop="newPassword">
                  <el-input v-model="updatePwd.newPassword" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click.native="updatePwdVisible = false">取消</el-button>
                  <el-button type="primary" @click.native="addSubmitPwd" :loading="addLoading">提交</el-button>
              </div>
        </el-dialog>
    </section>
</template>

<script>
import util from '../../common/js/util'
// import NProgress from 'nprogress'
import { getUserList, getRoleOptions, removeUser, addUser, updatePassword } from '../../api/index'
export default {
  data () {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入登录名'))
      } else if (!this.editForm) {
        let user = this.users.find(i => i.loginName === value)
        // console.log('-0-' + this.users.length + '_' + value + user)
        if (user) {
          callback(new Error('登录名重复'))
        }
      }
      callback()
    }
    return {
      filter: {
        name: ''
      },
      comFlag: '',
      users: [],
      page: 1,
      listLoading: false,
      sels: [], // 列表选中列
      editLoading: false,
      updatePwdVisible: false,
      updatePwd: {
        newPassword: '',
        newPasswordId: ''
      },
      addFormVisible: false, // 新增界面是否显示
      editForm: false,
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        loginName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '请选择岗位', trigger: 'blur' }
        ]
      },
      updatePwdRules: {
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 新增界面数据
      addForm: {
        loginName: '',
        password: '',
        name: '',
        sex: -1,
        birth: '',
        roleCode: '',
        comFlag: ''
      },
      roleOptions: []
    }
  },
  computed: {
    datausers: function () {
      let name = this.filter.name
      return this.users.filter(user => {
        if (name && user.name.indexOf(name) === -1) {
          return false
        }
        return true
      })
    }
  },
  methods: {
    // 性别显示转换
    formatSex: function (row, column) {
      return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知'
    },
    formatRole: function (row, column) {
      let role = this.roleOptions.find(i => i.value === row.roleCode)
      return role ? role.label : '未知'
    },
    handleCurrentChange (val) {
      this.page = val
      this.getUsers()
    },
    // 获取用户列表
    getUsers () {
      this.listLoading = true
      let para = {
        'comFlag': this.comFlag
      }
      getUserList(para).then((res) => {
        this.users = res.data
        this.listLoading = false
      })
    },
    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        // NProgress.start()
        let para = { 'loginName': row.loginName }
        removeUser(para).then((res) => {
          this.listLoading = false
            // NProgress.done()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getUsers()
        })
      }).catch(() => {
      })
    },
    // 显示编辑界面
    updatePassword: function (index, row) {
      this.updatePwd.newPassword = ''
      this.updatePwd.newPasswordId = row.loginName
      this.updatePwdVisible = true
    },
    addSubmitPwd: function () {
      this.$refs.updatePwd.validate((valid) => {
        if (valid) {
          this.$confirm('确认修改密码吗？', '提示', {}).then(() => {
            this.addLoading = true
            // NProgress.start();
            let para = {'loginName': this.updatePwd.newPasswordId, 'pwd': this.updatePwd.newPassword}
            updatePassword(para).then((res) => {
              this.addLoading = false
              // NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.updatePwdVisible = false
            })
          })
        }
      })
    },
    // 显示编辑界面
    handleEdit: function (index, row) {
      this.editForm = true
      this.addFormVisible = true
      this.addForm = Object.assign({}, row)
      this.addForm.password = '*****'
    },
    // 显示新增界面
    handleAdd: function () {
      this.editForm = false
      this.addFormVisible = true
      // this.$refs.addForm.resetFields()
      this.addForm = {
        loginName: '',
        password: '',
        name: '',
        sex: -1,
        birth: '',
        roleCode: '',
        comFlag: this.comFlag
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
            para.birth = (!para.birth || para.birth === '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
            addUser(para).then((res) => {
              this.addLoading = false
              // NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getUsers()
            })
          })
        }
      })
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    getRoles: function () {
      return getRoleOptions().then((res) => {
        this.roleOptions = res.data.map(function (role) {
          return {
            label: role.name,
            value: role.code
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
      // console.log(this.comFlag + '--0')
      this.getRoles().then(this.getUsers())
    }
  }
}
</script>
<style lang="stylus">
</style>