<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2020-04-08 16:18:31
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
.edit-dialog.layout-column
  .layout-row__between
    .query()
      el-input.input-search(
        v-if="hasSearch"
        :placeholder='searchHolder || "请输入"'
        style='width:250px'
        v-model='search' size="small" clearable @clear="doSearch")
        el-button(slot="append" icon="el-icon-search" type="primary" size="small" @click="doSearch")

    .operation
      el-button(
        v-if="userInfo.UserType === 'Company' || operationAble"
        @click="operation"
        type="primary"
        size="small") {{operationTitle}}
      slot(name="add")
  .dialogtable-warp.layout-column.flex1
    el-table.flex1(
      v-loading="loading"
      :data='tableData'
      style='width: 100%'
      :header-cell-style='headerStyle'
      height="50"
      border
      ref="dialogTable"
      empty-text="没有数据")
      el-table-column(label="#" align="center" type="index")
      el-table-column(
        v-for="(item,index) in tableColumns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width")
      el-table-column(label="操作" align="center" width="180px" fixed="right")
        template(slot-scope='scope')
          el-button(
            v-if="userInfo.UserType !== 'Company' && !operationAble"
            type="primary"
            plain
            @click="viewRow(scope.row)"
            size="small") 查看
          div(v-else)
            el-button(
              v-if="!editDisable"
              type="primary" plain @click="editRow(scope.row)" size="small") 编辑
            el-button(v-if="!deletedDisable" type="danger" plain @click="deleted(scope.row)" size="small") 删除
    .pages(v-if="hasPages")
      el-pagination(
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total")
  //- 弹窗
  el-dialog.add-dialog(
    :title='title',
    :visible.sync='visible'
    :width='dialogWidth'
    top="10vh"
    :before-close="handleDialogClose"
    :close-on-click-modal="false"
    :append-to-body="true")
    el-form(
      :model='ruleForm'
      ref='ruleForm'
      :label-width='labelWidth')
      div(
        v-for="(item,index) in formColumns"
        :key="index")
        el-form-item(
          v-if="item.type==='password'"
          :prop='item.prop'
          :label="item.label"
          :rules="[{required: dialogType==='add'?true:false, message:'此项为必填项' }]")
          el-input(
            :key='passwordType',
            ref='password',
            v-model='ruleForm[item.prop]',
            :type='passwordType',
            placeholder='请输入密码',
            name='password',
            tabindex='2',
            auto-complete='on',
            size='small'
            :class="[item.line?'line':'']"
            )
          span.show-pwd(@click='showPwd')
            svg-icon(:icon-class="passwordType === 'password' ? 'eye' : 'eye-open'")
          el-button(type='success', @click="createdPwd" size="small" style='margin-left:15px') 随机生成
        el-form-item(
          v-else-if="item.type === 'selectId'"
          :prop='item.prop'
          :label="item.label"
          :rules="[{required: dialogType==='add'?true:false, message:'此项为必填项' }]")
          el-select(
            v-model="ruleForm[item.prop]"
            placeholder="请选择"
            size="small"
            :class="[item.line?'line':'']"
            :disabled="dialogType==='view'")
            el-option(
              v-for="(list, index) in dics[item.prop]"
              :key="index"
              :label="list.Name"
              :value="list.Id")
        el-form-item(
          v-else
          :prop='item.prop'
          :label="item.label"
          :rules="[{required: item.ruleDis?false:true, message:'此项为必填项' }]")
          el-select(
            v-if="item.type === 'select'"
            v-model="ruleForm[item.prop]"
            placeholder="请选择"
            size="small"
            filterable
            :class="[item.line?'line':'']"
            :disabled="dialogType==='view'")
            el-option(
              v-for="(list, index) in dics[item.prop]"
              :key="index"
              :label="list.label+' '+(list.appusername || '')"
              :value="list.value")

          el-date-picker(
            v-else-if="item.type === 'date'"
            v-model="ruleForm[item.prop]"
            value-format="yyyy-MM-dd"
            type="date"
            :class="[item.line?'line':'']"
            placeholder="选择日期"
            size="small"
            :disabled="dialogType==='view'")
          el-date-picker(
            v-else-if="item.type === 'datetime'"
            v-model="ruleForm[item.prop]"
            type="datetime"
            :class="[item.line?'line':'']"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            size="small"
            :disabled="dialogType==='view'")
          el-cascader(
            v-else-if="item.type === 'cascader'"
            :options='dics[item.prop]',
            :show-all-levels='false'
            v-model="ruleForm[item.prop]"
            size="small"
            :class="[item.line?'line':'']"
            filterable
            :disabled="dialogType==='view'")
          el-input(
            v-else-if="item.type==='textarea'"
            type='textarea',
            :class="[item.line?'line':'']"
            :autosize='{ minRows: 2, maxRows: 4}',
            placeholder='请输入内容',
            v-model='ruleForm[item.prop]')
          el-input(
            v-else
            v-model='ruleForm[item.prop]'
            size="small" placeholder='请输入'
            :class="[item.line?'line':'']"
            :disabled="dialogType==='view' || (dialogType==='add' && item.disabled)")
      el-form-item.dia-footer
        el-button(@click="closeDialog" size="small") 取消
        el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
</template>

<script>
import { mapGetters } from 'vuex'
import { randomPassword } from '@/utils'
import { setTimeout } from 'timers'
export default {
  name: 'EditDialog',
  props: {
    operationTitle: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    50: {
      type: String,
      default: '50px'
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    dics: {
      type: Object,
      default() {
        return {}
      }
    },
    operationAble: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: '450px'
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    pageSize: {
      type: Number,
      default: 20
    },
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    },
    hasPass: {
      type: Boolean,
      default: false
    },
    editDisable: {
      type: Boolean,
      default: false
    },
    deletedDisable: {
      type: Boolean,
      default: false
    },
    hasPages: {
      type: Boolean,
      default: false
    },
    hasSearch: {
      type: Boolean,
      default: false
    },
    searchHolder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title: '',
      visible: false,
      ruleForm: {},
      dialogType: 'add',
      passwordType: 'password',
      search: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    tableColumns() {
      return this.columns.filter(n => !n.formOnly)
    },
    formColumns() {
      return this.columns.filter(n => !n.tableOnly)
    }
  },
  watch: {
    tableData(n, o) {
      this.$refs.dialogTable.doLayout()
    }
  },
  created() {
  },
  methods: {
    headerStyle() {
      return 'background-color: #FAFAFA;font-size:12px'
    },
    operation() {
      // this.$emit('onOperation')
      this.visible = true
      const ruleForm = {}
      this.columns.map(n => {
        ruleForm[n.prop] = ''
      })
      this.ruleForm = Object.assign({}, ruleForm)
      this.title = '添加'
      this.dialogType = 'add'
      this.$nextTick(() => {
        this.resetForm('ruleForm')
      })
    },
    viewRow(row) {
      this.ruleForm = Object.assign({}, row)
      this.visible = true
      this.title = '详情'
      this.dialogType = 'view'
      setTimeout(() => {
        this.resetForm('ruleForm')
      }, 100)
    },
    editRow(row) {
      this.ruleForm = Object.assign({}, row)
      this.visible = true
      this.title = '编辑'
      this.dialogType = 'update'
    },
    deleted(row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('onDeleted', row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDialogClose(done) {
      this.resetForm('ruleForm')
      done()
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('onSubmitForm', this.ruleForm, this.dialogType, () => {
            this.closeDialog()
          })
        } else {
          console.error('error submit!!')
          return false
        }
      })
    },
    closeDialog() {
      this.ruleForm = {}
      this.$refs['ruleForm'].resetFields()
      this.resetForm('ruleForm')
      this.visible = false
    },
    handleCurrentChange(e) {
      this.$emit('onHandleCurrentChange', e)
    },
    handleSizeChange(e) {
      this.$emit('onHandleSizeChange', e)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    /**
     * @description: 生成随机密码
     * @param {type}
     */
    createdPwd() {
      const password = randomPassword(6)
      this.$set(this.ruleForm, 'Password', password)
    },
    doSearch() {
      this.$emit('onDoSearch', this.search)
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-dialog{
  height: 100%;
  width: 100%;
}
.operation{
  text-align: right;
  margin-bottom: 15px;
}
.dia-footer{
  text-align: right
}
.add-dialog{
  /deep/ .el-dialog{
    .el-dialog__body{
      padding: 10px 20px 30px 20px;
      height: calc(100vh - 200px);
      overflow-y: auto;
    }
  }
  /deep/ .el-input{
    width: 200px;
  }
}
.show-pwd {
  position: absolute;
  left: 170px;
  top: 0px;
  font-size: 16px;
  color: #C0C4CC;
  cursor: pointer;
  user-select: none;
}
.line{
  width: 100% !important
}
.pages{
  margin-top: 20px;
}
.dialogtable-warp{
  height: calc(100% - 48px);
}
</style>
