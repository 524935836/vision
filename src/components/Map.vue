<template>
  <div class="com-container" @dblclick="reverMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
import Debounce from '@/utils/debounce.js'
import { getProvinceMapInfo } from '@/utils/map_utils.js'
import { mapState } from 'vuex'

export default {
  name: 'Map',
  data() {
    return {
      chartInstance: null,
      allData: null,
      axiosInstance: null,
      mapdata: {}
    }
  },
  created() {
    this.axiosInstance = axios.create({
      baseURL: 'http://101.34.160.195:9997'
    })
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted() {
    // this.initCharts()

    // 防抖
    // window.onresize = new Debounce().create(this.screenAdapter, 200)
    window.addEventListener('resize', new Debounce().create(this.screenAdapter, 200))
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
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
    async initCharts() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      // 获取本地地图矢量数据
      // const res = await axios.get('http://localhost:8000/static/map/china.json')
      // 获取远程接口的地图矢量数据
      const res = await this.axiosInstance.get('/map/china.json')
      this.$echarts.registerMap('china', res.data)
      // 初始化配置
      const initOption = {
        geo: {
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      // 绑定单击事件
      this.chartInstance.on('click', async (event) => {
        // 获取省份路径和拼音
        const provinceInfo = getProvinceMapInfo(event.name)
        // 获取省份数据
        if (!this.mapdata[provinceInfo.key]) {
          const res = await this.axiosInstance.get(provinceInfo.path)
          if (res.data.status === '404') return
          this.mapdata[provinceInfo.key] = res.data
          this.$echarts.registerMap(provinceInfo.key, res.data)
        }
        // 更新为省份配置
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    // 获取数据
    getData(res) {
      this.initCharts()
      // const { data: res } = await this.$http.get('map')
      this.allData = res
      this.updateChart()
      this.screenAdapter()
    },
    // 更新图表
    updateChart() {
      // 图例数据
      const legendArr = this.allData.map((item) => item.name)
      // 每个系列的数据
      const seriesArr = this.allData.map((item) => {
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          }
        }
      })
      // 更新配置
      const dataOption = {
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
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6
      // 设置响应式配置
      const AdapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 3
          }
        }
      }
      this.chartInstance.setOption(AdapterOption)
      this.chartInstance.resize()
    },
    // 双击事件绑定,返回chinaMap
    reverMap() {
      const reverOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(reverOption)
    }
  }
}
</script>

<style lang="less" scoped></style>
