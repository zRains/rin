<template>
  <ul class="postList">
    <li v-for="page in pages" :key="page.path">
      <a class="post" :href="page.path">
        <div class="title">{{ page.matter.title || 'Untitle' }}</div>
        <div class="utils">
          <div class="ctime">{{ getRelativeTime(page.ctime) }}</div>
          <div class="scope">
            {{ page.matter.scope && page.matter.scope.join(' / ') }}
          </div>
        </div>
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue'
import { pageContextKey } from '../../../utils/constants'
import { getRelativeTime } from '../../../utils/helpers'

export default defineComponent({
  name: 'PostList',
  props: {
    wrap: {
      type: String,
      required: false,
      default: undefined
    },
    showWrap: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props) {
    const pageContext = inject(pageContextKey)!
    const pages = computed(() =>
      [...pageContext.Pages.values()]
        .filter(({ matter }) =>
          props.wrap ? matter.wrap?.includes(props.wrap) : props.showWrap ? !matter.index : !matter.index && !matter.wrap
        )
        .sort((a, b) => b.ctime - a.ctime)
    )
    return { pages, getRelativeTime }
  }
})
</script>

<style lang="scss" scoped>
@import '../../styles/colors.scss';
@import '../../styles/var';

.postList {
  margin: 0;
  padding: 0;
  li {
    list-style: none;
    &:not(:last-child) {
      margin-bottom: gap(2);
    }
  }
  .post {
    display: block;
    text-decoration: none;
    color: inherit;
    .title {
      display: inline-block;
      transition-property: color;
      transition-duration: 0.2s;
      font-weight: 600;
      font-size: 1.1rem;
    }
    .utils {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: $grey5;
      & > *:not(:last-child) {
        margin-right: gap(1.5);
      }
    }
    &:hover {
      .title {
        color: $primary;
      }
    }
  }
}
</style>
