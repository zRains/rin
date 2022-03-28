<template>
  <div class="wrapMatter">
    <template v-if="pages.length > 0">
      <div class="count">共 {{ pages.length }} 篇文章</div>
      <div class="ctime">更新于 {{ getRelativeTime(pages[0].ctime) }}</div>
    </template>
    <div v-else class="noPage">此系列还没有文章</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue'
import { pageContextKey } from '../../../utils/constants'
import { getRelativeTime } from '../../../utils/helpers'

export default defineComponent({
  name: 'WrapMatter',
  props: {
    wrap: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const pageContext = inject(pageContextKey)!
    const pages = computed(() =>
      [...pageContext.Pages.values()]
        .filter((page: any) => page.matter.wrap && page.matter.wrap.includes(props.wrap))
        .sort((a: any, b: any) => b.ctime - a.ctime)
    )

    return { pages, getRelativeTime }
  }
})
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
