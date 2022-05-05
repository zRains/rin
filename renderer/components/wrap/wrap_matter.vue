<template>
  <div class="wrapMatter">
    <template v-if="pages.length > 0">
      <div class="count">共 {{ pages.length }} 篇文章</div>
      <div class="ctime">更新于 {{ getRelativeTime(pages[0].ctime) }}</div>
    </template>
    <div v-else class="noPage">此系列还没有文章</div>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed, toRefs } from 'vue'
import { pageContextKey } from '../../../utils/constants'
import { getRelativeTime } from '../../../utils/helpers'

const props = defineProps({
  wrapper: {
    type: String,
    required: true
  }
})

const pageContext = inject(pageContextKey)!
const { wrapper } = toRefs(props)
const pages = computed(() =>
  [...pageContext.Pages.values()]
    .filter(({ matter }) => !matter.index && matter.buckets.includes(wrapper.value))
    .sort((a: any, b: any) => b.ctime - a.ctime)
)
</script>

<style lang="scss" scoped>
@import '../../styles/colors.scss';
@import '../../styles/var';

.wrapMatter {
  display: flex;
  font-size: 14px;
  font-weight: 600;
  color: $grey4;
  & > *:not(:last-child) {
    margin-right: gap(2);
  }
}
</style>
