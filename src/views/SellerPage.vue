<template>
  <div class="com-page">
    <seller></seller>
  </div>
</template>

<script>
import Seller from '@/components/Seller'

export default {
  name: 'SellerPage',
  data() {
    return {}
  },
  components: {
    seller: Seller
  }
}
</script>

<style lang="less" scoped></style>
