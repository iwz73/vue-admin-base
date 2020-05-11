<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-21 16:07:15
 * @LastEditTime: 2020-04-02 16:23:09
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getTags, getArticleOrder, getCategoriesAll } from '@/api/index'
export default {
  name: 'App',
  data() {
    return {
    }
  },
  computed: {

  },
  created() {
    this.getBaseData()
  },
  mounted() {

  },
  methods: {
    getBaseData() {
      const param1 = {
        page: 1,
        pageSize: 2000,
        keyword: ''
      }
      const param2 = {
        page: 1,
        pageSize: 5
      }
      Promise.all([getTags(param1), getArticleOrder(param2), getCategoriesAll()]).then(res => {
        this.$store.commit('user/SET_TAGS', res[0].Data.data)
        this.$store.commit('user/SET_ARTICLEORDER', res[1].Data)
        this.$store.commit('user/SET_CAGD', res[2].Data.data)
        this.$store.commit('user/SET_TOTAL', res[1].Data[2][0].total)
      })
    }
  }
}
</script>
<style lang="scss">
// #app{
//   /deep/ .el-table {
//     th.gutter{
//       width: 17px !important;
//       display: table-cell!important;
//     }
//     colgroup.gutter{
//       width: 17px!important;
//       display: table-cell!important;
//     }
//   }
// }
.base-data{
  border: 1px solid rgb(139, 139, 139);
  padding: 10px 0 10px 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  font-size: 14px;
  .span-label{
    padding-right: 15px;
    color: #606266
  }
}
.deep-table{
  // /deep/ .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
  //   border-right: 1px solid #666;
  // }
  // /deep/ .el-table--border th, .el-table__fixed-right-patch {
  //   border-bottom: 1px solid #666;
  // }
  // /deep/ td, th.is-leaf {
  //   border-bottom: 1px solid #666;
  // }
  // /deep/ .el-table--border, .el-table--group {
  //   border: 1px solid #666;
  // }
}
body .el-table th.gutter{
  display: table-cell!important;
}

body .el-table colgroup.gutter{
  display: table-cell!important;
}
body  .el-table .warning-row {
  background: oldlace;
}

body .el-table .success-row {
  background: #f0f9eb;
}
.app-main{
  background: #F0F3F4;
}
blockquote{
  color: #666;
  padding: 2px 1em;
  margin: 10px 0;
  border-left: 4px solid #cbcbcb;
  background-color: #f8f8f8;
  p{
    margin: 5px 0;
  }
}
</style>
