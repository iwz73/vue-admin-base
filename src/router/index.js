import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin" */'@/views/pages/Welcome/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/welcome',
    Icon: 'iconhome',
    meta: { title: '首页', aicon: 'iconhome' },
    // hidden: true,
    // alwaysShow: true,
    children: [
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import('@/views/pages/Page/PageList/index'),
        meta: { title: '首页', aicon: 'iconhome', breadcrumb: false }
        // children: [
        //   {
        //     path: 'tag',
        //     name: 'tag',
        //     hidden: true,
        //     component: () => import('@/views/pages/Page/PageList/index'),
        //     meta: { title: '标签', aicon: 'iconhome' }
        //   },
        //   {
        //     path: '/welcome/detail',
        //     name: 'welcomeDetail',
        //     hidden: true,
        //     component: (res) => require([`@/views/pages/Post/PageDtl/index.vue`], res),
        //     meta: { title: '正文' }
        //   }
        // ]
      },
      {
        path: '/welcome/tag',
        name: 'tag',
        hidden: true,
        component: () => import('@/views/pages/Page/PageList/index'),
        meta: { title: '标签', aicon: 'iconhome' },
        children: [
          {
            path: 'detail',
            name: 'tagDetail',
            hidden: true,
            component: () => import('@/views/pages/Post/PageDtl/index'),
            meta: { title: '正文', aicon: 'iconhome' }
          }
        ]
      },
      {
        path: '/welcome/search',
        name: 'search',
        hidden: true,
        component: () => import('@/views/pages/Page/PageList/index'),
        meta: { title: '搜索', aicon: 'iconhome' }
      },
      {
        path: '/welcome/detail',
        name: 'welcomeDetail',
        hidden: true,
        component: () => import(`@/views/pages/Post/PageDtl/index`),
        meta: { title: '正文' }
      }
    ]
  },
  // 归档 和 动态
  {
    path: '/archives',
    component: Layout,
    redirect: '/archives',
    children: [
      {
        path: '/archives',
        name: 'archivesList',
        component: () => import(`@/views/pages/Archive/index`),
        meta: { title: '归档', aicon: 'icondonework' }
      }
    ]
  },
  {
    path: '/thumb',
    component: Layout,
    redirect: '/thumb',
    children: [
      {
        path: '/thumb',
        name: 'thumbsList',
        component: () => import(`@/views/pages/Thumb/index.vue`),
        meta: { title: '动态', aicon: 'iconlocking' }
      }
    ]
  }
  // {
  //     'Id': '1',
  //     'Name': '首页',
  //     'ParentId': null,
  //     'Url': 'Info',
  //     'up': true,
  //     'Icon': 'iconhome',
  //     'Children': [
  //       {
  //         'Id': '1-1',
  //         'Name': '首页',
  //         'ParentId': '1',
  //         'Url': 'Com',
  //         'Icon': 'iconhome',
  //         'Children': []
  //       }
  //     ]
  //   },
  // { path: '*', redirect: '/404' }

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!

]
// 拿到获取到的路由
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
