<template>
  <div style="display: flex; justify-content: center">
    <img :style="{ zoom }" :src="src" :alt="alt" />
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
