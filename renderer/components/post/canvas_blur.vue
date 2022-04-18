<template>
  <div class="canvasBlur">
    <canvas ref="CANVAS"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'CanvasBlur',
  props: {
    fixed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props) {
    const CANVAS = ref<HTMLCanvasElement>()
    onMounted(() => {
      const CTX = CANVAS.value!.getContext('2d')!
      const CH = 200
      const CW = CANVAS.value!.parentElement!.clientWidth
      CTX.lineWidth = 1
      if (props.fixed) {
        CANVAS.value!.style.height = `${CH}px`
        CANVAS.value!.style.width = `${CW}px`
        CANVAS.value!.height = CH * window.devicePixelRatio
        CANVAS.value!.width = CW * window.devicePixelRatio
        CTX.scale(window.devicePixelRatio, window.devicePixelRatio)
      } else {
        CANVAS.value!.height = CH
        CANVAS.value!.width = CW
      }
      CTX.arc(81, CH / 2, 80, 0, 2 * Math.PI)
      CTX.stroke()
      CTX.beginPath()
      CTX.arc(231, CH / 2, 60, 0, 2 * Math.PI)
      CTX.stroke()
      CTX.beginPath()
      CTX.arc(321, CH / 2, 20, 0, 2 * Math.PI)
      CTX.stroke()
      CTX.beginPath()
      CTX.rect(CW - 61, CH / 2, 60, 60)
      CTX.stroke()
      CTX.font = '30px sans-serif'
      CTX.fillText(`👀 YOUR DPR: ${window.devicePixelRatio}`, CW / 2, CH / 2)
    })
    return { CANVAS }
  }
})
</script>
