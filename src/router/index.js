import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/views/SellerPage'
import TrendPage from '@/views/TrendPage'
import MapPage from '@/views/MapPage'

Vue.use(VueRouter)

const routes = [
  { path: '/seller', component: SellerPage },
  { path: '/trend', component: TrendPage },
  { path: '/map', component: MapPage }
]

const router = new VueRouter({
  routes
})

export default router
