module.exports = function (fn, delay) {
  var timerDebounce = null
  return function () {
    timerDebounce && clearTimeout(timerDebounce)
    timerDebounce = setTimeout(() => {
      fn.call(this)
    }, delay)
  }
}
