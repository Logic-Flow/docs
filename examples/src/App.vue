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
    <MenuVue :type="type" :menuConfig="config.topic"></MenuVue>
    <div class="main"><router-view /></div>
  </div>
</template>

<style>
body,
html {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
}
.main {
  background-color: #fff;
  width: 100%;
  color: #000;
}
</style>
