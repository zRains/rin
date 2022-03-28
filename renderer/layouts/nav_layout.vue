<template>
  <div class="navLayout">
    <Header />
    <div class="layoutContent"><slot /></div>
    <footer>
      <div class="license">
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode">CC-BY-NC-SA-4.0</a> © <a href="https://zrain.fun">zrain</a>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import Header from '../components/public/header.vue'
</script>

<style lang="scss">
@import '../styles/colors.scss';
@import '../styles/var';

.navLayout {
  .layoutContent {
    box-sizing: border-box;
    max-width: $maxContentWidth;
    margin: 0 auto;
    padding: 0 gap();
    padding-top: gap(2);
  }
  footer {
    padding: gap(5) gap(1);
    .license {
      margin: 0 auto;
      max-width: $maxContentWidth;
      font-size: 0.9rem;
      color: $grey6;
      a {
        color: inherit;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
