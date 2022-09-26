<script setup>
import { addClass, removeClass } from './utils';
const useTransition = () => {
  function beforeEnter(el) {
    addClass(el, 'collapse-transition-group');
    if (!el.dataset) el.dataset = {};

    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;

    el.style.height = '0';
    el.style.paddingTop = 0;
    el.style.paddingBottom = 0;
  }

  function enter(el) {
    el.dataset.oldOverflow = el.style.overflow;
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px';
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    } else {
      el.style.height = '';
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }

    el.style.overflow = 'hidden';
  }

  function afterEnter(el) {
    // for safari: remove class then reset height is necessary
    removeClass(el, 'collapse-transition-group');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow;
  }

  function beforeLeave(el) {
    if (!el.dataset) el.dataset = {};
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldOverflow = el.style.overflow;

    el.style.height = el.scrollHeight + 'px';
    el.style.overflow = 'hidden';
  }

  function leave(el) {
    if (el.scrollHeight !== 0) {
      // for safari: add class after set height, or it will jump to zero height suddenly, weired
      addClass(el, 'collapse-transition-group');
      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    }
  }

  function afterLeave(el) {
    removeClass(el, 'collapse-transition-group');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow;
    el.style.paddingTop = el.dataset.oldPaddingTop;
    el.style.paddingBottom = el.dataset.oldPaddingBottom;
  }

  return {
    beforeEnter,
    enter,
    afterEnter,
    beforeLeave,
    leave,
    afterLeave,
  };
};

const transition = useTransition();
</script>

<template>
  <TransitionGroup
    name="my-group-transition"
    @before-enter="transition.beforeEnter"
    @enter="transition.enter"
    @after-enter="transition.afterEnter"
    @before-leave="transition.beforeLeave"
    @leave="transition.leave"
    @after-leave="transition.afterLeave"
  >
    <slot></slot>
  </TransitionGroup>
</template>

<style></style>
