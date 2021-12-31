module.exports = {
  devServer: {
    port: 8000,
    open: true
  },
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       components: '@/components',
  //       content: '@/components/content',
  //       common: '@/components/common',
  //       assets: '@/assets',
  //       network: '@/network',
  //       views: '@/views',
  //       utils: '@/utils',
  //     },
  //   },
  // },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}