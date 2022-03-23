<template>
  <div class="navLayout">
    <Header />
    <div class="layoutContent"><slot /></div>
  </div>
</template>

<script lang="ts" setup>
import Header from '../components/public/header.vue'
</script>

<style lang="scss">
@import '../styles/var';
.navLayout {
  .layoutContent {
    box-sizing: border-box;
    max-width: $maxContentWidth;
    margin: 0 auto;
    padding: 0 gap();
  }
}
</style>
