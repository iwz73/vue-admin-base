<!--
 * @Author: your name
 * @Date: 2020-03-11 08:54:13
 * @LastEditTime: 2020-04-02 15:33:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\oneStep\frontend\src\components\RightWarp\index.vue
 -->

<template lang="pug">
.layout-column(style="background: #f9f9f9; max-width: 240px;")
  .warp
    div.layout-row__center(style="width:100%;margin-top: 15px; margin-bottom:15px")
      el-input.input-search(
        placeholder='请输入关键词'
        v-model='searchKey'
        size="small"
        clearable
        style="width:210px"
        @clear="doSearch")
        el-button(slot="append" icon="el-icon-search" type="primary" size="mini" @click="doSearch")
    el-tabs(v-model="activeName" @tab-click="handleClick")
      el-tab-pane(name="first")
        span(slot="label")
          .span 你
          i(class="icon iconfont iconzan2")
          .span 好
        .tabs-content
          .content-name 热门文章
          .content-warp.layout-row(v-for="(item,index) in article[0].slice(0,5)" :key="index")
            .icon-warp.layout-row__center.align-center(:style="{color: colorList[Math.floor((Math.random()*colorList.length))]}")
              //- 分类图标
              i(v-if="!cags.find(n => parseInt(item.categories.split(',')[0]) == n.id)" class="icon iconfont iconiconset0401")
              i(v-else class="icon iconfont" :class="cags.find(n => parseInt(item.categories.split(',')[0]) == n.id).icon")
            .title-warp.flex1
              .title(@click="goDetail(item)") {{item.title}}
              .content.layout-row
                .pl
                  i(class="icon iconfont iconchangyongicon-")
                  span {{item.visits}}
                .pl(v-if="tags.find(n => parseInt(item.tags.split(',')[0]) == n.id)")
                  i(class="icon iconfont iconbiaoqian")
                  span {{tags.find(n => parseInt(item.tags.split(',')[0]) == n.id).tagName}}
      //- el-tab-pane(name="second")
      //-   span(slot="label")
      //-     .span 好
      //-     i(class="icon iconfont iconrespond")
      //-     .span 好
      //-   .tabs-content
      //-     .content-name 最新评论
      //-     .content-warp.layout-row(v-for="(item,index) in hotList" :key="index")
      //-       .icon-warp
      //-         //- 分类图标
      //-         i(class="icon iconfont" :class="[item.typeIcon]")
      //-       .title-warp.flex1
      //-         .title {{item.title}}
      //-         .content.layout-row
      //-           .pl
      //-             i(class="icon iconfont iconliaotian")
      //-             span {{item.visits}}
      //-           .pl
      //-             i(class="icon iconfont iconbiaoqian")
      //-             span {{item.bianqian}}
      el-tab-pane(name="third")
        span(slot="label")
          .span 好
          i(class="icon iconfont iconliwu")
          .span 好
        .tabs-content
          .content-name 最新文章
          .content-warp.layout-row(v-for="(item,index) in article[1].slice(0,5)" :key="index")
            .icon-warp.layout-row__center.align-center(:style="{color: colorList[Math.floor((Math.random()*colorList.length))]}")
              //- 分类图标
              i(v-if="!cags.find(n => parseInt(item.categories.split(',')[0]) == n.id)" class="icon iconfont iconiconset0401")
              i(v-else class="icon iconfont" :class="cags.find(n => parseInt(item.categories.split(',')[0]) == n.id).icon")
            .title-warp.flex1
              .title(@click="goDetail(item)") {{item.title}}
              .content.layout-row
                .pl
                  i(class="icon iconfont iconchangyongicon-")
                  span {{item.visits}}
                .pl(v-if="tags.find(n => parseInt(item.tags.split(',')[0]) == n.id)")
                  i(class="icon iconfont iconbiaoqian")
                  span {{tags.find(n => parseInt(item.tags.split(',')[0]) == n.id).tagName}}
      //- 博客信息
      .blog-info
        .blog-info-title.mb_10 博客信息
        .blog-info-warp
          .blog-info-list
            .blog-info-content
              i(class="icon iconfont iconxunzhang")
              span 文章数目
            span.tag {{total}}篇
          //- .blog-info-list
          //-   .blog-info-content
          //-     i(class="icon iconfont iconrespond")
          //-     span 评论数目
          //-   span.tag  {{blogInfo.commentNum}}
          .blog-info-list
            .blog-info-content
              i(class="icon iconfont iconchuxingtianshu")
              span 运行天数
            span.tag  {{dateStar}}天
          .blog-info-list
            .blog-info-content
              i(class="icon iconfont icondianboxindiantu")
              span 最后活动
            span.tag  {{activeTime}}
      //- 标签云
      .blog-info
        .blog-info-title.mb_10 标签云
        span.tag.mr_10(
          v-for="(item,index) in tags"
          :key="index"
          @click="goTags(item.id)")  {{item.tagName}}
      slot

  //- right-warp.right-warp
</template>

<script >
// import {
//   getCheckList } from '@/api/warehouses'
import { mapGetters } from 'vuex'
import ImageDialog from '@/components/ImageDialog'
import { datedifference, parseTime } from '@/utils/index'
export default {
  name: 'Index',
  components: {
    ImageDialog
  },
  filters: {
    filterImg: (val) => {
      return process.env.VUE_APP_BASE_API + val
    }
  },
  data() {
    return {
      activeName: 'first',
      hotList: [
        {
          typeIcon: 'iconjs',
          title: '你喜欢搞什么飞机,xxxxx',
          comments: 2354,
          bianqian: 'js'
        }
      ],
      blogInfo: {
        artcleNum: 123,
        commentNum: 456,
        searveNum: 4564,
        lastLog: '2020-15-66'
      },
      tagList: ['css', 'javascript'],
      dateStar: '',
      colorList: ['#808E9B', '#FBB950', '#53E5D8', '#FC6121', '#71BEF2', '#67C23A', '#F56C6C', '#409EFF', '#E6A23C']
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'tags', 'cags', 'article', 'total', 'search']),
    action() {
      return `${process.env.VUE_APP_BASE_API}/Basic/UploadImage`
    },
    activeTime() {
      if (this.article[3]) {
        return parseTime(this.article[3][0].activeTime, '{y}-{m}-{d}')
      } else {
        return 0
      }
    },
    searchKey: {
      get() {
        return this.$store.state.user.search
      },
      set(val) {
        this.$store.state.user.search = val
      }
    }
  },
  created() {
    this.dateStar = datedifference('2019-12-20', parseTime(new Date(), '{y}-{m}-{d}'))
  },
  mounted() {
    // this.cags
  },
  methods: {
    /** *** 通用 start *** **/

    /** *** 通用 end *** **/


    /** *** 按钮操作 start *** **/
    handleClick() {

    },
    goTags(id) {
      localStorage.setItem('tagId', id)
      this.$store.commit('user/SET_TAGID', id)
      this.$router.push(
        {
          path: `/welcome/tag`
        }
      )
      // this.$router.go(0)
      // this.$forceUpdate()
    },
    goDetail(item) {
      this.$router.push(
        {
          path: `/welcome/detail`,
          query: {
            id: item.id
          }
        }
      )
    },
    doSearch() {
      // this.$store.commit('user/SET_SEARCH', this.searchKey)
      // console.log(this.$route.fullPath)
      // this.$router.push({
      //   path: '/welcome/search',
      //   query: {
      //     keyword: this.searchKey
      //   }
      // })
      if (this.$route.path.includes('search')) {
        this.$emit('onSearch', this.searchKey)
      } else {
        this.$router.push({
          path: '/welcome/search'
        })
      }
    }
    /** *** 获取数据 end *** **/


    /** *** 其他 start *** **/

  }
}
</script>
<style lang="scss" scoped>
/***** 基本设置 start ******/
$setcolor: #777;
.warp{
  font-size: 16px;
  line-height: 20px;
  color: $setcolor;
  .icon{
    font-size: 16px;
  }
  /deep/ .el-tabs__header{
    margin-bottom: 0
  }
  /deep/ .el-tabs__content{
    position: relative;
  }
  /deep/ .el-tabs__nav-wrap{
    border-color: #a5acad;
    box-shadow: 4px 0 5px rgba(0, 0, 0, 0.055), 0 0 0 rgba(0, 0, 0, 0.438);
    &::after{
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      // height: 1px;
      // background-color: #E4E7ED;
      z-index: 1;
      background-color: transparent;
    }
    .el-tabs__nav{
      width: 100%;
      padding: 0 20px;
      // display: flex;
      // justify-content: space-around;
      .el-tabs__active-bar{
        left: 20px;
        background-color: #000
      }
      .el-tabs__item{
        // padding: 10px
        line-height: 50px;
        height: 50px;
        .span{
          display: inline;
          font-size: 10px;
          color: transparent
        }
      }
      .el-tabs__item.is-active{
        color: #000
      }
    }

  }
}
.tabs-content{
  padding: 20px;
  .content-name{
    margin-bottom: 10px
  }
  .content-warp{
    padding: 10px 0px;
    .icon-warp{
      width: 40px;
      height: 40px;
      overflow: hidden;
      // background: #999;
      margin-right: 15px;
      border: 2px solid #fff;
      border-radius: 20%;
      box-shadow: 2px 2px 3px #e1e1e1;
      .icon{
        font-size: 25px;
      }
    }
    .title-warp{
      .title{
        word-break: break-all;
        white-space: pre-wrap;
        font-size: 14px;
        cursor: pointer;
      }
      .pl{
        font-size: 13px;
        color: #a0a0a0;
        margin-right: 5px;
      }
    }
  }
}
.blog-info{
  padding: 20px;
  .blog-info-title{
    font-size: 16px;
  }
  .blog-info-warp{
    box-shadow: 0 1px 3px rgba(0,0,0,.05);
    border-radius: 2px;
    margin-bottom: 20px;
    padding-left: 0;
    background: #fff;
    .blog-info-list{
      font-size: 14px;
      padding: 15px 15px;
      opacity: .8;
      display: flex;
      justify-content: space-between;
      .blog-info-content{
        display: flex;
        align-items: center;
        .icon{
          margin-right: 5px;
        }

      }

    }
  }
}
.tag{
  height: 18px;
  font-size: 12px;
  background-color: #cfdadd;
  text-shadow: 0 1px 0 rgba(0,0,0,.2);
  display: inline-block;
  min-width: 10px;
  padding: 0px 7px;
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  padding-top: 2px;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  // margin-bottom: -2px;
}
.input-search{
  // margin: 0 auto;
}
</style>
