<template>
  <div style="display: flex; justify-content: center">
    <img :style="{ zoom, 'image-rendering': '-webkit-optimize-contrast' }" :src="src" :alt="alt" />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: false,
    default: 'image post on zrain.fun'
  },
  zoom: {
    type: String,
    required: false,
    default: '100%'
  }
})
</script>
