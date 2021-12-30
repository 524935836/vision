export default function (fn, delay) {
  let timerDebounce = null
  return function () {
    timerDebounce && clearTimeout(timerDebounce)
    timerDebounce = setTimeout(() => {
      fn.call(this)
    }, delay)
  }
}
