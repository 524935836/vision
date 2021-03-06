<template>
  <div class="com-container">
    <div class="title" :style="titleStyle">
      <span>{{ '▎' + showTitle }}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice" :style="titleStyle"
        >&#xe6eb;</span
      >
      <div
        class="select-container"
        v-for="item in selectTypes"
        :key="item.key"
        v-show="showChoice"
        :style="selectStyle"
      >
        <div class="select-item" @click="handleSelect(item.key)">{{ item.text }}</div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import Debounce from '@/utils/debounce.js'
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils.js'

export default {
  name: 'Trend',
  data() {
    return {
      chartInstance: null,
      allData: null,
      // 下拉框开关
      showChoice: false,
      // 选择类型
      choiceType: 'map',
      titleFontSize: 0
    }
  },
  created() {
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted() {
    // this.initCharts()

    // 防抖
    // window.onresize = new Debounce().create(this.screenAdapter, 200)
    window.addEventListener('resize', new Debounce().create(this.screenAdapter, 200))
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('trendData')
  },
  computed: {
    // 下拉框数组
    selectTypes() {
      if (!this.allData) {
        return []
      }
      return this.allData.type.filter((item) => item.key !== this.choiceType)
    },
    // 标题
    showTitle() {
      if (!this.allData) {
        return ''
      }
      return this.allData[this.choiceType].title
    },
    // 标题大小适配
    titleStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    // 下拉框适配
    selectStyle() {
      return {
        marginLeft: this.titleFontSize / 1.6 + 'px',
        backgroundColor: getThemeValue(this.theme).selectColor
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
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme)
      // 初始化配置
      const initOption = {
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    getData(res) {
      this.initCharts()
      // const { data: res } = await this.$http.get('trend')
      this.allData = res
      this.updateChart()
      this.screenAdapter()
    },
    // 更新图表
    updateChart() {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 类目轴数据
      const timeArr = this.allData.common.month
      // 每个系列数据
      const valueArr = this.allData[this.choiceType].data
      // 图例数据
      const legendArr = valueArr.map((item) => item.name)
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: colorArr1[index] },
                { offset: 1, color: colorArr2[index] }
              ]
            }
          }
        }
      })
      // 更新配置
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter() {
      if (!this.allData) return
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6
      // 设置响应式配置
      const AdapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(AdapterOption)
      this.chartInstance.resize()
    },
    // 点击选择框的回调
    handleSelect(type) {
      this.choiceType = type
      this.updateChart()
      this.showChoice = false
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: #fff;

  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }

  .select-item {
    cursor: pointer;
  }

  .select-container {
    background-color: #222733;
  }
}
</style>
