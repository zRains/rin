<template>
  <div class="postList"></div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { pageContextKey } from '../../../utils/constants'

export default defineComponent({
  name: 'PostList',
  setup() {
    const pageContext = inject(pageContextKey)!
    console.log(pageContext)

    return {}
  },
})
</script>

<style lang="scss"></style>
