<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" class="logo-shadow" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="header-logo layout-row__center align-center">
        <el-avatar :size="isCollapse ? 30: 50" :src="circleUrl" />
        <div v-if="!isCollapse" class="header-content">
          <div class="title">月色真美</div>
          <div class="tip">只要心在跳</div>
        </div>
      </div>
      <el-menu
        class="menu-warp"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 固定菜单 -->
        <div v-if="!isCollapse" class="side-name mb_10 mt_15">
          导航
        </div>
        <sidebar-item v-for="route in routeSingle" :key="route.path" :item="route" :base-path="route.path" />
        <!-- 间隔 -->
        <div class="line-jg" />
        <!-- 分类菜单 -->
        <div v-if="!isCollapse" class="side-name mb_10 mt_15">
          组成
        </div>
        <sidebar-item v-for="route in routeMultiple" :key="route.path" :class="{ 'icon-left': isCollapse}" :item="route" :base-path="route.path" />
      </el-menu>
      <div class="footer layout-row__around align-center" :class="{'footer-coll': isCollapse}">
        <div class="foot-list layout-column align-center" @click="goAdmin">
          <i class="icon iconfont iconsetting" />
          <span>管理</span>
        </div>
        <div class="foot-list layout-column align-center">
          <i class="icon iconfont iconwifi" />
          <span>文章</span>
        </div>
        <div class="foot-list layout-column align-center">
          <i class="icon iconfont iconrespond" />
          <span>评论</span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  // filters: {
  //   filterRouter: (val) => {
  //     console.log(val)
  //     return val
  //   },
  //   filterRouterSingle: (val) => {
  //     console.log(val)
  //     // return process.env.VUE_APP_BASE_API + val
  //   }
  // },
  data() {
    return {
      circleUrl: require('@/assets/image/header.jpg'),
      home: {}
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'routes'
    ]),
    // routes() {
    //   console.log(this.$router.options.routes)
    //   return this.$router.options.routes
    // },
    routeSingle() {
      // this.$router.options.routes.find(n => n.path === '/')
      return this.$router.options.routes.filter(n => !n.hidden && !n.up)
    },
    routeMultiple() {
      return this.routes.filter(n => n.up === true)
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    goAdmin() {
      window.open('https://admin.zemengzhou.top')
    }
  }
}
</script>
<style lang="scss" scoped>
$titleColor: #8b8e99;
$titleHoverColor: #CCCDD2 !important;
$lineColor: #2e3344;
$leftfooterColor: #222;
// .menu-wrapper {
//   /deep/ .el-menu-item{
//     span{
//       padding-left: 14px;
//     }
//   }
// }
.logo-shadow{
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
}
.header-logo{
  width: 100%;
  height: 90px;
  border-bottom: 1px solid #2e3344;
  .header-content{
    color: #fff;
    font-size: 14px;
    margin-left: 15px;
    .title{
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 5px
    }
    .tip{
      font-size: 12px;
      color: $titleColor
    }
  }
}
.menu-warp{
  color: $titleColor;
  .side-name{
    background: transparent;
    font-size: 14px;
    padding-left: 15px;
    font-size: 12px;
    padding: 0 15px
  }
  /deep/ .el-menu-item, /deep/ .el-submenu__title{
    height: 40px;
    line-height: 40px;
    padding-left: 25px !important;
    display: flex;
    align-items: center;
    * {
      vertical-align: inherit
    }
    text-align: center;
    .icon{
      font-size: 16px;
    }
    span{
      margin-left: 12px;
    }
    &:hover{
      color: $titleHoverColor;
      .icon{
        color: $titleHoverColor;
      }
    }
  }
  .icon-left{
    /deep/ .el-submenu__title{
      .icon{
        margin-left: 19px
      }
    }
  }
}
.line-jg{
  height: 1px!important;
  background-color: $lineColor;
  margin: 10px 0;
}
.footer{
  position: absolute;
  width: 100%;
  font-size: 14px;
  bottom: 0;
  background: $leftfooterColor;
  color: $titleColor;
  height: 50px;
  .foot-list{
    font-size: 13px;
    cursor: pointer;
    &:hover{
      color: $titleHoverColor
    }
    .icon{
      font-size: 14px;
      margin-bottom: 2px;
    }
  }
}
.footer-coll{
  display: flex;
  flex-direction: column;
  height: 140px;
}
</style>
