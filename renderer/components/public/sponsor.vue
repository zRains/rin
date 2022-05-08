<template>
  <div class="sponsor">
    <div class="banner"><span style="color: #f1c40f">Gold</span> Sponsor</div>
    <div class="avatarBox">
      <a class="avatar" href="https://www.deelter.com/" target="_blank"></a>
    </div>
    <div class="desc">
      <div class="name">deelter</div>
      <div class="tk">从https://www.deelter.com页面下方实时动态爬取，更新间隔周期为1小时</div>
    </div>
    <div class="decorates"><span></span><span></span><span></span><span></span><span></span><span></span></div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
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

.sponsor {
  position: relative;
  width: 300px;
  margin: 0 auto;
  margin-top: 3em;
  text-align: center;
  font-weight: 600;
  .banner {
    font-size: 2em;
  }
  .avatarBox {
    user-select: none;
    height: 100px;
    text-align: center;
    margin-top: 2em;
    .avatar {
      cursor: pointer;
      display: block;
      position: relative;
      height: inherit;
      width: 100px;
      background-image: url('https://avatars.githubusercontent.com/u/56248994?v=4');
      background-size: contain;
      margin: 0 auto;
      &::before {
        position: absolute;
        content: '';
        left: -8px;
        right: -8px;
        top: -8px;
        bottom: -8px;
        background: linear-gradient(#8a63d2, #2188ff, #fb8532, #34d058);
        background-size: 200px;
        border-radius: 50%;
        z-index: -1;
        filter: blur(25px);
        animation: rotate 6s infinite linear;
      }
      &::after {
        position: absolute;
        content: 'GO ->';
        left: -1px;
        right: -1px;
        top: -1px;
        bottom: -1px;
        line-height: 100px;
        font-size: 18px;
        color: #f3f3f3;
        background-color: rgba($color: #000000, $alpha: 0.7);
        border-radius: 50%;
        z-index: 2;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
      }
      &:hover::after {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  .desc {
    margin-top: 2em;
    .name {
      font-size: 20px;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .tk {
      margin-top: 10px;
      font-size: 14px;
    }
  }
  .decorates {
    span {
      display: inline-block;
      position: absolute;
      animation: move 5s infinite linear;
      &:nth-child(1) {
        @include rect(25px, 4px, #8a63d2);
        left: -10px;
        top: -30px;
      }
      &:nth-child(2) {
        @include circle(20px, #2188ff);
        animation-delay: 2s;
        left: 20px;
        top: 120px;
      }
      &:nth-child(3) {
        @include circle(30px, #34d058);
        animation-delay: 0s;
        left: -50px;
        top: 220px;
      }
      &:nth-child(4) {
        @include rect(20px, 4px, #ffdf5d);
        animation-delay: 1s;
        left: -10px;
        bottom: -30px;
      }
      &:nth-child(5) {
        @include rect(25px, 4px, #8a63d2);
        animation-delay: 3s;
        right: -10px;
        bottom: 50px;
      }
      &:nth-child(6) {
        @include circle(30px, #fb8532);
        animation-delay: 1s;
        right: -10px;
        top: 50px;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes move {
  0% {
    transform: rotate(10deg) translateY(-10px);
  }
  50% {
    transform: rotate(10deg) translateY(0px);
  }
  100% {
    transform: rotate(10deg) translateY(-10px);
  }
}
</style>
