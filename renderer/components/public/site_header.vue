<template>
  <header class="siteHeader">
    <div class="headerContent">
      <a href="/" class="avatar"></a>
      <ul class="linkBox">
        <li
          v-for="link in headerLinks.filter((h) => !h.disable)"
          :key="link.path"
          :class="{
            headerLink: true,
            active: pageContext.url === '/' ? pageContext.url === link.path : link.path.startsWith(pageContext.url)
          }"
        >
          <a :href="link.path">{{ link.label }}</a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { pageContextKey, headerLinks } from '../../../utils/constants'

const pageContext = inject(pageContextKey)!
</script>

<style lang="scss">
@import '../../styles/var';
@import '../../styles/colors.scss';

.siteHeader {
  height: $headerHeight;
  padding: 0 gap(2);
  .headerContent {
    max-width: $maxContentWidth * 1.2;
    margin: 0 auto;
    display: flex;
    .avatar {
      height: $headerHeight * 0.7;
      width: $headerHeight * 0.7;
      background-image: url('/images/avatar.png');
      background-size: cover;
      margin: auto 0;
    }
    .linkBox {
      user-select: none;
      margin-left: auto;
      display: flex;
      margin: 0 0 0 auto;
      padding: 0;
      .headerLink {
        line-height: $headerHeight;
        list-style: none;
        font-size: 1.05em;
        font-weight: 600;
        &.active a {
          color: $primary;
          text-decoration: underline;
        }
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
}
</style>
