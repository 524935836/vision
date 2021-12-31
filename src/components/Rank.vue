<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
import Debounce from '@/utils/debounce.js'
import { mapState } from 'vuex'

export default {
  name: 'Rank',
  data() {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0,
      endValue: 9,
      timerId: null
    }
  },
  created() {
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
    this.$socket.registerCallBack('rankData', this.getData)
  },
  mounted() {
    // this.initCharts()

    // 防抖
    // window.onresize = new Debounce().create(this.screenAdapter, 200)
    window.addEventListener('resize', new Debounce().create(this.screenAdapter, 200))
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
    this.$socket.unRegisterCallBack('rankData')
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme() {
      this.chartInstance.dispose()
      this.initCharts()
      this.updateChart()
      this.screenAdapter()
    }
  },
  methods: {
    // 创建echarts实例对象
    initCharts() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
      // 初始化配置
      const initOption = {
        title: {
          text: '▎地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 监听鼠标移入移除事件
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取数据
    getData(res) {
      this.initCharts()
      // const { data: res } = await this.$http.get('rank')
      this.allData = res
      this.allData.sort((a, b) => b.value - a.value)
      this.updateChart()
      this.screenAdapter()
      this.startInterval()
    },
    // 更新图表
    updateChart() {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      // 类目轴数据
      const provinceArr = this.allData.map((item) => item.name)
      const valueArr = this.allData.map((item) => item.value)
      // 更新配置
      const dataOption = {
        xAxis: {
          data: provinceArr
        },
        dataZoom: {
          type: 'slider',
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color(data) {
                let targetColorArr = null
                if (data.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (data.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: targetColorArr[0] },
                    { offset: 1, color: targetColorArr[1] }
                  ]
                }
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter() {
      if (!this.allData) return
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6
      // 设置响应式配置
      const AdapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(AdapterOption)
      this.chartInstance.resize()
    },
    // 每两秒向左平移一个
    startInterval() {
      this.timerId && clearInterval(this.timerId)
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue === this.allData.length) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 2000)
    }
  }
}
</script>

<style lang="less" scoped></style>
