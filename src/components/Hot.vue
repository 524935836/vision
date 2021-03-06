<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="preNext('pre')" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="preNext('next')" :style="comStyle">&#xe6ed;</span>
    <span class="titleStyle" :style="comStyle">{{ titleName }}</span>
  </div>
</template>

<script>
import Debounce from '@/utils/debounce.js'
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils.js'

export default {
  name: 'Hot',
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0
    }
  },
  created() {
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hotproduct',
      value: ''
    })
    this.$socket.registerCallBack('hotData', this.getData)
  },
  mounted() {
    // this.initCharts()
    // 防抖
    // window.onresize = new Debounce().create(this.screenAdapter, 200)
    window.addEventListener('resize', new Debounce().create(this.screenAdapter, 200))
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('hotData')
  },
  computed: {
    titleName() {
      if (!this.allData) {
        return ''
      }
      return this.allData[this.currentIndex].name
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
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
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      // 初始化配置
      const initOption = {
        title: {
          text: '▎热销商品的占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter(arg) {
            let total = 0
            let titleInfo = ''
            // 不包括最后元素总的百分比
            let totlePercentage = 0
            // 百分比数组
            const PercentageArr = []
            arg.data.children.forEach((item) => {
              total += item.value
            })
            arg.data.children.forEach((item, index) => {
              if (index === arg.data.children.length - 1) {
                // 100减去不包括最后元素总的百分比
                PercentageArr[arg.data.children.length - 1] =
                  Math.round((100 - totlePercentage) * 100) / 100
              } else {
                const percentage = Math.round((item.value / total) * 10000) / 100
                totlePercentage += percentage
                PercentageArr.push(percentage)
              }
            })
            arg.data.children.forEach((item, index) => {
              titleInfo += `${item.name}:${PercentageArr[index]}%<br/>`
            })
            return titleInfo
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    getData(res) {
      this.initCharts()
      // const { data: res } = await this.$http.get('hotproduct')
      this.allData = res
      this.updateChart()
      this.screenAdapter()
    },
    // 更新图表
    updateChart() {
      // 图例数据
      const legendArr = this.allData[this.currentIndex].children.map((item) => item.name)
      // 饼状图二级菜单数据
      const seriesArr = this.allData[this.currentIndex].children.map((item) => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      // 更新配置
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: [
          {
            data: seriesArr
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter() {
      if (!this.allData) return
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6
      // 设置响应式配置
      const AdapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5
          }
        ]
      }
      this.chartInstance.setOption(AdapterOption)
      this.chartInstance.resize()
    },
    // 切换一级饼状图
    preNext(type) {
      if (type === 'next') {
        this.currentIndex++
        if (this.currentIndex > this.allData.length - 1) {
          this.currentIndex = 0
        }
      } else {
        this.currentIndex--
        if (this.currentIndex < 0) {
          this.currentIndex = this.allData.length - 1
        }
      }
      this.updateChart()
    }
  }
}
</script>

<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: rgb(101, 68, 219);
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: rgb(101, 68, 219);
}
.titleStyle {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: rgb(101, 68, 219);
}
</style>
