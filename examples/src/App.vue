<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { provide, ref, watch } from "vue";
import { useRoute } from "vue-router";

import MenuVue from "./components/SideBar/Menu.vue";
import Banner from "./components/Banner/Banner.vue"
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
      <Banner />
      <router-view />
    </div>
    <!-- <div class="contact-us" v-if="route.name === 'Gallery'">
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="wechat"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M690.1 377.4c5.9 0 11.8.2 17.6.5-24.4-128.7-158.3-227.1-319.9-227.1C209 150.8 64 271.4 64 420.2c0 81.1 43.6 154.2 111.9 203.6a21.5 21.5 0 019.1 17.6c0 2.4-.5 4.6-1.1 6.9-5.5 20.3-14.2 52.8-14.6 54.3-.7 2.6-1.7 5.2-1.7 7.9 0 5.9 4.8 10.8 10.8 10.8 2.3 0 4.2-.9 6.2-2l70.9-40.9c5.3-3.1 11-5 17.2-5 3.2 0 6.4.5 9.5 1.4 33.1 9.5 68.8 14.8 105.7 14.8 6 0 11.9-.1 17.8-.4-7.1-21-10.9-43.1-10.9-66 0-135.8 132.2-245.8 295.3-245.8zm-194.3-86.5c23.8 0 43.2 19.3 43.2 43.1s-19.3 43.1-43.2 43.1c-23.8 0-43.2-19.3-43.2-43.1s19.4-43.1 43.2-43.1zm-215.9 86.2c-23.8 0-43.2-19.3-43.2-43.1s19.3-43.1 43.2-43.1 43.2 19.3 43.2 43.1-19.4 43.1-43.2 43.1zm586.8 415.6c56.9-41.2 93.2-102 93.2-169.7 0-124-120.8-224.5-269.9-224.5-149 0-269.9 100.5-269.9 224.5S540.9 847.5 690 847.5c30.8 0 60.6-4.4 88.1-12.3 2.6-.8 5.2-1.2 7.9-1.2 5.2 0 9.9 1.6 14.3 4.1l59.1 34c1.7 1 3.3 1.7 5.2 1.7a9 9 0 006.4-2.6 9 9 0 002.6-6.4c0-2.2-.9-4.4-1.4-6.6-.3-1.2-7.6-28.3-12.2-45.3-.5-1.9-.9-3.8-.9-5.7.1-5.9 3.1-11.2 7.6-14.5zM600.2 587.2c-19.9 0-36-16.1-36-35.9 0-19.8 16.1-35.9 36-35.9s36 16.1 36 35.9c0 19.8-16.2 35.9-36 35.9zm179.9 0c-19.9 0-36-16.1-36-35.9 0-19.8 16.1-35.9 36-35.9s36 16.1 36 35.9a36.08 36.08 0 01-36 35.9z"
        ></path>
      </svg>
      <div class="qrcode">123</div>
    </div> -->
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

body {
  background-color: #f6f6f6;
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
  // padding-top: 60px;
}
.main {
  flex: 1;
  background-color: #FFFFFF;
  // width: calc(100% - 17rem - 10px);
  color: #000;
  transition: 0.5s;
  position: relative;
  padding-top: 70px;
}

.widthHidden {
  width: calc(100% - 27px - 10px);
}

.widthOpen {
  width: calc(100% - 17rem - 30px);
}

.contact-us {
  top: 48px;
  position: fixed;
  right: 10px;
  color: #818181;
  width: 48px;
  height: 48px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 2px #ddd;
}

.qrcode {
  position: absolute;
  top: 56px;
  right: 56px;
  background: black;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
