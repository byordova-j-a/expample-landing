<template>
  <div
    class="main h-full w-full flex flex-row items-center justify-center overflow-hidden"
    :style="cssComputedVars"
    :class="isMounted ? 'opacity-100' : 'opacity-0'"
  >
    <img
      class="absolute w-full h-full background object-cover"
      src="/src/assets/img/bg.jpg"
      alt="background"
    />
    <div class="relative h-0 w-0">
      <div
        class="lang-block absolute overflow-hidden z-20"
        :class="isLangBlockOpened ? 'opened-lang-block' : 'closed-lang-block'"
      >
        <div class="absolute w-full h-full lang-block-bg" />
        <div class="relative lang-list flex flex-col z-10">
          <div
            class="lang-list-item flex flex-row items-center justify-between"
            v-for="lang in langList"
            :key="lang.value"
            @click="onLanguageBlockClick(lang.value)"
          >
            <p>{{ lang.text }}</p>
            <p class="arrow relative" v-if="lang.value == locale"></p>
          </div>
        </div>
      </div>
      <div class="absolute cancel-button-block">
        <div
          class="absolute button-shape left-0 bottom-0 z-10"
          :class="buttonHoweredBlockClass"
          @mouseenter="cancelButtonMoving('left-bottom')"
        ></div>
        <div
          class="absolute button-shape right-0 bottom-0 z-10"
          :class="buttonHoweredBlockClass"
          @mouseenter="cancelButtonMoving('right-bottom')"
        ></div>
        <div
          class="absolute button-shape right-0 top-0 z-10"
          :class="buttonHoweredBlockClass"
          @mouseenter="cancelButtonMoving('right-top')"
        ></div>
        <div
          class="absolute button-shape left-0 top-0 z-10"
          :class="buttonHoweredBlockClass"
          @mouseenter="cancelButtonMoving('left-top')"
        ></div>

        <div
          class="absolute cancel-button button-shape z-0 flex flex-row items-center justify-center text-center"
          :class="cancelButtonClassList"
        >
          <div
            v-show="isCancelButtonBroken"
            class="absolute ribbon-block flex flex-row items-center"
          >
            <div class="ribbon">{{ t('ribbon') }}</div>
          </div>
          <p>
            {{ cancelText }}
          </p>
        </div>
      </div>
      <div
        class="text-block absolute flex flex-col justify-center items-center z-10"
        :class="textBlockClass"
      >
        <TextLoader v-model:is-shown="isLoading" />
        <div v-show="!isLoading && line1Text" class="line-wrapper">
          <p class="relative text line1">{{ line1Text }}</p>
        </div>
        <div v-show="!isLoading && line2Text" class="line-wrapper">
          <p class="relative text line2">{{ line2Text }}</p>
        </div>
        <div v-show="!isLoading && line3Text" class="line-wrapper">
          <p class="relative text line3">{{ line3Text }}</p>
        </div>
        <div v-show="!isLoading" class="mobile-line-wrapper">
          <p class="relative text mobile-line">{{ line1Text }} {{ line2Text }} {{ line3Text }}</p>
        </div>
        <img class="absolute cat bottom-0 left-0" src="/src/assets/img/cat.png" alt="cat" />
        <img
          class="absolute cat top-0 right-0 rotate-180"
          src="/src/assets/img/cat.png"
          alt="cat"
        />
      </div>
      <div
        class="confirm-button button-text-large z-0 button-shape absolute flex flex-row items-center justify-center text-center"
        @click="confirmButtonClick"
        :class="isButtonsShowed ? 'show-confirm-button' : 'hide-confirm-button'"
      >
        {{ confirmText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue';
import TextLoader from './components/TextLoader.vue';
import { useI18n } from 'vue-i18n';
import { debounce } from 'lodash-es';

const enum EPosition {
  LEFT_BOTTOM = 'left-bottom',
  RIGHT_BOTTOM = 'right-bottom',
  RIGHT_TOP = 'right-top',
  LEFT_TOP = 'left-top',
  TOP = 'top',
}

const enum ELine {
  LINE_1 = 'line1',
  LINE_2 = 'line2',
  LINE_3 = 'line3',
}

const currentLocale: string = window.navigator.language.split('-')[0];
const { t, locale, messages } = useI18n();
const localList: string[] = Object.keys(messages.value);

if (localList.includes(currentLocale)) locale.value = currentLocale;
else locale.value = 'en';

const langList = ref([
  { text: 'English', value: 'en' },
  { text: 'Русский', value: 'ru' },
]);

const isLangBlockOpened = ref(false);

const isMounted = ref(false);
const line1Text = ref('');
const line2Text = ref('');
const line3Text = ref('');

const confirmText = ref('');
const cancelText = ref('');

const isLoading = ref(false);
const isCancelButtonDisappeared = ref(false);
const isButtonsShowed = ref(false);
const isCancelButtonBroken = ref(false);

const buttonTransitionDuration = ref(0);
const langBlockTransitionDuration = ref(0);

const line1AnimationDuration = ref(1200);
const line2AnimationDuration = ref(0);
const line3AnimationDuration = ref(0);

const confirmButtonClickCount = ref(0);
const cancelButtonRoundCount = ref(0);

const cancelButtonTextSize = ref('large');

const position = ref(EPosition.LEFT_BOTTOM);
const catOpacity = ref(0);
const arrowAngle = ref(0);

const lineTextObj = computed<{
  [key in ELine]: { [key in 0 | 1 | 2 | 3]: string };
}>(() => {
  return {
    line1: {
      0: t('line1.0'),
      1: t('line1.1'),
      2: t('line1.2'),
      3: t('line1.3'),
    },
    line2: {
      0: t('line2.0'),
      1: t('line2.1'),
      2: t('line2.2'),
      3: t('line2.3'),
    },
    line3: {
      0: t('line3.0'),
      1: t('line3.1'),
      2: t('line3.2'),
      3: t('line3.3'),
    },
  };
});

const confirmTextObj = computed(() => {
  return {
    0: t('confirmText.0'),
    1: t('confirmText.1'),
    2: t('confirmText.2'),
    3: t('confirmText.3'),
  };
});

const cancelTextObj = computed(() => {
  return {
    0: t('cancelText.0'),
    1: t('cancelText.1'),
    2: t('cancelText.2'),
    3: t('cancelText.3'),
  };
});

const cssComputedVars = computed(() => {
  return {
    '--cat-img-opacity': catOpacity.value,
    '--line1-animation-duration': line1AnimationDuration.value + 'ms',
    '--line2-animation-duration': line2AnimationDuration.value + 'ms',
    '--line3-animation-duration': line3AnimationDuration.value + 'ms',
    '--button-transition-duration': buttonTransitionDuration.value + 'ms',
    '--lang-block-transition-duration': langBlockTransitionDuration.value + 'ms',
    '--arrow-angle': arrowAngle.value + 'deg',
  };
});

const cancelButtonClassList = computed(() => {
  return [
    position.value === EPosition.TOP || !isButtonsShowed.value
      ? 'cancel-button-hidden'
      : `cancel-button-` + position.value,
    'button-text-' + cancelButtonTextSize.value,
  ];
});

const buttonHoweredBlockClass = computed(() => {
  return { hidden: !isButtonsShowed.value || isCancelButtonDisappeared.value };
});

const textBlockClass = computed(() => {
  return confirmButtonClickCount.value < 3 ? 'text-large' : 'text-small';
});

const onLanguageBlockClick = async (selectedLocale?: string) => {
  if (!selectedLocale) {
    isLangBlockOpened.value = false;
    return;
  }
  if (!isLangBlockOpened.value) {
    isLangBlockOpened.value = true;
    return;
  }

  if (selectedLocale) locale.value = selectedLocale;
  setTimeout(() => {
    isLangBlockOpened.value = false;
  }, 0);
};

const clickHandler = (event: PointerEvent) => {
  if (!(event.target as Element).closest('.lang-list-item') && isLangBlockOpened.value) {
    onLanguageBlockClick();
  }
};

const debouncedResetLangBlockTransitionDuration = debounce(() => {
  langBlockTransitionDuration.value = 0;
}, 600);

const updateLangBlockTransitionDuration = () => {
  langBlockTransitionDuration.value = 600;
  debouncedResetLangBlockTransitionDuration();
};

const debouncedResetButtonTransitionDuration = debounce(() => {
  buttonTransitionDuration.value = 0;
}, 600);

const updateButtonTransitionDuration = () => {
  buttonTransitionDuration.value = 600;
  debouncedResetButtonTransitionDuration();
};

const cancelButtonMoving = (blockPosition: string) => {
  if (isCancelButtonDisappeared.value || !isButtonsShowed.value || position.value !== blockPosition)
    return;
  updateButtonTransitionDuration();

  switch (position.value) {
    case EPosition.LEFT_BOTTOM: {
      if (cancelButtonRoundCount.value === 3) {
        isCancelButtonDisappeared.value = true;
        position.value = EPosition.TOP;
        return;
      }
      position.value = EPosition.RIGHT_BOTTOM;
      return;
    }
    case EPosition.RIGHT_BOTTOM: {
      position.value = EPosition.RIGHT_TOP;
      return;
    }
    case EPosition.RIGHT_TOP: {
      position.value = EPosition.LEFT_TOP;
      return;
    }
    case EPosition.LEFT_TOP: {
      cancelButtonRoundCount.value += 1;
      position.value = EPosition.LEFT_BOTTOM;
      return;
    }
  }
};

const confirmButtonClick = () => {
  if (isLoading.value || confirmButtonClickCount.value === 4) return;
  confirmButtonClickCount.value += 1;
};

watch(
  () => isLangBlockOpened.value,
  () => {
    updateLangBlockTransitionDuration();
  }
);
watch(
  () => locale.value,
  locale => {
    langList.value.sort(langObj => (langObj.value === locale ? -1 : 1));
  },
  { immediate: true }
);

watch(
  () => isLangBlockOpened.value,
  isOpened => {
    arrowAngle.value = isOpened ? 180 : 0;
  }
);

watch(
  () => confirmButtonClickCount.value,
  count => {
    if (count < 4) {
      isLoading.value = true;
      isButtonsShowed.value = false;
      position.value = EPosition.LEFT_BOTTOM;
      updateButtonTransitionDuration();
    }
    if (count === 1) {
      line2AnimationDuration.value = 1200;
    }
    if (count === 2) {
      line2AnimationDuration.value = 0;
    }
    if (count === 3) {
      line1AnimationDuration.value = 1200;
      line2AnimationDuration.value = 1200;
      line3AnimationDuration.value = 1200;
    }
    if (count === 4) {
      // eslint-disable-next-line
      window.location = '' as any;
    }
  }
);

watch(
  () => isLoading.value,
  isLoading => {
    if (!isLoading) {
      if (isCancelButtonDisappeared.value) {
        isCancelButtonBroken.value = true;
      }
      if (confirmButtonClickCount.value === 2) {
        cancelButtonTextSize.value = 'small';
      }
      if (confirmButtonClickCount.value === 3) {
        catOpacity.value = 1;
      }

      setTimeout(
        () => {
          isButtonsShowed.value = true;
          updateButtonTransitionDuration();
        },
        line1AnimationDuration.value + line2AnimationDuration.value + line3AnimationDuration.value
      );
    }
  }
);

watch([() => isLoading.value, () => lineTextObj.value], ([isLoading, lineTextObj]) => {
  line1Text.value = lineTextObj[ELine.LINE_1][confirmButtonClickCount.value];
  line2Text.value = lineTextObj[ELine.LINE_2][confirmButtonClickCount.value];
  line3Text.value = lineTextObj[ELine.LINE_3][confirmButtonClickCount.value];
  const id = !isLoading
    ? confirmButtonClickCount.value
    : confirmButtonClickCount.value
      ? confirmButtonClickCount.value - 1
      : 0;

  confirmText.value = confirmTextObj.value[id];
  cancelText.value = cancelTextObj.value[id];
});

onMounted(async () => {
  document.addEventListener('click', clickHandler);

  const imgPromises = [
    new URL('/src/assets/img/bath.png', import.meta.url).href,
    new URL('/src/assets/img/bg.jpg', import.meta.url).href,
    new URL('/src/assets/img/cat.png', import.meta.url).href,
  ].map((imgUrl: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = err => {
        reject(err);
      };
    });
  });
  await Promise.all(imgPromises);

  setTimeout(() => {
    isLoading.value = true;
    isMounted.value = true;
  }, 500);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', clickHandler);
});
</script>

<style scoped>
@media (pointer: coarse) {
  .confirm-button:active {
    filter: brightness(1.5);
  }
}
@media (pointer: fine) {
  .confirm-button:hover {
    filter: brightness(1.5);
  }
}
.main {
  user-select: none;
}
@keyframes line-vertical-animation {
  from {
    height: 0;
  }
  to {
    height: 100%;
  }
}
@keyframes line-appear-animation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.line1 {
  animation: line-appear-animation var(--line1-animation-duration) linear forwards;
  opacity: 0;
}
.line2 {
  animation: line-appear-animation var(--line2-animation-duration) linear forwards;
  animation-delay: var(--line1-animation-duration);
  opacity: 0;
}
.line3 {
  animation: line-appear-animation var(--line3-animation-duration) linear forwards;
  animation-delay: calc(var(--line1-animation-duration) + var(--line2-animation-duration));
  opacity: 0;
}
.mobile-line {
  height: 0;
  animation: line-vertical-animation
    calc(
      var(--line1-animation-duration) + var(--line2-animation-duration) +
        var(--line3-animation-duration)
    )
    linear forwards;
}
.text-block {
  border-style: double;
  border-color: rgb(36, 33, 48);
  text-align: center;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  background: url(/src/assets/img/bg.jpg) no-repeat border-box;
}
.text {
  overflow: hidden;
  -webkit-text-stroke-color: white;
}
.cancel-button {
  transition-duration: var(--button-transition-duration);
  transition-property: transform;
  bottom: 0;
  left: 0;
  background: radial-gradient(120% 95% at 50% 0%, #4d4d71 50%, #343455);
  color: rgba(255, 255, 255, 0.496);
  -webkit-text-stroke-color: white;
}
.confirm-button {
  cursor: pointer;
  transition:
    transform var(--button-transition-duration),
    filter 600ms;
  background: radial-gradient(120% 95% at 50% 0%, #4d4d71 50%, #343455);
  color: rgba(255, 255, 255, 0.496);
  -webkit-text-stroke-color: white;
}
.cat {
  opacity: var(--cat-img-opacity);
  transition-property: opacity;
  transition-duration: 8000ms;
}
.ribbon-block {
  color: black;
  transform: skewY(8deg);
  width: 100%;
  background-color: #d6d715;
}
.ribbon {
  border-style: solid;
  border-color: black;
  -webkit-text-stroke-width: 0;
  width: 100%;
}
.lang-block {
  box-sizing: content-box;
  border-style: double;
  border-color: rgba(255, 255, 255, 0.674);
  transition-duration: var(--lang-block-transition-duration);
  transition-property: height;
}
.lang-list-item {
  color: rgba(255, 255, 255, 0.496);
  -webkit-text-stroke-color: white;
  transition-duration: 600ms;
  transition-property: background-color;
  cursor: pointer;
}
.lang-list-item:not(:first-child):hover {
  background-color: #7777872e;
}
.closed-lang-block .lang-list-item:not(:first-child) {
  pointer-events: none;
  cursor: default;
}
.arrow {
  width: 0;
  height: 0;
  transition-property: transform;
  transition-duration: 600ms;
}
.arrow:after {
  width: 0;
  height: 0;
  content: '';
  display: block;
}
@media (orientation: portrait) {
  .background {
    object-position: right top;
  }
  @media screen and (max-width: 668px) {
    .lang-block {
      width: getMobileSize(100);
      transform: translate(getMobileSize(64), getMobileSize(-270));
      border-radius: getMobileSize(10);
      border-width: getMobileSize(4);
    }
    .opened-lang-block {
      height: getMobileSize(60);
    }
    .closed-lang-block {
      height: getMobileSize(30);
    }
    .lang-block-bg {
      backdrop-filter: blur(getMobileSize(2));
    }
    .lang-list {
      height: getMobileSize(60);
    }
    .lang-list-item {
      height: getMobileSize(40);
      padding: 0 getMobileSize(14);
      font-size: getMobileSize(14);
      -webkit-text-stroke-width: getMobileSize(0.5);
    }
    .arrow {
      width: 0;
      height: 0;
      border: getMobileSize(6) solid transparent;
      border-top: getMobileSize(8) solid rgba(255, 255, 255, 0.496);
      top: getMobileSize(5);
      transform-origin: 50% 20%;
      transform: rotate(var(--arrow-angle));
    }
    .arrow:after {
      border: getMobileSize(3) solid transparent;
      border-top: getMobileSize(5) solid white;
      transform: translate(getMobileSize(-3), getMobileSize(-7));
    }
    .cancel-button-block {
      height: getMobileSize(560);
      width: getMobileSize(220);
      transform: translate(getMobileSize(-169), -50%);
    }
    .text-block {
      border-width: getMobileSize(20);
      height: getMobileSize(400);
      width: getMobileSize(340);
      padding: 0 getMobileSize(10);
      background-position: 80% 80%;
    }
    .text {
      color: rgba(255, 255, 255, 0.496);
      -webkit-text-stroke-width: getMobileSize(0.7);
    }
    .text-large {
      font-size: getMobileSize(22);
      line-height: getMobileSize(36);
    }
    .text-small {
      font-size: getMobileSize(16);
      line-height: getMobileSize(30);
    }
    .line-wrapper {
      opacity: 0;
      position: absolute;
    }
    .mobile-line-wrapper {
      position: relative;
    }
    .button-shape {
      height: getMobileSize(80);
      width: getMobileSize(110);
      border-bottom-left-radius: getMobileSize(10);
      border-bottom-right-radius: getMobileSize(10);
    }
    .cancel-button {
      box-shadow: inset 0px getMobileSize(-6) 0 #3f3f68;
      -webkit-text-stroke-width: getMobileSize(0.5);
    }
    .button-text-large {
      font-size: getMobileSize(17);
      line-height: getMobileSize(22);
    }
    .button-text-small {
      font-size: getMobileSize(11);
      line-height: getMobileSize(19);
    }
    .confirm-button {
      box-shadow: inset 0px getMobileSize(-6) 0px #3f3f68;
      -webkit-text-stroke-width: getMobileSize(0.5);
    }
    .cat {
      width: getMobileSize(190);
    }
    .ribbon-block {
      height: getMobileSize(30);
    }
    .ribbon {
      border-top-width: getMobileSize(1);
      border-bottom-width: getMobileSize(1);
      height: getMobileSize(24);
      font-size: getMobileSize(10);
      line-height: getMobileSize(20);
    }
    .show-confirm-button {
      transform: translate(getMobileSize(59), getMobileSize(200));
    }
    .hide-confirm-button {
      transform: translate(getMobileSize(59), getMobileSize(119));
    }
    .cancel-button-hidden {
      transform: translate(0, getMobileSize(-81));
    }
    .cancel-button-left-bottom {
      transform: translate(0, getMobileSize(0));
    }
    .cancel-button-right-bottom {
      transform: translate(getMobileSize(110), getMobileSize(0));
    }
    .cancel-button-right-top {
      transform: translate(getMobileSize(110), getMobileSize(-480));
    }
    .cancel-button-left-top {
      transform: translate(0, getMobileSize(-480));
    }
  }
  @media screen and (min-width: 669px) {
    .lang-block {
      width: getTabletSize(130);
      transform: translate(getTabletSize(350), getTabletSize(-500));
      border-radius: getTabletSize(10);
      border-width: getTabletSize(5);
    }
    .opened-lang-block {
      height: getTabletSize(80);
    }
    .closed-lang-block {
      height: getTabletSize(40);
    }
    .lang-block-bg {
      backdrop-filter: blur(getTabletSize(2));
    }
    .lang-list {
      height: getTabletSize(80);
    }
    .lang-list-item {
      height: getTabletSize(40);
      padding: 0 getTabletSize(14);
      font-size: getTabletSize(22);
      -webkit-text-stroke-width: getTabletSize(0.5);
    }
    .arrow {
      width: 0;
      height: 0;
      border: getTabletSize(6) solid transparent;
      border-top: getTabletSize(10) solid rgba(255, 255, 255, 0.496);
      top: getTabletSize(5);
      transform-origin: 50% 20%;
      transform: rotate(var(--arrow-angle));
    }
    .arrow:after {
      border: getTabletSize(3) solid transparent;
      border-top: getTabletSize(6) solid white;
      transform: translate(getTabletSize(-2), getTabletSize(-8));
    }
    .cancel-button-block {
      height: getTabletSize(800);
      width: getTabletSize(500);
      transform: translate(getTabletSize(-399), -50%);
    }
    .text-block {
      border-width: getTabletSize(20);
      height: getTabletSize(600);
      width: getTabletSize(800);
    }
    .text {
      text-wrap: nowrap;
      color: rgba(255, 255, 255, 0.496);
      -webkit-text-stroke-width: getTabletSize(0.7);
    }
    .text-large {
      font-size: getTabletSize(34);
      line-height: getTabletSize(44);
    }
    .text-small {
      font-size: getTabletSize(28);
      line-height: getTabletSize(38);
    }
    .text-large .text,
    .text-large .line-wrapper {
      height: getTabletSize(44);
    }
    .text-small .text,
    .text-small .line-wrapper {
      height: getTabletSize(38);
    }
    .mobile-line-wrapper {
      opacity: 0;
      position: absolute;
    }
    .line-wrapper {
      position: relative;
    }
    .button-shape {
      height: getTabletSize(100);
      width: getTabletSize(250);
      border-bottom-left-radius: getTabletSize(10);
      border-bottom-right-radius: getTabletSize(10);
    }
    .cancel-button {
      box-shadow: inset 0px getTabletSize(-6) 0px #3f3f68;
      -webkit-text-stroke-width: getTabletSize(0.5);
    }
    .button-text-large {
      font-size: getTabletSize(28);
      line-height: getTabletSize(34);
    }
    .button-text-small {
      font-size: getTabletSize(18);
      line-height: getTabletSize(24);
    }
    .confirm-button {
      box-shadow: inset 0px getTabletSize(-6) 0px #3f3f68;
      -webkit-text-stroke-width: getTabletSize(0.5);
    }
    .cat {
      width: getTabletSize(380);
    }
    .ribbon-block {
      height: getTabletSize(30);
    }
    .ribbon {
      border-width: getTabletSize(2);
      height: getTabletSize(24);
      font-size: getTabletSize(14);
      line-height: getTabletSize(20);
    }
    .show-confirm-button {
      transform: translate(getTabletSize(149), getTabletSize(300));
    }
    .hide-confirm-button {
      transform: translate(getTabletSize(149), getTabletSize(199));
    }
    .cancel-button-hidden {
      transform: translate(0, getTabletSize(-101));
    }
    .cancel-button-left-bottom {
      transform: translate(0, getTabletSize(0));
    }
    .cancel-button-right-bottom {
      transform: translate(getTabletSize(250), getTabletSize(0));
    }
    .cancel-button-right-top {
      transform: translate(getTabletSize(250), getTabletSize(-700));
    }
    .cancel-button-left-top {
      transform: translate(0, getTabletSize(-700));
    }
  }
}
@media (orientation: landscape) {
  .lang-block {
    width: getDesktopSize(130);
    transform: translate(getDesktopSize(600), getDesktopSize(-400));
    border-radius: getDesktopSize(10);
    border-width: getDesktopSize(5);
  }
  .opened-lang-block {
    height: getDesktopSize(80);
  }
  .closed-lang-block {
    height: getDesktopSize(40);
  }
  .lang-block-bg {
    backdrop-filter: blur(getDesktopSize(2));
  }
  .lang-list {
    height: getDesktopSize(80);
  }
  .lang-list-item {
    height: getDesktopSize(40);
    padding: 0 getDesktopSize(14);
    font-size: getDesktopSize(22);
    -webkit-text-stroke-width: getDesktopSize(0.5);
  }
  .arrow {
    width: 0;
    height: 0;
    border: getDesktopSize(6) solid transparent;
    border-top: getDesktopSize(10) solid rgba(255, 255, 255, 0.496);
    top: getDesktopSize(5);
    transform-origin: 50% 20%;
    transform: rotate(var(--arrow-angle));
  }
  .arrow:after {
    border: getDesktopSize(4) solid transparent;
    border-top: getDesktopSize(6.6) solid white;
    transform: translate(getDesktopSize(-3), getDesktopSize(-9));
  }
  .cancel-button-block {
    height: getDesktopSize(700);
    width: getDesktopSize(1300);
    transform: translate(getDesktopSize(-499), -50%);
  }
  .text-block {
    border-width: getDesktopSize(20);
    height: getDesktopSize(500);
    width: getDesktopSize(1000);
  }
  .text {
    text-wrap: nowrap;
    color: rgba(255, 255, 255, 0.496);
    -webkit-text-stroke-width: getDesktopSize(0.7);
  }
  .text-large {
    font-size: getDesktopSize(40);
    line-height: getDesktopSize(54);
  }
  .text-small {
    font-size: getDesktopSize(36);
    line-height: getDesktopSize(50);
  }
  .text-large .text,
  .text-large .line-wrapper {
    height: getDesktopSize(54);
  }
  .text-small .text,
  .text-small .line-wrapper {
    height: getDesktopSize(50);
  }
  .mobile-line-wrapper {
    opacity: 0;
    position: absolute;
  }
  .line-wrapper {
    position: relative;
    width: max-content;
  }
  .button-shape {
    height: getDesktopSize(100);
    width: getDesktopSize(300);
    border-bottom-left-radius: getDesktopSize(10);
    border-bottom-right-radius: getDesktopSize(10);
  }
  .cancel-button {
    box-shadow: inset 0px getDesktopSize(-6) 0px #3f3f68;
    -webkit-text-stroke-width: getDesktopSize(0.5);
  }
  .button-text-large {
    font-size: getDesktopSize(34);
    line-height: getDesktopSize(40);
  }
  .button-text-small {
    font-size: getDesktopSize(22);
    line-height: getDesktopSize(28);
  }
  .confirm-button {
    box-shadow: inset 0px getDesktopSize(-6) 0px #3f3f68;
    -webkit-text-stroke-width: getDesktopSize(0.5);
  }
  .cat {
    width: getDesktopSize(380);
  }
  .ribbon-block {
    height: getDesktopSize(30);
  }
  .ribbon {
    border-top-width: getDesktopSize(2);
    border-bottom-width: getDesktopSize(2);
    height: getDesktopSize(24);
    font-size: getDesktopSize(14);
    line-height: getDesktopSize(20);
  }
  .show-confirm-button {
    transform: translate(getDesktopSize(199), getDesktopSize(250));
  }
  .hide-confirm-button {
    transform: translate(getDesktopSize(199), getDesktopSize(149));
  }
  .cancel-button-hidden {
    transform: translate(getDesktopSize(0), getDesktopSize(-101));
  }
  .cancel-button-left-bottom {
    transform: translate(getDesktopSize(0), getDesktopSize(0));
  }
  .cancel-button-right-bottom {
    transform: translate(getDesktopSize(997), getDesktopSize(0));
  }
  .cancel-button-right-top {
    transform: translate(getDesktopSize(997), getDesktopSize(-600));
  }
  .cancel-button-left-top {
    transform: translate(getDesktopSize(0), getDesktopSize(-600));
  }
}
</style>
