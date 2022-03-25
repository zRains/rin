<template>
  <header class="siteHeader">
    <ul class="linkBox">
      <li class="headerLink" v-for="link in headerLinks" :key="link.path">
        <a :href="link.path">{{ link.label }}</a>
      </li>
    </ul>
  </header>
</template>

<script lang="ts" setup>
import { headerLinks } from '../../../utils/constants'
</script>

<style lang="scss">
@import '../../styles/var';
@import '../../styles/colors.scss';

.siteHeader {
  display: flex;
  height: $headerHeight;
  padding: 0 gap(2);
  .linkBox {
    margin-left: auto;
    display: flex;
    margin: 0 0 0 auto;
    padding: 0;
    .headerLink {
      line-height: $headerHeight;
      list-style: none;
      &:not(:last-child) {
        margin-right: gap(2);
      }
      a:active {
        color: $primary;
      }
      a:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
