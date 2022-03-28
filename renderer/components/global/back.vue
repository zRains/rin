<template>
  <div class="siteBack">
    <div class="backArrow"></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { navigate } from 'vite-plugin-ssr/client/router'

export default defineComponent({
  name: 'SiteBack',
  setup() {
    return { navigate }
  }
})
</script>

<style lang="scss">
.siteBack {
  .backArrow {
    height: 50px;
    width: 50px;
    background-image: url('/images/back.svg');
  }
}
</style>
