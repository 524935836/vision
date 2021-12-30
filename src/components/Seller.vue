<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import debounce from '@/utils/debounce.js'

export default {
  name: 'Seller',
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      timerId: null
    }
  },
  created() {
    this.$socket.registerCallBack('sellerkData', this.getData)
  },
  mounted() {
    this.initCharts()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerkData',
      chartName: 'seller',
      value: ''
    })
    // 防抖
    window.onresize = debounce(this.screenAdapter, 200)
  },
  beforeDestroy() {
    clearInterval(this.timerId)
    window.onresize = null
    this.$socket.unRegisterCallBack('sellerkData')
  },
  methods: {
    // 创建echarts实例对象
    initCharts() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
      // 初始化配置
      const initOption = {
        title: {
          text: '▎商家销售统计',
          textStyle: {
            fontSize: 66
          },
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 66,
              color: '#2D3443'
            }
          }
        },
        series: {
          type: 'bar',
          barWidth: 66,
          label: {
            show: true,
            position: 'right',
            color: '#fff'
          },
          itemStyle: {
            barBorderRadius: [0, 33, 33, 0],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ]
            }
          }
        }
      }
      this.chartInstance.setOption(initOption)
      // 绑定鼠标移入移出事件
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取数据
    getData(res) {
      // const { data: res } = await this.$http.get('seller')
      this.allData = res
      // 从小到大排序
      this.allData.sort((a, b) => a.value - b.value)
      // 计算总页数
      this.totalPage = Math.ceil(this.allData.length / 5)
      this.updateChart()
      this.startInterval()
    },
    // 更新图表
    updateChart() {
      // 截取前五个数据
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map((item) => item.name)
      const sellerValues = showData.map((item) => item.value)
      // 更新配置
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: {
          data: sellerValues
        }
      }
      this.chartInstance.setOption(dataOption)
      this.screenAdapter()
    },
    // 每三秒切换下一页
    startInterval() {
      this.timerId && clearInterval(this.timerId)
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6
      // 设置响应式配置
      const AdapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: {
          barWidth: titleFontSize,
          itemStyle: {
            barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
          }
        }
      }
      this.chartInstance.setOption(AdapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped></style>
