<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="帐套"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="datacurtains" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" size="mini">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="帐套名" width="160">
            </el-table-column>
            <el-table-column prop="code" label="帐套号" width="120" sortable>
            </el-table-column>
            <el-table-column prop="startMonth" label="启用会计期" width="140">
            </el-table-column>
            <el-table-column prop="userId" label="帐套主管" width="140" :formatter="formatManager">
            </el-table-column>
            <el-table-column label="操作" width="360">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" @click="handleUserEdit(scope.$index, scope.row)">操作员</el-button>
                    <el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button size="mini" type="primary" @click="toCurtainInit(scope.row)">期初余额</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false" >
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm" size="mini">
                <el-form-item label="帐套名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="帐套号" prop="code">
                    <el-input v-model="addForm.code" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="启用会计期" prop="startMonth">
                      <el-date-picker
                        v-model="addForm.startMonth"
                        type="month"
                        placeholder="选择月">
                      </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--配置人员-->
        <el-dialog title="配置操作员" v-model="addUserVisible" :visible.sync="addUserVisible" :close-on-click-modal="false" >
            <el-form ref="form" :model="addForm" label-width="80px">
              <el-form-item label="操作员">
                <el-transfer v-model="selectUserIds" :data="allUsers" v-loading="selectUserLoading"></el-transfer>
              </el-form-item>
              <el-form-item label="帐套主管">
                <el-select v-model="addForm.userId" filterable placeholder="请选择">
                  <el-option
                    v-for="item in managerOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addUserVisible = false">取消</el-button>
                <el-button type="primary" @click.native="updateUserByCurtainId" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
import util from '../../common/js/util'
// import NProgress from 'nprogress'
import { getCurtainList, removeCurtain, addCurtain, getUserList, getSelectUsers, getCurtainCode, updateUserByCurtainId } from '../../api/index'
export default {
  data () {
    return {
      filters: {
        name: ''
      },
      comFlag: '',
      curtains: [],
      total: 0,
      page: 1,
      listLoading: false,
      selectUserLoading: false,
      sels: [], // 列表选中列
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入帐套名', trigger: 'blur' }
        ],
        code: [
          { type: 'string', required: true, message: '请输入帐套号', trigger: 'blur' }
        ],
        date: [
          { type: 'date', required: true, message: '请选择启用会计期间', trigger: 'blur' }
        ]
      },
      // 新增界面数据
      addForm: {
        id: '',
        name: '',
        code: '',
        startMonth: '',
        userId: '',
        comFlag: this.comFlag
      },
      addUserVisible: false,
      selectUserIds: [],
      allUsers: []
    }
  },
  computed: {
    datacurtains: function () {
      let name = this.filters.name
      return this.curtains.filter(curtain => {
        if (name && curtain.name.indexOf(name) === -1) {
          return false
        }
        return true
      })
    },
    managerOptions: function () {
      let _allUsers = this.allUsers
      let arr = this.selectUserIds.map(function (id) {
        // console.log(id)
        // console.log(_allUsers.find(i => i.key === id))
        return {
          value: id,
          label: _allUsers.find(i => i.key === id).label
        }
      })
      // console.log('------' + arr.length)
      return arr
    }
  },
  methods: {
    // 帐套主管id转名字
    formatManager: function (row, column) {
      let user = this.allUsers.find(i => i.key === row.userId)
      return user ? user.label : '未设置'
    },
    // 获取用户列表
    getCurtains () {
      this.listLoading = true
      let para = { 'comFlag': this.comFlag }
      getCurtainList(para).then((res) => {
        this.curtains = res.data
        this.listLoading = false
      })
    },
    toCurtainInit (row) {
      // alert(row.id)
      this.$router.push({
        name: '起初余额',
        params: {
          curtainId: row.id
        }
      })
    },
    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let para = { id: row.id }
        removeCurtain(para).then((res) => {
          this.listLoading = false
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getCurtains()
        })
      }).catch(() => {
      })
    },
    // 显示操作员界面
    handleUserEdit: function (index, row) {
      this.selectUserLoading = true
      this.addUserVisible = true
      let para = { 'curtainId': row.id }
      getSelectUsers(para).then((res) => {
        // console.log(res.data)
        this.selectUserIds = res.data
        this.selectUserLoading = false
        this.addForm.id = row.id
        this.addForm.userId = row.userId
        // console.log('manager==' + row.userId)
      })
    },
    // 显示编辑界面
    handleEdit: function (index, row) {
      this.addFormVisible = true
      this.addForm = Object.assign({}, row)
    },
    getCurtainCode: function () {
      let param = {'comFlag': this.comFlag}
      getCurtainCode(param).then((res) => {
        this.addForm.code = res.data
      })
    },
    // 显示新增界面
    handleAdd: function () {
      this.addFormVisible = true
      this.addForm = {
        id: '',
        name: '',
        code: '',
        date: '',
        userId: '',
        comFlag: this.comFlag
      }
      this.getCurtainCode()
    },
    // 新增
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            // NProgress.start();
            let para = Object.assign({}, this.addForm)
            para.startMonth = (!para.startMonth || para.startMonth === '') ? '' : util.formatDate.format(new Date(para.startMonth), 'yyyy-MM-dd')
            // console.log(para.date)
            addCurtain(para).then((res) => {
              this.addLoading = false
              this.$refs.addForm.resetFields()
              // NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.addFormVisible = false
              this.getCurtains()
            })
          })
        }
      })
    },
    updateUserByCurtainId: function () {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.addLoading = true
        let para = {
          'id': this.addForm.id,
          'userId': this.addForm.userId,
          'userIds': this.selectUserIds
        }
        updateUserByCurtainId(para).then((res) => {
          this.addLoading = false
          // NProgress.done();
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.addUserVisible = false
          this.getCurtains()
        })
      })
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    // 获取用户列表
    getUsers () {
      this.listLoading = true
      let para = {
        comFlag: this.comFlag
      }
      return getUserList(para).then((res) => {
        this.allUsers = res.data.map(function (user) {
          return {
            key: user.loginName,
            label: user.name
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
    this.getUsers().then(this.getCurtains())
  }
}
</script>
<style lang="stylus">
</style>