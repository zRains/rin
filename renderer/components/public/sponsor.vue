<template>
  <div class="sponsors">
    <ul>
      <li v-for="sponsor in sponsors" :key="sponsor.name">
        <div class="avatarBox">
          <a
            class="avatar"
            :href="sponsor.link"
            target="_blank"
            :style="{ backgroundImage: `url('${sponsor.avatar}')` }"
            rel="noreferrer"
          ></a>
        </div>
        <div class="desc">
          <a class="name" :href="sponsor.link" target="_blank" rel="noreferrer">{{ sponsor.name }}</a>
          <div class="tk">{{ sponsor.desc }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { sponsors } from '../../../utils/constants'
</script>

<style lang="scss" scoped>
@import '../../styles/var';
@import '../../styles/colors.scss';

@mixin rect($s: 10px, $r: 3px, $c: #fff) {
  height: $s;
  width: $s;
  border-radius: $r;
  background-color: $c;
}

@mixin circle($s: 10px, $c: #fff) {
  height: $s;
  width: $s;
  border-radius: 50%;
  background-color: $c;
}

.sponsors {
  position: relative;
  width: 100%;
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      display: flex;
      align-items: center;
      .avatarBox {
        user-select: none;
        height: 40px;
        text-align: center;
        .avatar {
          cursor: pointer;
          display: block;
          position: relative;
          height: inherit;
          width: 40px;
          background-size: cover;
          margin-right: gap();
          &::after {
            position: absolute;
            content: 'GO->';
            left: -1px;
            right: -1px;
            top: -1px;
            bottom: -1px;
            line-height: 40px;
            color: #f3f3f3;
            background-color: rgba($color: #000000, $alpha: 0.7);
            z-index: 2;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
            font-size: 14px;
            font-weight: 600;
          }
          &:hover::after {
            opacity: 1;
            visibility: visible;
          }
        }
      }
      .desc {
        .name {
          display: inline-block;
          cursor: pointer;
          font-weight: 600;
          &:hover {
            text-decoration: underline;
          }
        }
        .tk {
          font-size: 14px;
        }
      }
      &:not(:last-child) {
        margin-bottom: gap();
      }
    }
  }
}
</style>
