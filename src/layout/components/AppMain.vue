<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { getTags, getArticleOrder, getCategoriesAll } from '@/api/index'

export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path + (this.$route.query.id || '')
    }
  },
  watch: {
    key() {
      this.getBaseData()
    }
  },
  created() {
    // this.getBaseData()
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

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  // padding-top: 50px;
  // height: 100vh;
  margin-top: 50px;
  overflow: auto;
  overflow-x: hidden !important;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
