<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2020-03-31 11:23:10
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
.departments.layout-column
  .header.layout-row__between
    .query
      el-input.input-search(placeholder='请输入关键字' v-model='search' size="small" clearable @clear="getDataList")
        el-button(slot="append" icon="el-icon-search" type="primary" size="small" @click="doSearch")

    .operate
      el-button(type="success" size="small" @click='showZcDialog') DL炸材
      el-button(type="primary" size="small" @click='createdRow') 新增用户

  .table-warp.flex1.layout-column
    el-table.flex1(
      v-loading="loading"
      :data='tableData'
      style='width: 100%'
      :header-cell-style='headerStyle'
      height="250"
      border
      ref="reftable"
      empty-text="没有数据")
      el-table-column(label="#" align="center" type="index" :index="indexMethod")
      el-table-column(label="视频用户名" align="left" prop="videouser")
      el-table-column(label="类型" align="left" prop="usertype")
        template(slot-scope='scope')
          span(v-if="scope.row.usertype === '0'") 企业
          span(v-else-if="scope.row.usertype === '1'") 公安机关
          span(v-else) -
      el-table-column(label="名称" align="left")
        template(slot-scope='scope')
          span(v-if="scope.row.usertype === '0'") {{scope.row.QF001Zh}}
          span(v-else-if="scope.row.usertype === '1'") {{scope.row.d1}}
          span(v-else) -
      el-table-column(label="唯一编号" align="left")
        template(slot-scope='scope')
          span(v-if="scope.row.usertype === '0'") {{scope.row.QF001}}
          span(v-else-if="scope.row.usertype === '1'") {{scope.row.DepartmentCode}}
          span(v-else) -
      el-table-column(label="用户名" align="left" prop="d3")
      el-table-column(label="用户登录名" align="left" prop="d4")
      el-table-column(label="操作" width="150" align="center")
        template(slot-scope='scope')
          el-button(type="primary" plain @click="editRow(scope.row)" size="small") 编辑
          el-button(type="danger" plain @click="deleted(scope.row)" size="small") 删除

    //- 分页
    .pages
      el-pagination(
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total")

    //- 弹窗
    el-dialog.dialog-class(:title='dialogTitle', :visible.sync='dialogVisible' width='40%' :close-on-click-modal='false' :before-close="handleClose")
      el-form.demo-ruleForm(:model='ruleForm', :rules='rules', ref='ruleForm', label-width='150px')
        el-form-item(
          label='类型'
          prop="usertype")
          el-select(
            v-model='ruleForm.usertype'
            filterable=''
            placeholder='请选择'
            size="small"
            @change="getUnitChange")
            el-option(
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value")

        el-form-item(
          v-if="this.ruleForm.usertype === '0'"
          label='企业名称'
          prop="QF001")
          el-select(
            v-model='ruleForm.QF001'
            filterable=''
            placeholder='请选择'
            size="small"
            @change="getUnitUserChange"
            :rules="this.ruleForm.usertype === '0'&&!this.ruleForm.QF001?[{ required: true, message: '企业名称不能为空', trigger: 'change' }]:[]")
            el-option(
              v-for='(item,index) in Models0'
              :key='index'
              :label='item.Name'
              :value='item.Code'
              )
        el-form-item(
          v-else-if="this.ruleForm.usertype === '1'"
          label='公安机关名称'
          prop="DepartmentCode")
          el-select(
            v-model='ruleForm.DepartmentCode'
            filterable=''
            size="small"
            placeholder='请选择'
            @change="getUnitUserChange"
          :rules="this.ruleForm.usertype === '1'&&!this.ruleForm.DepartmentCode?[{ required: true, message: '公安机关名称不能为空', trigger: 'change' }]:[]")
            el-option(
              v-for='(item,index) in Models1'
              :key='index'
              :label='item.Name'
              :value='item.Code')

        el-form-item(
          v-if="this.ruleForm.usertype === '0'&&this.ruleForm.QF001"
          label='企业用户'
          prop="d2")
          el-select(
            ref="unitRef0"
            v-model='ruleForm.d2'
            filterable=''
            placeholder='请选择'
            size="small"
            @change="getUnitUservalueChange"
            :rules="this.ruleForm.usertype === '0'&&!this.ruleForm.d2?[{ required: true, message: '企业用户不能为空', trigger: 'change' }]:[]")
            el-option(
              v-for='(item,index) in Users'
              :key='index'
              :label='item.Name'
              :value='item.UserId')

        el-form-item(
          v-else-if="this.ruleForm.usertype === '1'&&this.ruleForm.DepartmentCode"
          label='公安机关用户'
          prop="d2")
          el-select(
            ref="unitRef1"
            v-model='ruleForm.d2'
            filterable=''
            placeholder='请选择'
            size="small"
            @change="getUnitUservalueChange"
            :rules="this.ruleForm.usertype === '1'&&!this.ruleForm.d2?[{ required: true, message: '公安机关用户不能为空', trigger: 'blur' }]:[]")
            el-option(
              v-for='(item,index) in Users'
              :key='index'
              :label='item.Name'
              :value='item.UserId')

        el-form-item(label='视频用户名' prop="videouser")
          el-input(v-model='ruleForm.videouser' size="small" placeholder='请输入')
        el-form-item(label='视频用户密码' prop="videouserpass")
          el-input(v-model='ruleForm.videouserpass' size="small" show-password placeholder='请输入')
        el-form-item.dia-footer
          el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
          el-button(@click="closeDialog" size="small") 取消
    //- 炸材弹窗
    el-dialog.zc-dialog(
      :title='zcTitle',
      :visible.sync='zcVisible'
      width='1000px'
      ref="zcForm"
      top="10vh"
      :close-on-click-modal='false')
      edit-dialog(
        operationTitle="新增炸材"
        dialogWidth="480px"
        :hasPass="false"
        :loading="zcLoading"
        :tableData="zcData"
        :columns="zcColumns"
        :operationAble="true"
        :dics="zcDics"
        :hasPages="true"
        :pageSize="pageSizeZc"
        :currentPage="pageZc"
        :total="totalZc"
        @handleCurrentChange="onHandleCurrentChange"
        @handleSizeChange="onHandleSizeChange"
        @onSubmitForm="onSubmitForm"
        @onDeleted="onDeleted")
</template>

<script >
import {
  getVideoDeviceUsersData,
  updateVideoDeviceUsersData,
  addVideoDeviceUsersData,
  deleteVideoDeviceUsersData,
  addzctype,
  updatezctype,
  delzctype,
  getzctypeList
} from '@/api/VideoUser'
import {
  getxscomlist } from '@/api/zhengjian'
import { getData } from '@/api/system/department'
import { getCompanysData } from '@/api/system'
import EditDialog from '@/components/EditDialog'
import { copy } from '@/utils/index'
export default {
  name: 'Index',
  components: {
    EditDialog
  },
  filters: {

  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      tableData: [],
      total: 1,
      currentPage: 1,
      pageSize: 20,
      pageSizeZc: 20,
      pageZc: 1,
      totalZc: 1,
      dialogVisible: false,
      dialogTitle: '',
      dialogType: 'add',
      search: '',
      ruleForm: {},
      Models0: [],
      Models1: [],
      Users: [],
      d1: '',
      d3: '',
      d2: '',
      videouser: '',
      videouserpass: '',
      rules: {
        usertype: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        videouser: [
          { required: true, message: '视频用户名不能为空', trigger: 'blur' }
        ],
        videouserpass: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ]
      },
      options: [{
        value: '0',
        label: '企业'
      }, {
        value: '1',
        label: '公安机关'
      }],
      // 炸材
      zcTitle: '标题',
      zcVisible: false,
      zcLoading: false,
      zcData: [],
      zcColumns: [
        {
          prop: 'xscommc',
          label: '销售公司',
          line: true,
          tableOnly: true
        },
        {
          prop: 'xscomid',
          label: '销售公司',
          type: 'select',
          line: true,
          formOnly: true
        },
        // {
        //   prop: 'zctype',
        //   label: '炸材类型',
        //   type: 'select',
        //   line: true,
        //   formOnly: true
        // },
        {
          prop: 'zctypezh',
          label: '炸材类型',
          line: true
          // tableOnly: true
        },
        {
          prop: 'daw',
          label: '单位',
          type: 'select',
          line: true
        },
        {
          prop: 'zccode',
          label: '炸材编码',
          line: true
        }
        // {
        //   prop: 'zcname',
        //   label: '炸材名称',
        //   line: true
        // }
      ],
      zcDics: {
        daw: [
          {
            label: '米',
            value: '米'
          },
          {
            label: '公斤',
            value: '公斤'
          },
          {
            label: '发',
            value: '发'
          }
        ],
        zctype: [
          {
            label: '炸药',
            value: 'zy'
          },
          {
            label: '雷管',
            value: 'lg'
          },
          {
            label: '索类',
            value: 'sl'
          }
        ],
        xscomid: []
      }
    }
  },
  computed: {

  },
  created() {
    this.getxscomlistData()
    this.getDataList()
    this.getUnitDataList()
  },
  mounted() {

  },
  methods: {
    /** *** 基本设置 start ******/
    headerStyle() {
      return 'background-color: #FAFAFA;'
    },
    indexMethod(index) {
      return (index + 1) + (this.currentPage - 1) * this.pageSize
    },
    handleCurrentChange(e) {
      this.currentPage = e
      this.getDataList()
      this.getUnitDataList()
    },
    onHandleCurrentChange(e) {
      this.pageZc = e
      this.getZcDataList()
    },
    onHandleSizeChange(e) {
      this.pageSizeZc = e
      this.getZcDataList()
    },
    handleSizeChange(e) {
      this.pageSize = e
      this.getDataList()
    },
    doSearch() {
      this.currentPage = 1
      this.pageSize = 20
      this.getDataList()
    },
    handleClose(done) {
      this.resetForm('ruleForm')
      done()
    },
    closeDialog() {
      this.resetForm('ruleForm')
      this.dialogVisible = false
    },
    // 显示zacai 弹窗
    showZcDialog() {
      this.zcTitle = 'DL炸材列表'
      this.zcVisible = true
      this.getZcDataList()
    },
    getxscomlistData() {
      const params = {
        page: 1,
        pageSize: 10000,
        keyword: ''
      }
      this.loading = true
      getxscomlist(params).then(res => {
        const dics = res.Data.Models
        dics.forEach(n => {
          // n.value = n.Code
          // n.label = n.Name
          n.value = n.id
          n.label = n.dwmc
        })
        this.$set(this.zcDics, 'xscomid', dics)
      })
    },
    /**
     * @description: 获取列表数据
     * @param {type}
     * @return:
     */
    getDataList() {
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.search
      }
      this.loading = true
      getVideoDeviceUsersData(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        setTimeout(() => {
          this.$refs.reftable.doLayout()
        }, 200)
        this.tableData = res.Data.Models
        this.total = res.Data.TotalCount
      })
    },
    /**
     * @description: 点击创建按钮
     * @param {type}
     */
    createdRow() {
      this.ruleForm = {}

      this.dialogType = 'add'
      this.dialogTitle = '新增'
      this.dialogVisible = true
    },
    /**
     * @description: 编辑数据
     * @param {type}
     */
    editRow(row) {
      // this.ruleForm = Object.assign({}, row)
      this.ruleForm = copy(row)
      this.getUser()
      // this.ruleForm.d3 = row.d3
      this.dialogType = 'update'
      this.dialogTitle = '编辑'
      this.dialogVisible = true
    },
    /**
     * @description: 删除数据
     * @param {row} Object 行数据
     * @return:
     */
    deleted(row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteVideoDeviceUsersData({ id: row.id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getDataList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * @description: 获取下拉框数据
     * @param {params} Object 行数据
     * @return:
     */
    getUnitDataList() {
      const params = {
        page: this.currentPage,
        pageSize: 2000,
        keyword: this.search
      }
      getCompanysData(params).then(res => {
        const Models0 = res.Data.Models
        // Models0.forEach(element => {
        //   element.Users.shift()
        // })
        this.Models0 = Models0
      })
      getData(params).then(res => {
        const Models1 = res.Data.Models
        // Models1.forEach(element => {
        //   element.Users.shift()
        // })
        this.Models1 = Models1
      })
    },
    /**
     * @description: 单位类型清空数据
     * @param {params} Object 行数据
     * @return:
     */
    getUnitChange() {
      this.ruleForm.DepartmentCode = ''
      this.ruleForm.QF001 = ''
      this.ruleForm.d2 = ''
      // this.ruleForm.QF001Zh = ''
      // this.ruleForm.d1 = ''
      // this.ruleForm.d3 = ''
      // this.Users.value = ''
    },
    /**
     * @description: 获取临时下拉框数据
     * @param {params} Object 行数据
     * @return:
     */
    getUnitUserChange() {
      this.$forceUpdate()// 更新视图
      this.ruleForm.d2 = ''
      this.Users.value = ''
      this.getUser()
    },
    getUser() {
      var users
      if (this.ruleForm.usertype === '0') {
        users = this.Models0.find(n => n.Code === this.ruleForm.QF001) ? this.Models0.find(n => n.Code === this.ruleForm.QF001).Users : ''
      } else if (this.ruleForm.usertype === '1') {
        users = this.Models1.find(n => n.Code === this.ruleForm.DepartmentCode) ? this.Models1.find(n => n.Code === this.ruleForm.DepartmentCode).Users : ''
      }
      this.Users = users
    },
    /**
     * @description: 获取临时下拉框lable
     * @param {params} Object 行数据
     * @return:
     */
    getUnitUservalueChange(e) {
      // // 更新视图
      this.$forceUpdate()
      const d3 = this.Users.find(n => n.UserId === e).Name
      const d4 = this.Users.find(n => n.UserId === e).AccountName
      this.ruleForm.d3 = d3
      this.ruleForm.d4 = d4
    },
    /**
     * @description: 提交表单
     * @param {type}
     * @return:
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const method = this.dialogType === 'add' ? addVideoDeviceUsersData : updateVideoDeviceUsersData
          if (this.ruleForm.usertype === '0') {
            const name = this.Models0.find(n => n.Code === this.ruleForm.QF001).Name
            this.ruleForm.QF001Zh = name
          } else if (this.ruleForm.usertype === '1') {
            const name = this.Models1.find(n => n.Code === this.ruleForm.DepartmentCode).Name
            this.ruleForm.d1 = name
          }
          method(this.ruleForm).then(res => {
            this.$message.success(res.Msg)
            this.closeDialog()
            this.getDataList()
          }).catch(err => {
            console.error(err)
          })
        } else {
          console.error('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs[formName].clearValidate()
    },
    // 炸材
    getZcDataList() {
      this.zcLoading = true
      const param = {
        page: this.pageZc,
        pageSize: this.pageSizeZc
      }
      getzctypeList(param).then(res => {
        this.zcData = res.Data.Models
        this.totalZc = res.Data.TotalCount
        this.$nextTick(() => {
          this.zcLoading = false
        })
      }).catch(err => {
        this.zcLoading = false
        console.error(err)
      })
    },
    onSubmitForm(form, type, close) {
      const method = type === 'add' ? addzctype : updatezctype
      // form.zctypezh = this.zcDics.zctype.find(n => n.value === form.zctype).label
      method(form).then(res => {
        close()
        this.getZcDataList()
      }).catch(err => {
        console.error(err)
        close()
      })
    },
    onDeleted(form) {
      const param = {
        ID: form.id
      }
      delzctype(param).then(res => {
        this.getZcDataList()
      }).catch((err) => {
        this.$message.error(err)
      })
    }

  }
}
</script>
<style lang="scss" scoped>
/** *** 基本设置 start ******/
.departments{
  padding: 10px 10px;
  height: calc(100vh - 90px);
}
.header{
  margin: 10px 0 15px;
  .query{
    .input-search{
      width: 200px;
    }
  }
}
.pages{
  margin-top: 20px;
}
/** *** 基本设置 end ******/
.dialog-class{
  /deep/ .el-input{
    width: 200px;
  }
  .dia-footer{
    /deep/ .el-form-item__content{
    text-align: right
    }
  }
}
.zc-dialog{
  /deep/ .el-dialog{
    .el-dialog__body{
      padding: 10px 20px 30px 20px;
      height: calc(100vh - 200px);
    }
  }
}
</style>
