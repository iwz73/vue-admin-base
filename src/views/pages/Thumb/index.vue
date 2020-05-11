<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2020-03-13 11:11:57
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
router-view(v-if="$route.fullPath.includes('detail')")
.index#layScroll(v-else :class="[device==='mobile'? 'layout-column' : 'layout-row']")
  .content-warp.flex1(v-loading="loading")
    .thumb
      .thumb-head.layout-row
        img(:src="logo" :class="[device==='mobile'? 'thumb-logo__small' : 'thumb-logo']")
        .thumb-rigth
          .thumb-right-head.layout-row
            .thumb-right-name 周正志
            i.el-icon-coordinate
            span.zy 前端工程师
          .thumb-rigth-conment
            span#one-word
          .thumb-rigth-footer
            el-button(type="info" round size="mini" disabled) 关于我
            el-button(type="info" round size="mini" disabled) 留言
      .thumb-content(v-loading="loading")
        .thumb-list.layout-row(v-for="(item,index) in thumbList" :key="index")
          .thumb-list-left
            img.thumb-list-logo(:src="logo")
          .thumb-list-right
            .user-name {{item.userName}}
            .thumb-list-content {{item.body}}
            .thumb-list-time {{item.creatTime}}

  right-warp.right-warp
    //- .catalog#catalog(ref="catalog" :class="headerFixed?'isFixed':''")
</template>

<script >
import { getThumbs } from '@/api/user'
import { mapGetters, mapState } from 'vuex'
import RightWarp from '@/components/RightWarp'
import ImageDialog from '@/components/ImageDialog'
// import { highlightLineNumber } from '@/utils/highlight-line-number'
import { init } from 'ityped'
// import '@/utils/gumshoe.js'
export default {
  name: 'Index',
  components: {
    ImageDialog,
    RightWarp
  },
  filters: {
    filterImg: (val) => {
      return process.env.VUE_APP_BASE_API + val
    }
  },
  data() {
    return {
      logo: require('@/assets/image/logo.png'),
      thumbList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'tags', 'cags', 'tagId']),
    ...mapState({
      device: state => state.app.device
    }),
    action() {
      return `${process.env.VUE_APP_BASE_API}/Basic/UploadImage`
    }
  },
  watch: {

  },
  created() {
    this.getDataList()
  },
  mounted() {
    const oneElement = document.querySelector('#one-word')
    init(oneElement, {
      disableBackTyping: true,
      showCursor: true,
      // placeholder: true,
      strings: ['不想干总是有理由的，想干总是有办法的。']
    })

    // const descStr: Element = this.$refs.descStr as Element;
  },
  updated() {

  },
  deforeDestroyed() {
  },
  methods: {
    /** *** 通用 start *** **/

    /** *** 通用 end *** **/


    /** *** 按钮操作 start *** **/

    /** *** 按钮操作 end *** **/


    /** *** 获取数据 end *** **/
    getDataList() {
      const params = {
        page: 1,
        pageSize: 2000,
        keyword: ''
      }
      this.loading = true
      getThumbs(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        this.thumbList = res.Data.data
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
    }

    /** *** 其他 start *** **/

  }
}
</script>
<style lang="scss" scoped>
/***** 基本设置 start ******/
$articleInfoColor: #a0a0a0;
$indexBackgroundC: #F0F3F4;
$titleBackgroundC: #F9F9F9;
$arctilBgc:#fff;
$articleColor: #333;
.index{
  height: 100%;
  background: $indexBackgroundC
}
.content-warp{
  font-weight: 300;
}
.warp-header{
  padding: 20px;
  background: $titleBackgroundC;
}
.title{
  font-weight: 400;
  font-size:30px;
  text-align:left;
  cursor: pointer;
  // margin:0;
  margin-top: 0;
  font-size: 22px;
  color: #555;
  // line-height: 40px;
}
.article-info{
  color: $articleInfoColor;
  font-size: 13px;
  margin-top: 15px;
  .span-warp{
    display: flex;
    align-items: center;
    margin-right: 15px;
    .icon{
      margin-right: 5px
    }
  }
}
.thumb{
  padding: 20px 5px;
  width: 768px;
  max-width: 100%;
  border-radius: 6px;
  border: none;
  margin: 0 auto;
  word-wrap:break-word;
  word-break:normal;
  .thumb-rigth{
    margin-left: 30px;
    .thumb-right-head{
      margin-bottom: 20px;
      // justify-content: flex-end;
      .thumb-right-name{
        font-weight: 500;
        font-size: 32px;
      }
      .el-icon-coordinate, .zy{
        font-size: 12px;
        align-self: flex-end;
      }
      .el-icon-coordinate{
        font-size: 14px;
        padding: 0 8px;
      }
    }
    .thumb-rigth-conment{
      color: #666;
    }
    .thumb-rigth-footer{
      margin-top: 12px;
    }
  }
  .article-footer{
    font-size: 12px;
    color: #9b9b9b;
  }
}
.right-warp{
  min-width: 240px;
  max-width: 100%;
}
.cut-line{
  margin-top: 15px;
  margin-bottom: 15px;
  width: 100%;
  height: 1px;
  background: #d1d1d1;
  overflow: hidden;
  font-size: 0;
}
.article-content{
  color: #777;
  font-size: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d1d1d1;
  font: 87.5%/1.2 -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
  line-height: 1.5;
  h1{
    line-height: 1.2 !important
  }
}
.isFixed{
  position: fixed;
  top: 50px;
  right: 0px;
  width: 240px;
}

.thumb-head{
  padding: 20px 15px 10px 15px;
  .thumb-logo{
    width: 120px;
    height: 120px;
  }
  .thumb-logo__small{
    width: 70px;
    height: 70px;
  }
}
.thumb-content{
  margin-top: 20px;
  background: #fff;
  padding: 30px;
  .thumb-list{
    .thumb-list-left{
      margin-right: 10px;
      .thumb-list-logo{
        width: 42px;
        height: 42px;
      }
    }
    .thumb-list-right{
      // margin-left: 50px;
      padding-bottom: 15px;
      margin-bottom: 15px;
      border-bottom: 1px #eee solid;
      color: #555;
      color: #555;
      .user-name{
        font-weight: 400;
        font-size: 16px;
        margin-bottom: 10px;
      }
      .thumb-list-content {
        margin: 5px 0 12px 0;
        line-height: 1.5;
        font-size: 16px;
      }
      .thumb-list-time{
        font-size: 12px;
        font-family: "Consolas","Microsoft JhengHei","Apple LiGothic Medium,Microsoft YaHei","微软雅黑","Arial",sans-serif;
      }
    }
  }

}
</style>
