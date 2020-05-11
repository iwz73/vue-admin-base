/*
 * @Author: your name
 * @Date: 2020-03-13 09:48:38
 * @LastEditTime: 2020-03-13 10:21:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \frontend\src\utils\highlight-line-number.js
 */
export function highlightLineNumber() {
  function format(format, args) {
    return format.replace(/\{(\d+)\}/g, function(m, n) {
      return args[n] ? args[n] : m
    })
  }
  // 创建行号样式
  function createLineNumbersStyle() {
    var lineNumbersStyle = [
      '.{0} ul {',
      'list-style: decimal;',
      'margin: 0px 0px 0 40px !important;',
      'padding: 0px;}',
      '.{0} ul li {',
      'list-style: decimal;',
      'border-left: 1px solid #ddd !important;',
      'padding: 5px!important;',
      'margin: 0 !important;',
      'line-height: 14px;',
      'word-break: break-all;',
      'word-wrap: break-word;}'
    ]
    var styleEl = document.createElement('style')
    styleEl.type = 'text/css'
    styleEl.innerHTML = format(lineNumbersStyle.join(''), ['hljs'])
    // styleEl.innerHTML = lineNumbersStyle.join('').format('hljs')
    document.getElementsByTagName('head')[0].appendChild(styleEl)
  }
  // 初始化代码行号
  function initLineNumbersOnLoad() {
    createLineNumbersStyle()
    var codeList = document.querySelectorAll('pre code')
    console.log(codeList)
    for (var i = 0; i < codeList.length; i++) {
      console.log(i)
      var codeHtml = codeList[i].innerHTML
      codeHtml = '<ul><li>' + codeHtml.replace(/\n/g, '\n</li><li>') + '\n</li></ul>'
      codeList[i].innerHTML = codeHtml
    }
  }
  if (window.hljs) {
    initLineNumbersOnLoad()
  } else {
    console.error('highlight.js not find!')
  }
}
