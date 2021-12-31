import Vue from 'vue'
import VueRouter from 'vue-router'
// import SellerPage from '@/views/SellerPage'
// import TrendPage from '@/views/TrendPage'
// import MapPage from '@/views/MapPage'
// import RankPage from '@/views/RankPage'
// import HotPage from '@/views/HotPage'
// import StockPage from '@/views/StockPage'
import ScreenPage from '@/views/ScreenPage'

Vue.use(VueRouter)

const routes = [
  // { path: '/seller', component: SellerPage },
  // { path: '/trend', component: TrendPage },
  // { path: '/map', component: MapPage },
  // { path: '/rank', component: RankPage },
  // { path: '/hot', component: HotPage },
  // { path: '/stock', component: StockPage }
  { path: '/', redirect: '/screen' },
  { path: '/screen', component: ScreenPage }
]

const router = new VueRouter({
  routes
})

export default router
