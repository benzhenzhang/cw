function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formateShortTime(date){
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-');
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getYestoday(date){
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day =''
  var weekDay = date.getDay()
  if (weekDay === 0){
    day = date.getDate() - 2
  }else if (weekDay === 1){
    day = date.getDate() - 3
  }else {
    day = date.getDate() - 1
  }
  return [year, month, day].map(formatNumber).join('-');
}



module.exports = {
  formatTime: formatTime,
  formateShortTime: formateShortTime,
  getYestoday: getYestoday
}
