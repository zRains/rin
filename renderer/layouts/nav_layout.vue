<template>
  <div class="navLayout">
    <Header />
    <div class="layoutContent"><slot /></div>
    <footer>
      <div class="license">
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode">CC-BY-NC-SA-4.0</a> © <a href="https://zrain.fun">zrain</a>
      </div>
      <div class="timeStamp"><Icon icon="ic:twotone-access-time" />{{ +new Date() }}</div>
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
    padding: gap();
    padding-top: gap(2);
    background-image: linear-gradient(
        0deg,
        transparent 24%,
        rgba(201, 195, 195, 0.329) 25%,
        hsla(0, 8%, 80.4%, 0.05) 26%,
        transparent 27%,
        transparent 74%,
        hsla(0, 5.2%, 81%, 0.185) 75%,
        rgba(180, 176, 176, 0.05) 76%,
        transparent 77%,
        transparent
      ),
      linear-gradient(
        90deg,
        transparent 24%,
        rgba(204, 196, 196, 0.226) 25%,
        hsla(0, 4%, 66.1%, 0.05) 26%,
        transparent 27%,
        transparent 74%,
        hsla(0, 5.2%, 81%, 0.185) 75%,
        rgba(180, 176, 176, 0.05) 76%,
        transparent 77%,
        transparent
      );
    background-size: 50px 50px;
  }
  footer {
    padding: gap(5) gap(1);
    .license,
    .timeStamp {
      display: flex;
      align-items: center;
      margin: 0 auto;
      max-width: $maxContentWidth;
      font-size: 0.9rem;
      color: $grey6;
      .iconify {
        margin-right: gap(0.5);
      }
    }
    a {
      color: inherit;
      &:hover {
        text-decoration: underline;
      }
    }
    & > *:not(:last-child) {
      margin-bottom: gap(0.5);
    }
  }
}
</style>
