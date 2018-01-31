var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'
function padding (s, len) {
  len = len - (s + '').length
  for (var i = 0; i < len; i++) { s = '0' + s }
  return s
}
export default {
  getQueryStringByName: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    var context = ''
    if (r != null) {
      context = r[2]
    }
    reg = null
    r = null
    return context === null || context === '' || context === 'undefined' ? '' : context
  },
  formatDate: {
    format: function (date, pattern) {
      pattern = pattern || DEFAULT_PATTERN
      return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
          case 'y': return padding(date.getFullYear(), $0.length)
          case 'M': return padding(date.getMonth() + 1, $0.length)
          case 'd': return padding(date.getDate(), $0.length)
          case 'w': return date.getDay() + 1
          case 'h': return padding(date.getHours(), $0.length)
          case 'm': return padding(date.getMinutes(), $0.length)
          case 's': return padding(date.getSeconds(), $0.length)
        }
      })
    },
    parse: function (dateString, pattern) {
      var matchs1 = pattern.match(SIGN_REGEXP)
      var matchs2 = dateString.match(/(\d)+/g)
      if (matchs1.length === matchs2.length) {
        var _date = new Date(1970, 0, 1)
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i])
          var sign = matchs1[i]
          switch (sign.charAt(0)) {
            case 'y': _date.setFullYear(_int)
              break
            case 'M': _date.setMonth(_int - 1)
              break
            case 'd': _date.setDate(_int)
              break
            case 'h': _date.setHours(_int)
              break
            case 'm': _date.setMinutes(_int)
              break
            case 's': _date.setSeconds(_int)
              break
          }
        }
        return _date
      }
      return null
    }
  },
  formatNumber: function (num) { // 数字千位符格式化
    num = (num || 0).toString()
    let result = ''
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result
      num = num.slice(0, num.length - 3)
    }
    if (num) {
      result = num + result
    }
    return result
  },
  getMonthDates: function () {
    let nowdays = new Date()
    let year = nowdays.getFullYear()
    let month = nowdays.getMonth()
    let nextmonth = month + 1
    let firstDay = new Date(year, month, 1) // 第一天
    let lastDay = new Date(year, nextmonth, 0) // 最后一天
    return [firstDay, lastDay]
  },
  formatLongNumber: function (num) { // 格式话以分为单位的长整型数据
    if (num) {
      num = parseInt(num)
      let flag = num < 0 ? '-' : ''
      let zheng = Math.floor(Math.abs(num) / 100)
      let xiao = num.toString().substr(-2)
      // console.log('--' + this.formatNumber(zheng))
      return flag + this.formatNumber(zheng) + '.' + xiao
    }
    return 0
  },
  downloadExcel: function (res) {
    let blob = res.data
    let a = document.createElement('a')
    let url = window.URL.createObjectURL(blob)
    // 后台返回的名称
    let filename = decodeURI(res.headers['content-disposition'].split('=')[1].split('.')[0])
    // filename = filename + res.headers['content-disposition'].split('=')[1].split('.')[1]
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
