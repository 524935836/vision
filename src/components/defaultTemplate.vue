<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import debounce from '@/utils/debounce.js'

export default {
  name: 'Trend',
  data() {
    return {
      chartInstance: null,
      allData: null
    }
  },
  mounted() {
    this.initCharts()
    this.getData()
    // 防抖
    window.onresize = debounce(this.screenAdapter, 200)
    this.screenAdapter()
  },
  beforeDestroy() {
    window.onresize = null
  },
  methods: {
    // 创建echarts实例对象
    initCharts() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      // 初始化配置
      const initOption = {}
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    async getData() {
      const { data: res } = await this.$http.get('')
      this.allData = res
      this.updateChart()
    },
    // 更新图表
    updateChart() {
      // 更新配置
      const dataOption = {}
      this.chartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter() {
      // 设置响应式配置
      const AdapterOption = {}
      this.chartInstance.setOption(AdapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped></style>
