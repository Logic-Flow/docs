<!--  -->
<template>
  <div :class="`menu-wrap rem-17 ${widthHidden && 'rem-0'}`">
    <div class="menu rem-17">
      <div class="menu-search-wrap">
        <div class="menu-header">
          <div class="docs" @click="backToDocs">
            <img :src="horizontal_logo" />
          </div>
          <div
            class="gallery"
            v-if="type === 'thumbnail'"
            @click="backToGallery"
          >
            <img :src="gallery" />
          </div>
        </div>
        <div class="menu-sh">
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
      </div>
      <IntervalMenuVue :data="config" :topic="true"></IntervalMenuVue>
    </div>
    <!-- <div class="fold-tool" @click="handleWidthHidden">
      <span :class="`${widthHidden && 'fold-tool-transform'}`">〈 </span>
    </div> -->
  </div>
</template>

<script setup>
import { provide, ref, watchEffect, inject } from "vue";
import _ from "lodash";
import { useAnimations, useMenuItemEvent, useTools } from "./composition";
import IntervalMenuVue from "./IntervalMenu.vue";
import MenuUp from "../svg/menuUp.vue";
import gallery from "../../assets/icon/gallery.png";
import horizontal_logo from "../../assets/icon/horizontal-logo.png";
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  menuConfig: {
    type: Array,
    default: () => [],
  },
  toggleHidden: {
    type: Function,
  },
});
const animations = useAnimations();
const menuItemEvents = useMenuItemEvent(props);
const tools = useTools();
const conf = ref(_.cloneDeep(props.menuConfig));
const config = ref({});
const inputValue = ref("");
const widthHidden = ref(false);

tools.initConfig(conf.value);

const backToGallery = () => {
  router.push({
    name: "Gallery",
  });
};
const backToDocs = () => {
  window.location.href = "https://site.logic-flow.cn/docs/#/";
};

const FoldAll = () => {
  config.value = tools.filter(_.cloneDeep(conf.value), inputValue.value);
};

const handleWidthHidden = () => {
  widthHidden.value = !widthHidden.value;
  console.log(props.toggleHidden);
  props.toggleHidden();
};

watchEffect(() => {
  config.value = tools.filter(_.cloneDeep(conf.value), inputValue.value);
});
provide("config", config.value);
const type = inject("type");
provide("inputValue", inputValue);
provide("animations", animations);
provide("menuItemEvents", menuItemEvents);
provide("tools", tools);
</script>
<style lang="scss" scoped>
@import "./scoped.scss";
</style>
