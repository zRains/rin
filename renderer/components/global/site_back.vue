<template>
  <div class="siteBack" @click="goBack">
    <div class="backArrow"></div>
    <div class="title">Back</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SiteBack',
  setup() {
    const goBack = () => {
      window.history.back()
    }
    return { goBack }
  }
})
</script>

<style lang="scss">
@import '../../styles/var';
@import '../../styles/colors.scss';

.siteBack {
  user-select: none;
  display: inline-flex;
  align-items: center;
  margin: gap() 0;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
  transition-property: border-bottom;
  transition-duration: 0.1s;
  cursor: pointer;
  .backArrow {
    height: 20px;
    width: 20px;
    margin-right: gap();
    background-image: url('/images/back.svg');
    background-size: cover;
  }
  .title {
    font-weight: 600;
  }
  &:hover {
    border-bottom: 2px solid $grey1;
  }
}
</style>
