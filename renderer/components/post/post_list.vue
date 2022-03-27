<template>
  <ul class="postList">
    <li v-for="page in pages" :key="page.path">
      <a class="post" :href="page.path">
        <div class="title">{{ page.matter.title || 'Untitle' }}</div>
        <div class="utils">
          <div class="ctime">{{ dayjs().from(page.ctime) }}</div>
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
import { navigate } from 'vite-plugin-ssr/client/router'
import relativeTime from 'dayjs/plugin/relativeTime'
import local from 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import { pageContextKey } from '../../../utils/constants'

dayjs.extend(relativeTime)
dayjs.locale(local)
export default defineComponent({
  name: 'PostList',
  setup() {
    const pageContext = inject(pageContextKey)!
    const pages = computed(() =>
      [...pageContext.pagesMatter.entries()]
        .map(([path, data]: [string, any]) => ({
          path,
          ...data
        }))
        .filter(({ path }) => !path.endsWith('index'))
    )

    return { pages, navigate, dayjs }
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
