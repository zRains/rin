<template>
  <div class=""></div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { pageContextKey } from '../../../utils/constants'

export default defineComponent({
  name: 'WrapList',
  setup() {
    const pageContext = inject(pageContextKey)!
    // console.log(pageContext)
    return { pageContext }
  }
})
</script>

<style lang="scss"></style>
