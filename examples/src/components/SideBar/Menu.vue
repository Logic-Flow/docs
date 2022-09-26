<!--  -->
<template>
  <div :class="`menu-wrap rem-17 ${widthHidden && 'rem-0'}`">
    <div class="menu rem-17">
      <div class="menu-search-wrap">
        <div class="menu-search">
          <span class="menu-search-icon">🔍</span>
          <input
            class="menu-search-input"
            type="text"
            placeholder="搜索"
            v-model="inputValue"
          />
        </div>
        <MenuUp class="menu-search-fold" @click="FoldAll" />
      </div>
      <IntervalMenuVue :data="config" :topic="true"></IntervalMenuVue>
    </div>
    <div class="fold-tool" @click="handleWidthHidden">
      <span :class="`${widthHidden && 'fold-tool-transform'}`">〈 </span>
    </div>
  </div>
</template>

<script setup>
import { provide, ref, watchEffect, inject } from 'vue';
import _ from 'lodash';
import { useAnimations, useMenuItemEvent, useTools } from './composition';
import IntervalMenuVue from './IntervalMenu.vue';
import MenuUp from '../svg/menuUp.vue';

const props = defineProps({
  menuConfig: {
    type: Array,
    default: () => [],
  },
});
const animations = useAnimations();
const menuItemEvents = useMenuItemEvent(props);
const tools = useTools();
const conf = ref(_.cloneDeep(props.menuConfig));
const config = ref({});
const inputValue = ref('');
const widthHidden = ref(false);

tools.initConfig(conf.value);

const FoldAll = () => {
  config.value = tools.filter(_.cloneDeep(conf.value), inputValue.value);
};

const handleWidthHidden = () => {
  widthHidden.value = !widthHidden.value;
};

watchEffect(() => {
  config.value = tools.filter(_.cloneDeep(conf.value), inputValue.value);
});
provide('config', config.value);
const type = inject('type');
provide('inputValue', inputValue);
provide('animations', animations);
provide('menuItemEvents', menuItemEvents);
provide('tools', tools);
</script>
<style lang="scss" scoped>
@import './scoped.scss';
</style>
