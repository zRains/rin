<template>
  <div class="blobViewImg">
    <img ref="imgRef" src="/images/avatar.png" alt="blobViewImg" />
    <label for="uploadImg">
      <span>{{ uploadBanner }}</span>
      <input id="uploadImg" ref="imgInput" type="file" />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const uploadBanner = ref('上传新的图片')
const imgRef = ref<HTMLImageElement>()
const imgInput = ref<HTMLInputElement>()

onMounted(() => {
  imgInput.value!.addEventListener('input', function () {
    const file = this.files![0]
    if (file && /^image\/(png|jpeg|svg|jpg)$/.test(file.type)) {
      const blobURL = window.URL.createObjectURL(file)
      imgRef.value!.src = blobURL
      imgRef.value!.onload = function () {
        uploadBanner.value = '上传新的图片'
        window.URL.revokeObjectURL(blobURL)
      }
    } else uploadBanner.value = '无效媒体文件！仅支持png/jpeg/svg/jpg格式文件，重新上传'
  })
})
</script>

<style lang="scss" scoped>
@import '../../styles/colors.scss';
@import '../../styles/var';

.blobViewImg {
  display: flex;
  align-items: center;
  height: 150px;
  padding: gap(1);
  border: 2.5px dotted $grey6;
  img {
    height: 100%;
    max-width: 60%;
  }
  label[for='uploadImg'] {
    display: block;
    margin-left: gap(2);
    span {
      font-weight: bold;
      cursor: pointer;
      &:hover {
        color: $primary;
        text-decoration: underline;
      }
    }
    input {
      display: none;
    }
  }
}
</style>
