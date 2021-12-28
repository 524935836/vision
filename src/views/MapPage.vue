<template>
  <div class="com-page">
    <singleMap></singleMap>
  </div>
</template>

<script>
import Map from '@/components/Map'

export default {
  name: 'MapPage',
  data() {
    return {}
  },
  components: {
    singleMap: Map
  }
}
</script>

<style lang="less" scoped></style>
