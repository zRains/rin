<template>
  <ul class="postList">
    <li v-for="page in pages" :key="page.path">
      <a class="post" :href="page.path">
        <div class="title">{{ page.matter.title || 'Untitle' }}</div>
        <div class="utils">
          <div v-if="page.matter.draft" class="isDraft">草稿</div>
          <div class="ctime">{{ getRelativeTime(page.ctime) }}</div>
          <div class="scope">
            {{ page.matter.scope && page.matter.scope.join(' / ') }}
          </div>
        </div>
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { inject, computed, toRefs } from 'vue'
import { pageContextKey } from '../../../utils/constants'
import { getRelativeTime } from '../../../utils/helpers'

const props = defineProps({
  pool: {
    type: String,
    required: false,
    default: undefined
  }
})

const { pool } = toRefs(props)

const pageContext = inject(pageContextKey)!
const pages = computed(() =>
  [...pageContext.Pages.values()]
    .filter(({ matter }) => !matter.index && (pool?.value ? matter.buckets.includes(pool.value) : true))
    .sort((a, b) => b.ctime - a.ctime)
)
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
      line-height: 20px;
      & > *:not(:last-child) {
        margin-right: gap(1.5);
      }
      .isDraft {
        display: inline-block;
        background: $grey8;
        padding: 0 gap();
        font-size: inherit;
        color: $grey3;
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
