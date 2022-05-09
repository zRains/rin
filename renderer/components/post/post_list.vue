<template>
  <ul class="postList">
    <li v-for="page in pages" :key="page.path">
      <a class="post" :href="page.path">
        <div class="title">{{ page.matter.title || '无标题' }}</div>
        <div class="utils">
          <div class="ctime">{{ getRelativeTime(page.btime) }}</div>
          <div class="scope">
            {{ page.matter.scope && page.matter.scope.join(' / ') }}
          </div>
          <div class="tags">
            <div v-if="new Date() - page.mtime <= 8e7" class="tag isCurrentUpdate"><Icon icon="dashicons:update-alt" />更改</div>
            <div v-if="page.matter.draft" class="tag isDraft"><Icon icon="charm:git-request-draft" />草稿</div>
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
  (pageContext.Pages as any[])
    .filter(({ matter }) => !matter.index && (pool?.value ? matter.buckets.includes(pool.value) : true))
    .sort((a, b) => b.btime - a.btime)
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
      transition-duration: 0.1s;
      font-weight: 600;
      font-size: 1.1rem;
      line-height: 30px;
    }
    .utils {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: $grey5;
      line-height: 20px;
      .tags {
        user-select: none;
        .tag {
          display: inline-flex;
          align-items: center;
          height: 20px;
          padding: 0 gap(0.6);
          font-size: inherit;
        }
        .isCurrentUpdate {
          background: $primary1;
          color: $grey10;
        }
        .isDraft {
          background: $grey8;
          color: $grey3;
        }
      }
      :is(&, .tags) > *:not(:last-child) {
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
