// export default function (fn, delay) {
//   let timerDebounce = null
//   return function () {
//     timerDebounce && clearTimeout(timerDebounce)
//     timerDebounce = setTimeout(() => {
//       fn.call(this)
//     }, delay)
//   }
// }
export default class Debounce {
  timerDebounce = null
  create(fn, delay) {
    return () => {
      this.timerDebounce && clearTimeout(this.timerDebounce)
      this.timerDebounce = setTimeout(() => {
        fn.call(this)
      }, delay)
    }
  }
}
