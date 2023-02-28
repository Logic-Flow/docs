<!--  -->
<template>
  <div
    v-show="data.has"
    class="examples"
    @click.stop="menuItemEvents.handleExamplesItemClick(data.name)"
  >
    <div :class="`with-thumbnail ${data.name}`" v-if="type === 'thumbnail'">
      <div
        :class="`hover-font sub-title ${animations.handleIconFold(data.fold)}`"
        @click.stop="animations.toggleFold(data)"
      >
        <div>
          <i :class="`categorize_icon categorize_${data.key}`"></i>
          <p v-html="tools.hightLight(data, inputValue)"></p>
        </div>
        <span class="fold-icon"></span>
      </div>
      <CollapseTransition>
        <div v-show="!data.fold" class="sub-items">
          <div
            v-for="(example, index) in data.examples"
            :key="example.key"
            class="popover-wrap"
            @mouseover="handleSubItemMouseOver(`title-popover-${example.name}`)"
            @mouseout="handleSubItemMouseOut(`title-popover-${example.name}`)"
          >
            <template v-if="example.mode === 'playground'">
              <div :class="`title-popover title-popover-${example.name}`">
                <div class="title-main">
                  {{ example?.name }}
                </div>
                <div></div>
              </div>
              <a
                draggable="false"
                @click.stop="
                  () => {
                    menuItemEvents.clickItem(`${example.name}`);
                    menuItemEvents.toggleSelectedByPath(config, data.name);
                    router.push(`playground#${example.key}`);
                  }
                "
                :class="`${example.name} hover-bkg sub-item`"
                href="javascript:void(0)"
              >
                <img
                  draggable="false"
                  class="thumbnail"
                  :src="handleSrc(example.key)"
                />
              </a>
            </template>
          </div>
        </div>
      </CollapseTransition>
    </div>
    <div v-else :class="`${data.name} hover-bkg`">
      <a
        href="javascript:void(0)"
        class="menu-content"
        @click="handleAtagClick(data.name, data.key)"
        v-html="tools.hightLight(data, inputValue)"
      >
      </a>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref } from "vue";
import { useRouter } from "vue-router";
import CollapseTransition from "../SideBarTransition/transition.vue";
// import { getScreenshot } from "../../utils";

const router = useRouter();

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return [
        {
          key: "",
          name: "",
          examples: [],
        },
      ];
    },
  },
});

const handleSubItemMouseOver = (className) => {
  const dom = document.querySelector(`.${className}`);
  dom.classList.add("popover-in");
};

const handleSubItemMouseOut = (className) => {
  const dom = document.querySelector(`.${className}`);
  dom.classList.remove("popover-in");
};

const config = inject("config");
const type = computed(() => {
  return inject("type").value;
});
const tools = inject("tools");
const menuItemEvents = inject("menuItemEvents");
const animations = inject("animations");
const inputValue = inject("inputValue");
const screenshots = inject("screenshots");
const handleSrc = (name) => {
  return import.meta.env.MODE === "production"
    ? screenshots(name)
    : `src/screenshots/${name}.png`;
};

const handleAtagClick = (name, id) => {
  tools.goAnchor(id);
  menuItemEvents.toggleSelectedByPath(config, name);
};
// const handleImgATagClick = (exampleName, dataName, id) => {
//   menuItemEvents.clickItem(`${exampleName}`);
//   menuItemEvents.toggleSelectedByPath(config, dataName);
// };
</script>
<style lang="scss" scoped>
@import "./scoped.scss";
</style>
