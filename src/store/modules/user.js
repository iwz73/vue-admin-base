/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 09:31:42
 * @LastEditTime: 2020-03-11 11:53:51
 * @LastEditors: Please set LastEditors
 */
import { login, logout, getInfo, getRouter, getSystemInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { toTree } from '@/utils'


const state = {
  token: getToken(),
  userInfo: '',
  avatar: '',
  routers: [],
  finishtip: '',
  sysInfo: '',
  verifyFlag: false,
  loading: false,
  tags: [],
  tagId: [],
  cags: [],
  article: [],
  total: '',
  search: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, info) => {
    state.userInfo = info
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTERS: (state, routers) => {
    state.routers = routers
  },
  SET_FINISHTIP: (state, finishtip) => {
    state.finishtip = finishtip
  },
  SET_VERIFYFLAG: (state, verifyFlag) => {
    state.verifyFlag = verifyFlag
  },
  SET_LOADING: (state, loading) => {
    state.loading = loading
  },
  SET_SYSINFO: (state, data) => {
    state.sysInfo = data
  },
  SET_TAGS: (state, data) => {
    state.tags = data
  },
  SET_CAGD: (state, data) => {
    state.cags = data
  },
  SET_ARTICLEORDER: (state, data) => {
    state.article = data
  },
  SET_TOTAL: (state, data) => {
    state.total = data
  },
  SET_TAGID: (state, data) => {
    state.tagId = data
  },
  SET_SEARCH: (state, data) => {
    state.search = data
  }
}

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, passwordPut } = userInfo
  //   return new Promise((resolve, reject) => {
  //     // login({ username: username.trim(), password: passwordPut }).then(response => {
  //     //   // const { data } = response
  //     //   // console.log(response)
  //     //   commit('SET_TOKEN', 'testToken')
  //     //   setToken('testToken')
  //     //   resolve()
  //     // }).catch(error => {
  //     //   reject(error)
  //     // })
  //     commit('SET_TOKEN', 'testToken')
  //     setToken('testToken')
  //     resolve()
  //   })
  // },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { Data } = response
        if (!Data) {
          reject('获取用户信息失败')
        }
        commit('SET_USERINFO', Data)
        resolve(Data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  // logout({ commit }) {
  //   return new Promise((resolve, reject) => {
  //     // logout(state.token).then(() => {
  //     //   commit('SET_TOKEN', '')
  //     //   removeToken()
  //     //   resetRouter()
  //     //   resolve()
  //     // }).catch(error => {
  //     //   reject(error)
  //     // })
  //     commit('SET_TOKEN', '')
  //     commit('SET_USERINFO', '')
  //     removeToken()
  //     resetRouter()
  //     resolve()
  //   })
  //   // 清除cokie
  // },

  // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     commit('SET_TOKEN', '')
  //     commit('SET_USERINFO', '')
  //     removeToken()
  //     resolve()
  //   })
  // },

  // 获取路由
  getRouters({ commit }) {
    return new Promise((resolve, reject) => {
      // const router = [
      // {
      //   'Id': '1143423686708170752',
      //   'Name': '个人工作台',
      //   'ParentId': null,
      //   'Type': 4,
      //   'Url': 'Mine',
      //   'Icon': 'fa fa-tachometer',
      //   'SortCode': 1,
      //   'Children': [{
      //     'Id': '1143423896817635328',
      //     'Name': '待办事项',
      //     'ParentId': '1143423686708170752',
      //     'Type': 1,
      //     'Url': 'Todo',
      //     'Icon': null,
      //     'SortCode': 1,
      //     'Children': []
      //   }, {
      //     'Id': '1143424129597313024',
      //     'Name': '已办事项',
      //     'ParentId': '1143423686708170752',
      //     'Type': 1,
      //     'Url': 'Did',
      //     'Icon': null,
      //     'SortCode': 2,
      //     'Children': []
      //   }]
      // },
      //   {
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
      //   {
      //     'Id': '2',
      //     'Name': '仓库',
      //     'ParentId': null,
      //     'Url': 'project',
      //     'up': true,
      //     'Icon': 'icongithub',
      //     'Children': [
      //       {
      //         'Id': '2-1',
      //         'Name': '仓库',
      //         'ParentId': '2',
      //         'Url': 'project',
      //         'Icon': 'icongithub',
      //         'Children': []
      //       }
      //     ]
      //   },
      //   {
      //     'Id': '3',
      //     'Name': '朋友',
      //     'ParentId': null,
      //     'Url': 'friend',
      //     'up': true,
      //     'Icon': 'iconrelationship',
      //     'Children': [
      //       {
      //         'Id': '3-1',
      //         'Name': '朋友',
      //         'ParentId': '3',
      //         'Url': 'friend',
      //         'Icon': 'iconrelationship',
      //         'Children': []
      //       }
      //     ]
      //   },
      //   {
      //     'Id': '4',
      //     'Name': '相册',
      //     'ParentId': null,
      //     'Url': 'album',
      //     'up': true,
      //     'Icon': 'iconfaimlyalbum',
      //     'Children': [
      //       {
      //         'Id': '4-1',
      //         'Name': '相册',
      //         'ParentId': '4',
      //         'Url': 'album',
      //         'Icon': 'iconfaimlyalbum',
      //         'Children': []
      //       }
      //     ]
      //   },
      //   {
      //     'Id': '5',
      //     'Name': '日记',
      //     'ParentId': null,
      //     'Url': 'diary',
      //     'up': true,
      //     'Icon': 'iconlocking',
      //     'Children': [
      //       {
      //         'Id': '5-1',
      //         'Name': '日记',
      //         'ParentId': '5',
      //         'Url': 'diary',
      //         'Icon': 'iconlocking',
      //         'Children': []
      //       }
      //     ]
      //   },
      //   {
      //     'Id': '6',
      //     'Name': '归档',
      //     'ParentId': null,
      //     'Url': 'archives',
      //     'up': true,
      //     'Icon': 'icondonework',
      //     'Children': [
      //       {
      //         'Id': '6-1',
      //         'Name': '归档',
      //         'ParentId': '6',
      //         'Url': 'archives',
      //         'Icon': 'icondonework',
      //         'Children': []
      //       }
      //     ]
      //   },
      //   {
      //     'Id': '7',
      //     'Name': '留言',
      //     'ParentId': null,
      //     'Url': 'msg',
      //     'up': true,
      //     'Icon': 'iconaite-copy',
      //     'Children': [
      //       {
      //         'Id': '7-1',
      //         'Name': '留言',
      //         'ParentId': '7',
      //         'Url': 'msg',
      //         'Icon': 'iconaite-copy',
      //         'Children': []
      //       }
      //     ]
      //   },
      //   {
      //     'Id': '8',
      //     'Name': '分类',
      //     'ParentId': null,
      //     'Url': 'category',
      //     'up': false,
      //     'Icon': 'iconmenu',
      //     'Children': [
      //       {
      //         'Id': '8-1',
      //         'Name': 'js 学习',
      //         'ParentId': '8',
      //         'Url': 'jsLearn',
      //         'Children': []
      //       },
      //       {
      //         'Id': '8-2',
      //         'Name': '前端基础',
      //         'ParentId': '8',
      //         'Url': 'basic',
      //         'Children': []
      //       },
      //       {
      //         'Id': '8-3',
      //         'Name': 'vue',
      //         'ParentId': '8',
      //         'Url': 'vue',
      //         'Children': []
      //       },
      //       {
      //         'Id': '8-4',
      //         'Name': 'react',
      //         'ParentId': '8',
      //         'Url': 'react',
      //         'Children': []
      //       },
      //       {
      //         'Id': '8-5',
      //         'Name': 'uni-app',
      //         'ParentId': '8',
      //         'Url': 'uniapp',
      //         'Children': []
      //       }
      //     ]
      //   },
      //   {
      //     'Id': '9',
      //     'Name': '页面',
      //     'ParentId': null,
      //     'Url': 'page',
      //     'up': false,
      //     'Icon': 'iconinstruction',
      //     'Children': [
      //       {
      //         'Id': '9-1',
      //         'Name': 'js 学习',
      //         'ParentId': '9',
      //         'Url': 'jsLearn',
      //         'Children': []
      //       },
      //       {
      //         'Id': '9-2',
      //         'Name': '前端基础',
      //         'ParentId': '9',
      //         'Url': 'basic',
      //         'Children': []
      //       },
      //       {
      //         'Id': '9-3',
      //         'Name': 'vue',
      //         'ParentId': '9',
      //         'Url': 'vue',
      //         'Children': []
      //       },
      //       {
      //         'Id': '9-4',
      //         'Name': 'react',
      //         'ParentId': '9',
      //         'Url': 'react',
      //         'Children': []
      //       },
      //       {
      //         'Id': '9-5',
      //         'Name': 'uni-app',
      //         'ParentId': '9',
      //         'Url': 'uniapp',
      //         'Children': []
      //       }
      //     ]
      //   }
      // ]
      // commit('SET_ROUTERS', router)
      // resolve(router)
      getRouter().then((res) => {
        let dataList = res.Data[1]
        dataList.forEach(n => {
          n.name = n.cagName
          n.url = 'PageList'
        })
        dataList = toTree(dataList, 'id', 'pid')
        const dataDe = res.Data[0]
        dataDe.forEach(n => {
          n.name = n.title
          n.url = 'PageDtl'
        })
        const routerTop = []
        routerTop[0] = {
          id: '111190',
          name: '分类',
          pid: null,
          up: true,
          url: 'Page',
          icon: 'iconmenu',
          children: dataList
        }
        routerTop[1] = {
          id: '111110',
          name: '页面',
          pid: null,
          up: true,
          url: 'Post',
          icon: 'iconinstruction',
          children: dataDe
        }
        commit('SET_ROUTERS', routerTop)
        resolve(routerTop)
      }).catch(error => {
        reject(error)
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

