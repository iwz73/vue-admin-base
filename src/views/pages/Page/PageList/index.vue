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
    .article-warp(v-for="(item,index) in dataList" :key="index")
      h1.title.mb_15(@click="goPost(item)") {{item.title}}
      div.article-content#article(
        v-html="item.abstract || '暂时无可提供的摘要'"
        :class="{'article-p-code': true}"
        @click="")
      //- .cut-line
      .article-info.layout-row.align-center(:class="{'article-p-code': true}")
        .span-warp
          i(class='icon iconfont iconRectangleCopy')
          span {{item.author}}
        .span-warp
          i(class='icon iconfont iconRectangleCopy1')
          span {{item.updateTime.slice(0, 10)}}
    .pages
      el-pagination(
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total")
  right-warp.right-warp(@onSearch="doSearch")
    //- .catalog#catalog(ref="catalog" :class="headerFixed?'isFixed':''")
</template>

<script >
import { getArticleList } from '@/api/index'
import { mapGetters, mapState } from 'vuex'
import RightWarp from '@/components/RightWarp'
import ImageDialog from '@/components/ImageDialog'
import hljs from 'highlight.js/lib/highlight'
import { getUrlKey } from '@/utils'
// import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/monokai.css'
// import { highlightLineNumber } from '@/utils/highlight-line-number'

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
      article: {
        title: '30分钟写一个简单QQ自动回复机器人',
        info: {
          author: 'zzz',
          time: '2019-09-19',
          views: 5655,
          comment: 45,
          wordNumber: 4564,
          type: 'js'
        }
      },
      articleHtml: '',
      offsetTop: '',
      offsetHeight: '',
      headerFixed: false,
      activeStep: 0,
      total: 1,
      currentPage: 1,
      pageSize: 20,
      dataList: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'tags', 'cags', 'tagId', 'search']),
    ...mapState({
      device: state => state.app.device
    }),
    action() {
      return `${process.env.VUE_APP_BASE_API}/Basic/UploadImage`
    }
  },
  watch: {
    tagId(news) {
      this.getDataList()
    }
  },
  created() {
    const keyword = getUrlKey('keyword', window.location.href)
    if (keyword) {
      this.$store.commit('user/SET_SEARCH', keyword)
    }
    if (!this.$route.fullPath.includes('detail')) {
      // const id = getUrlKey('id', window.location.href)
      // if (id) {
      //   localStorage.setItem('worderId', id)
      // } else {
      //   id = localStorage.getItem('worderId')
      // }
      // this.tagId = id

      this.getDataList()
    }
    // 判断是哪个路由
    window.hljs = hljs
    // require('@/utils/highlightjs-line-numbers')
    // require('highlightjs-line-numbers.js/src/highlightjs-line-numbers.js') // 官方queryAll() 值不正确
  },
  mounted() {
    // 目录吸顶监听滚动
    // window.addEventListener('scroll', this.handleScroll)
  },
  updated() {
    // if (document.querySelectorAll('.outline-inside').length === 0) {
    //   // 生成高亮
    //   hljs.initHighlightingOnLoad()
    //   hljs.initLineNumbersOnLoad()
    //   // highlightLineNumber()
    //   // 代码行号
    //   hljs.registerLanguage('javascript', javascript)
    //   // 生成目录
    //   // this.creatTag()
    //   // // new Gumshoe('#my-awesome-nav a')
    //   // // 获取目录高度
    //   // this.getTagHigh()
    // }
  },
  deforeDestroyed() {
    // window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    /** *** 通用 start *** **/
    handleCurrentChange(e) {
      this.currentPage = e
      this.getDataList()
    },
    handleSizeChange(e) {
      this.pageSize = e
      this.getDataList()
    },
    doSearch() {
      this.pageSize = 20
      this.currentPage = 1
      // window.location.href =
      this.getDataList()
    },
    /** *** 通用 end *** **/


    /** *** 按钮操作 start *** **/
    creatTag() {
      const AutocJs = require('@/utils/autoc.js')
      const that = this
      // 创建 Outline 实例
      const navigation = new AutocJs({
        // 文章正文 DOM 节点的 ID 选择器
        article: '#article',
        // 要收集的标题选择器
        selector: 'h1,h2,h3,h4,h5,h6',
        // 侧边栏导航的标题
        title: '文章导读',
        // 文章导读导航的位置
        // outside - 以侧边栏菜单形式显示（默认值）
        // inside - 在文章正文一开始的地方显示
        position: 'inside',
        // 标题图标链接的 URL 地址
        // （默认）没有设置定制，点击链接页面滚动到标题位置
        // 设置了链接地址，则不会滚动定位
        anchorURL: '',
        // 链接的显示位置
        // front - 在标题最前面（默认值）
        // back - 在标题后面
        anchorAt: 'front',
        // 是否生成文章导读导航
        isGenerateOutline: true,
        // 是否在文章导读导航中显示段落章节编号
        isGenerateOutlineChapterCode: true,
        // 是否在正文的文章标题中显示段落章节编号
        isGenerateHeadingChapterCode: false,
        // 是否在正文的文章标题中创建锚点
        isGenerateHeadingAnchor: true
      })
      // 锚点问题
      document.querySelectorAll('.outline-inside .outline-link').forEach((el, index) => {
        el.addEventListener('click', function(e) {
          // 锚点滚动
          // 获取需要滚动的距离
          // const href = el.getAttribute('href')
          // const offsetTop = document.querySelector(href).offsetTop
          // const total = offsetTop
          // // 计算每小段距离
          // let step = total / 50
          // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
          // if (total > scrollTop) {
          //   smoothDown()
          // } else {
          //   const newTotal = scrollTop - total
          //   step = newTotal / 50
          //   smoothUp()
          // }
          // function smoothDown() {
          //   if (scrollTop < total) {
          //     scrollTop += step
          //     document.body.scrollTop = scrollTop
          //     document.documentElement.scrollTop = scrollTop
          //     window.pageYOffset = scrollTop
          //     setTimeout(smoothDown, 10)
          //   } else {
          //     document.body.scrollTop = total
          //     document.documentElement.scrollTop = total
          //     window.pageYOffset = total
          //   }
          // }
          // function smoothUp() {
          //   if (scrollTop > total) {
          //     scrollTop -= step
          //     document.body.scrollTop = scrollTop
          //     document.documentElement.scrollTop = scrollTop
          //     window.pageYOffset = scrollTop
          //     setTimeout(smoothUp, 10)
          //   } else {
          //     document.body.scrollTop = total
          //     document.documentElement.scrollTop = total
          //     window.pageYOffset = total
          //   }
          // }
          // document.getElementById(el.getAttribute('rel')).scrollIntoView()
          that.activeStep = index
          that.setActiveTag()
        })
      })
      this.setActiveTag()
    },
    setActiveTag() {
      // 设置样式
      document.querySelectorAll('.outline-inside .outline-link').forEach(e => {
        e.parentNode.classList.remove('is-clicked')
        e.classList.remove('is-clicked-a')
      })
      document.querySelectorAll('.outline-inside .outline-link')[this.activeStep].parentNode.classList.add('is-clicked')
      document.querySelectorAll('.outline-inside .outline-link')[this.activeStep].classList.add('is-clicked-a')
    },
    getTagHigh() {
      const header = document.querySelector('.catalog')
      // 这里要得到top的距离和元素自身的高度
      this.offsetTop = header.offsetTop
      this.offsetHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 滚动条偏移量
      this.offsetWidth = header.offsetWidth
      this.headerFixed = this.offsetWidth > this.offsetTop
    },
    handleScroll() {
      // 得到页面滚动的距离
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 滚动条偏移量
      // 判断页面滚动的距离是否大于吸顶元素的位置
      this.headerFixed = scrollTop > this.offsetTop

      // 滚动监听
      document.querySelectorAll('.outline-heading').forEach((el, index) => {
        if (scrollTop >= el.offsetTop) {
          this.activeStep = index
          this.setActiveTag()
        }
      })
    },
    goPost(item) {
      // const routes = this.$router.options.routes
      // const topRouter = routes.find(n => n.path.split('/')[1] === this.$route.fullPath.split('/')[1])
      // console.log(topRouter)
      // console.log(this.$route.fullPath)
      // for (let i = 0; i < topRouter.children.length; i++) {
      //   const n = topRouter.children[i]
      //   if (topRouter.path + '/' + n.path === this.$route.fullPath) {
      //     // 判断是否有detail路由
      //     if (n.children && n.children.findIndex(j => j.path === 'detail') >= 0) {
      //       const chid = n.children.findIndex(j => j.path === 'detail')
      //       n.children[chid] = {
      //         path: 'detail',
      //         name: n.name + i,
      //         hidden: true,
      //         component: (res) => require([`@/views/pages/Post/PageDtl/index.vue`], res),
      //         meta: { title: item.title }
      //       }
      //     } else {
      //       if (!n.children) {
      //         n.children = []
      //       }
      //       n.children.push(
      //         {
      //           path: 'detail',
      //           name: n.name + i,
      //           hidden: true,
      //           component: (res) => require([`@/views/pages/Post/PageDtl/index.vue`], res),
      //           meta: { title: item.title }
      //         }
      //       )
      //     }
      //     break
      //   } else {
      //     for (let index = 0; index < n.children.length; index++) {
      //       const e = n.children[index]
      //       if (topRouter.path + '/' + n.path + '/' + e.path === this.$route.fullPath) {
      //         if (e.children && e.children.findIndex(j => j.path === 'detail') >= 0) {
      //           const cid = e.children.findIndex(j => j.path === 'detail')
      //           e.children[cid] = {
      //             path: 'detail',
      //             name: e.name + index,
      //             hidden: true,
      //             component: (res) => require([`@/views/pages/Post/PageDtl/index.vue`], res),
      //             meta: { title: item.title }
      //           }
      //         } else {
      //           if (!e.children) {
      //             e.children = []
      //           }
      //           e.children.push(
      //             {
      //               path: 'detail',
      //               name: e.name + index,
      //               hidden: true,
      //               component: (res) => require([`@/views/pages/Post/PageDtl/index.vue`], res),
      //               meta: { title: item.title }
      //             }
      //           )
      //         }
      //         break
      //       }
      //     }
      //   }
      // }
      // console.log(topRouter)
      // // this.$store.commit('permission/SET_ROUTES', routes)
      // this.$router.options.routes = routes
      // this.$router.addRoutes(routes)
      // if (this.$route.fullPath.includes('tag')) {
      //   this.$router.push({
      //     path: `${this.$route.fullPath.split('?')[0]}/detail?id=${item.id}`
      //   })
      // } else {
      //   this.$router.push({
      //     path: `${this.$route.fullPath}/detail?id=${item.id}`
      //   })
      // }
      if (this.$route.path.includes('search')) {
        this.$router.push({
          path: `/welcome/detail?id=${item.id}`
        })
      } else {
        this.$router.push({
          path: `${this.$route.fullPath}/detail?id=${item.id}`
        })
      }
    },
    /** *** 获取数据 end *** **/
    getDataList() {
      // 判断路由 首页
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.search,
        tags: '',
        categories: ''
      }
      const fullPath = this.$route.fullPath.split('/')
      if (fullPath[1] === 'Page') {
        params.categories = this.cags.find(n => n.eName === fullPath[fullPath.length - 1]).id
      }
      if (this.$route.fullPath.includes('tag')) {
        params.tags = localStorage.getItem('tagId')
      }
      this.loading = true
      getArticleList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        this.dataList = res.Data.data
        this.total = res.Data.total
      }).catch(err => {
        this.loading = false
        console.error(err)
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
.article-warp{
  background: $arctilBgc;
  padding: 30px;
  width: 768px;
  max-width: 100%;
  border-radius: 6px;
  border: none;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 40px;
  word-wrap:break-word;
  word-break:normal;
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


</style>

<style lang="scss">
.article-p-code{
  p{
    &>code{
      color: #E74C3C;
      // padding: 2px 5px;
      white-space: nowrap;
      background: #fff;
      // border: solid 1px #e1e4e5;
      font-family: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",Courier,monospace;
      overflow-x: auto;
      // border-radius: 1px;
    }
  }
}
.catalog{
  padding: 0 15px;
  background: #fff;
  color: #777;
}
.outline-link{
  color: #777 !important;
}
.outline-link:hover{
  color: #409EFF !important;
}
.is-clicked{
  background: #f5f5f5
}
.is-clicked-a{
  color: #000 !important;
}
.pages{
  text-align: center;
  margin-bottom: 25px;
}
</style>
