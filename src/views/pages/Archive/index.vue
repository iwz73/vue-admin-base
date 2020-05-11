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
    .article-warp
      el-timeline
        el-timeline-item(
          v-for="(item, index) in dataList"
          :key="index"
          :icon="item.icon"
          :color="item.color"
          :type="item.type"
          size="large"
          :timestamp="item.time"
          placement="top")
          div.layout-column(v-for="(list,i) in item.children" :key="i")
            span.timeline-title(@click="goDetail(list)") {{list.title}}
            div.timeline-tip
              i.el-icon-date
              span.timeline-tiem {{ list.creatTime.slice(8,10)}}日 发布


  right-warp.right-warp
    //- .catalog#catalog(ref="catalog" :class="headerFixed?'isFixed':''")
</template>

<script >
import { getArticleList } from '@/api/index'
import { mapGetters, mapState } from 'vuex'
import RightWarp from '@/components/RightWarp'
import ImageDialog from '@/components/ImageDialog'
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
      loading: false,
      activities: [{
        content: '支持使用图标',
        timestamp: '2018-04-12 20:46',
        size: 'large',
        type: 'primary',
        icon: 'el-icon-more'
      }, {
        content: '支持自定义颜色',
        timestamp: '2018-04-03 20:46',
        color: '#0bbd87'
      }, {
        content: '支持自定义尺寸',
        timestamp: '2018-04-03 20:46',
        size: 'large'
      }, {
        content: '默认样式的节点',
        timestamp: '2018-04-03 20:46'
      }],
      dataList: [],
      colorList: ['#808E9B', '#FBB950', '#53E5D8', '#FC6121', '#71BEF2', '#67C23A', '#F56C6C', '#409EFF', '#E6A23C']

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
  },
  updated() {

  },
  deforeDestroyed() {
  },
  methods: {
    /** *** 通用 start *** **/

    /** *** 通用 end *** **/


    /** *** 按钮操作 start *** **/
    goDetail(row) {
      this.$router.push(
        {
          path: `/welcome/detail`,
          query: {
            id: row.id
          }
        }
      )
    },
    /** *** 按钮操作 end *** **/


    /** *** 获取数据 end *** **/
    getDataList() {
      // 判断路由 首页
      const params = {
        page: 1,
        pageSize: 2000,
        keyword: '',
        tags: '',
        categories: ''
      }
      this.loading = true
      getArticleList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data.data
        // 处理data 按月弄出来
        const active = []

        data.forEach((n, index) => {
          console.log(n.creatTime)
          if (index === 0) {
            active.push({
              time: n.creatTime.slice(0, 7),
              children: [],
              icon: 'el-icon-s-help',
              color: this.colorList[Math.floor((Math.random() * this.colorList.length))]
            })
          } else {
            if (n.creatTime.slice(0, 7) !== data[index - 1].creatTime.slice(0, 7)) {
              active.push({
                time: n.creatTime.slice(0, 7),
                children: [],
                icon: 'el-icon-s-help',
                color: this.colorList[Math.floor((Math.random() * this.colorList.length))]

              })
            }
          }
          active.forEach((e, i) => {
            if (n.creatTime.slice(0, 7) === e.time) {
              e.children.push(n)
            }
          })
        })
        console.log(active)
        active.push({
          time: '开始',
          // color: 'red',
          type: 'success',
          icon: 'el-icon-camera'
        })
        this.dataList = active
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
  background: #fff;
  padding-top: 50px;

  font-weight: 300;
  /deep/ .el-timeline-item__timestamp{
    font-size: 18px;
    font-weight: 400;
    color: #666;
  }
  .timeline-title{
    margin: 10px 0 8px 0;
    font-weight: 400;
    color: #566;
    cursor: pointer;
  }
  .timeline-tip{
    margin-bottom: 5px;
    color: #999;
    font-size: 13px;
  }
  .timeline-tiem{
    padding-left: 5px;
  }
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
.card-class{
  width: 300px;
  /deep/ .el-card__body{
    padding: 10px;
  }
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
