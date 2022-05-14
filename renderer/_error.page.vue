<template>
  <div class="errorPage">
    <div v-if="is404" class="code-area">
      <span style="color: #7f848e; font-style: italic"> // {{ is404 ? '404 Page Not Found' : '500 Internal Server Error' }} </span>
      <span>
        <span style="color: #c678d2"> if </span>
        (<span style="color: #4ca8ef">!</span><span style="font-style: italic; color: #e05c5a">found</span>) {
      </span>
      <span>
        <span style="padding-left: 15px; color: #c678d2"> <i style="width: 10px; display: inline-block"></i>throw new </span>
        <span style="color: #ffc83d">Error</span>
        <span>(<span style="color: #67b779">"(╯°□°)╯︵ ┻━┻"</span>); </span>
        <span style="display: block">}</span>
        <br />
        <span style="color: #7f848e; font-style: italic"> // <a href="/">Go home!</a> </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  is404: {
    type: Boolean,
    required: false,
    default: true
  }
})
</script>

<style lang="scss">
@import './styles/colors.scss';

.errorPage {
  display: flex;
  justify-content: center;
  .code-area {
    line-height: 25px;
    width: 380px;
    min-width: 380px;
  }

  .code-area > span {
    display: block;
  }

  a {
    color: inherit;
    &:hover {
      color: $primary;
      text-decoration: underline;
    }
  }
}

@media screen and (max-width: 320px) {
  .code-area {
    font-size: 5vw;
    min-width: auto;
    width: 95%;
    margin: auto;
    padding: 5px;
    padding-left: 10px;
    line-height: 6.5vw;
  }
}
</style>
