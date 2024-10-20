<template>
  <div v-show="isShown" class="relative">
    <p class="relative loading-text" :class="{ 'loader-animation': isShown }">{{ loadingText }}</p>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const isShown = defineModel('isShown', { required: true });

const loadingText = '\u00B7\u00B7\u00B7';

watch(
  () => isShown.value,
  value => {
    if (value) {
      setTimeout(() => {
        isShown.value = false;
      }, 2500);
    }
  }
);
</script>

<style scoped>
@keyframes dot-animation {
  from {
    width: 0px;
  }
  to {
    width: 100%;
  }
}
.loader-animation {
  animation: dot-animation 2s steps(3, end) forwards;
}
.loading-text {
  overflow: hidden;
  color: rgba(255, 255, 255, 0.496);
  -webkit-text-stroke-color: white;
}

@media (orientation: portrait) {
  @media screen and (max-width: 668px) {
    .loading-text {
      -webkit-text-stroke-width: getMobileSize(1);
      font-size: getMobileSize(80);
      letter-spacing: getMobileSize(5);
    }
  }

  @media screen and (min-width: 669px) {
    .loading-text {
      -webkit-text-stroke-width: getTabletSize(1);
      font-size: getTabletSize(120);
      letter-spacing: getTabletSize(10);
    }
  }
}

@media (orientation: landscape) {
  .loading-text {
    -webkit-text-stroke: getDesktopSize(1);
    font-size: getDesktopSize(120);
    letter-spacing: getDesktopSize(10);
  }
}
</style>
