<template>
  <div v-for="(item, index) in data" :key="item.key">
    <div v-if="topic">
      <div :class="`menu-item  ${item.name}`" v-show="item.has">
        <span
          :class="`topic hover-font ${animations.handleIconFold(item.fold)}`"
          @click.stop="animations.toggleFold(item)"
        >
          <div class="topic-content">
            <i :class="`categorize_icon categorize_${index}`"></i>
            <p v-html="tools.hightLight(item, inputValue)"></p>
          </div>
          <span class="fa fa-caret-down"></span>
        </span>
      </div>
    </div>
    <CollapseTransition>
      <div :class="`examples-wrap`" v-show="!topic || !item.fold">
        <IntervalMenu
          v-if="item.children && item.children.length > 0"
          :data="item.children"
        />
        <MenuItem v-else :data="item"></MenuItem>
      </div>
    </CollapseTransition>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import MenuItem from './MenuItem.vue';
import CollapseTransition from '../SideBarTransition/transition.vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  topic: {
    type: Boolean,
    default: false,
  },
  inputValue: {
    type: String,
    default: '',
  },
});

const animations = inject('animations');
const tools = inject('tools');
const inputValue = inject('inputValue');
</script>
<style lang="scss">
@import './style.scss';
</style>
