/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 09:31:42
 * @LastEditTime: 2020-03-11 11:51:12
 * @LastEditors: Please set LastEditors
 */
import request from '@/utils/request'
// import qs from 'qs'
export function getArticleList(params) {
  return request({
    url: '/blog/getArticleList',
    method: 'get',
    params
  })
}

export function getArticleById(params) {
  return request({
    url: '/blog/article',
    method: 'get',
    params
  })
}

export function getTags(params) {
  return request({
    url: '/blog/getTags',
    method: 'get',
    params
  })
}

export function getArticleOrder(params) {
  return request({
    url: '/blog/getArticleOrder',
    method: 'get',
    params
  })
}

export function getCategoriesAll() {
  return request({
    url: '/blog/getCategoriesAll',
    method: 'get'
  })
}
