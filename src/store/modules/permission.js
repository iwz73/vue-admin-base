/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-21 16:07:15
 * @LastEditTime : 2020-01-14 09:42:53
 * @LastEditors  : Please set LastEditors
 */
import { constantRoutes } from '@/router'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
const view404 = resv => require([`@/views/pages/404.vue`], resv)
// const view404 = () => import(`@/views/pages/404.vue`)
const actions = {
  generateRoutes({ commit }, routers) {
    return new Promise(resolve => {
      const addRoutes = []
      // 将数组写成路由标准路由格式
      routers.map(n => {
        const childrenComponents = []
        n.children = n.children || []
        n.children.map(nC => {
          const ccComponents = []
          if (nC.children) {
            nC.children.forEach(nCc => {
              let cComp
              try { cComp = require(`@/views/pages/${n.url}/${nC.url}/index.vue`) } catch (e) {
                console.log(e)
              }
              if (cComp && cComp.default) {
                ccComponents.push(
                  {
                    path: `${nCc.eName}`,
                    name: 'nc' + nC.id + nCc.eName,
                    component: (res) => require([`@/views/pages/${n.url}/${nC.url}/index.vue`], res),
                    // component: () => import(`@/views/pages/${n.url}/${nC.url}/index.vue`),
                    meta: { title: nCc.name },
                    children: [
                      {
                        path: 'detail',
                        name: 'nc' + nC.id + nCc.eName,
                        hidden: true,
                        component: (res) => require([`@/views/pages/Post/PageDtl/index.vue`], res),
                        meta: { title: '正文' }
                      }
                    ]
                  }
                )
              } else {
                ccComponents.push(
                  {
                    path: `${nCc.eName}`,
                    name: 'nc' + nC.id + nCc.eName,
                    component: view404,
                    meta: { title: nCc.name }
                  }
                )
              }
            })
          }
          let comp
          try { comp = require(`@/views/pages/${n.url}/${nC.url}/index.vue`) } catch (e) {
            console.log(e)
          }

          if (comp && comp.default) {
            ccComponents.push(
              {
                path: 'detail',
                name: 'nc' + nC.id + nC.eName,
                hidden: true,
                component: (res) => require([`@/views/pages/Post/PageDtl/index.vue`], res),
                meta: { title: '正文' }
              }
            )
            childrenComponents.push(
              {
                path: `${nC.url}/${nC.eName}`,
                name: 'nc' + nC.id,
                alwaysShow: false,
                component: (res) => require([`@/views/pages/${n.url}/${nC.url}/index.vue`], res),
                // component: () => import(`@/views/pages/${n.url}/${nC.url}/index.vue`),
                meta: { title: nC.name },
                children: ccComponents
              }
            )
          } else {
            childrenComponents.push(
              {
                path: `${nC.url}/${nC.eName}`,
                alwaysShow: false,
                name: 'nc' + nC.id,
                component: view404,
                meta: { title: nC.name },
                children: ccComponents
              }
            )
          }
        })
        addRoutes.push(
          {
            path: `/${n.url}`,
            alwaysShow: false,
            component: Layout,
            redirect: `/${n.url}/${n.children[0].url}/${n.children[0].eName}`,
            name: 'c' + n.id,
            meta: { title: n.name, aicon: n.icon },
            up: n.up,
            children: childrenComponents
          }
        )
      })
      commit('SET_ROUTES', addRoutes)
      resolve({
        addRoutes: state.addRoutes,
        allRoutes: state.routes
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
