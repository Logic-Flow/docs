<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { provide, ref, watch } from "vue";
import { useRoute } from "vue-router";

import MenuVue from "./components/SideBar/Menu.vue";
import config from "../examples/config.json";
import { getScreenshots } from "./utils";

const route = useRoute();
const type = ref("withoutThumbnail");
const screenshots = getScreenshots();
const sideBarHidden = ref(false);
function toggleHidden() {
  sideBarHidden.value = !sideBarHidden.value;
  console.log("boolean", sideBarHidden);
}
watch(() => [
  (type.value = route.name === "Playground" ? "thumbnail" : "withoutThumbnail"),
]);
provide("originConfig", config.topic);
provide("type", type);
provide("screenshots", screenshots);
</script>

<template>
  <div class="container">
    <!-- <SideBarVue :type="type" :menuConfig="config.topic"></SideBarVue> -->
    <MenuVue
      :type="type"
      :menuConfig="config.topic"
      :toggleHidden="toggleHidden"
    ></MenuVue>
    <div :class="`main ${sideBarHidden ? 'widthHidden' : 'widthOpen'}`">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
body,
html {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.wrap {
  height: 100%;
  width: 100%;
  .header {
    width: 100%;
    height: 5%;
  }
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
}
.main {
  background-color: #fff;
  width: calc(100% - 17rem);
  color: #000;
  transition: 0.5s;
}

.widthHidden {
  width: calc(100% - 27px);
}

.widthOpen {
  width: calc(100% - 17rem);
}
</style>
