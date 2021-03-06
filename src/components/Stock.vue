<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import Debounce from '@/utils/debounce.js'
import { mapState } from 'vuex'

export default {
  name: 'Stock',
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      tiemrId: null
    }
  },
  created() {
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
      value: ''
    })
    this.$socket.registerCallBack('stockData', this.getData)
  },
  mounted() {
    // this.initCharts()

    // 防抖
    // window.onresize = new Debounce().create(this.screenAdapter, 200)
    window.addEventListener('resize', new Debounce().create(this.screenAdapter, 200))
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.tiemrId)
    this.$socket.unRegisterCallBack('stockData')
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
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      // 初始化配置
      const initOption = {
        title: {
          text: '▎库存和销量分析',
          left: 20,
          top: 20
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.tiemrId)
      })
      this.chartInstance.on('mouseout', () => [this.startInterval()])
    },
    // 获取数据
    getData(res) {
      this.initCharts()
      // const { data: res } = await this.$http.get('stock')
      this.allData = res
      this.updateChart()
      this.screenAdapter()
      this.startInterval()
    },
    // 更新图表
    updateChart() {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          // radius: [110, 100],
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false
          },
          label: {
            show: true,
            position: 'center',
            color: colorArr[index][0]
          },
          data: [
            {
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: colorArr[index][0] },
                    { offset: 1, color: colorArr[index][1] }
                  ]
                }
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      // 更新配置
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
      // this.screenAdapter()
    },
    // 屏幕适配
    screenAdapter() {
      if (!this.allData) return
      const titleFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6
      const innerRadius = titleFontSize * 2.8
      const outerRadius = innerRadius * 1.125
      // 设置响应式配置
      const AdapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }
        ]
      }
      this.chartInstance.setOption(AdapterOption)
      this.chartInstance.resize()
    },
    // 每三秒切换下一页
    startInterval() {
      this.tiemrId && clearInterval(this.tiemrId)
      this.tiemrId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > 2) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    }
  }
}
</script>

<style lang="less" scoped></style>
