<template>
  <component :is="NavLayout"><slot /></component>
</template>

<script lang="ts" setup>
// import FullLayout from './layouts/full_layout.vue'
import NavLayout from './layouts/nav_layout.vue'
</script>

<style lang="scss"></style>
