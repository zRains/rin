<template>
  <div class="fileReaderMethods">
    <section class="inputSec">
      <span>输入</span><input v-model="inputVal" type="text" maxlength="10" /><span>以构造Blob对象 🙌</span>
    </section>
    <section class="resultSec">
      <div class="readAsText">readAsText=> {{ textRef }}</div>
      <div class="readAsArrayBuffer">readAsArrayBuffer=> {{ arrayBufferRef }}</div>
      <div class="readAsDataURL">readAsDataURL=> {{ dataURLRef }}</div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const inputVal = ref('')
const textRef = ref('')
const arrayBufferRef = ref('[]')
const dataURLRef = ref('data:')
watch(inputVal, (n) => {
  const blob = new Blob([n])
  const textReader = new FileReader()
  const arrayBufferReader = new FileReader()
  const dataURLReader = new FileReader()
  textReader.readAsText(blob)
  textReader.onload = function () {
    textRef.value = this.result as string
  }
  arrayBufferReader.readAsArrayBuffer(blob)
  arrayBufferReader.onload = function () {
    arrayBufferRef.value = JSON.stringify(Array.from(new Uint8Array(this.result as ArrayBuffer)))
  }
  dataURLReader.readAsDataURL(blob)
  dataURLReader.onload = function () {
    dataURLRef.value = this.result as string
  }
})
</script>

<style lang="scss" scoped>
@import '../../styles/colors.scss';
@import '../../styles/var';

.fileReaderMethods {
  padding: gap(1);
  margin-bottom: gap();
  border: 2.5px dotted $grey6;
  background: $grey10;
  .inputSec input {
    margin: 0 gap();
    margin-bottom: gap();
    padding: 0 gap();
    width: 15ch;
    outline: none;
    border: 2.5px solid $grey6;
  }
  .resultSec {
    .readAsText,
    .readAsArrayBuffer {
      margin-bottom: gap();
    }
  }
}
</style>
