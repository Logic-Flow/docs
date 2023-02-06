<!--  -->
<template>
  <div>
    <div class="lf-playground" :class="src">
      <playground-ide
        id="ide"
        :project-src="src"
        :resizable="true"
        :lineNumbers="true"
        :lineWrapping="false"
        :editableFileSystem="true"
      ></playground-ide>
      <div class="urlDiv">nothing</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const src = computed(() => {
  return `/examples/playground_json/${route.hash.slice(1)}.playground.json`;
});
const project = ref(null);
onMounted(() => {
  project.value = "ide-project";
  let count = 0;
  const timer = setInterval(() => {
    if (count > 20) {
      clearInterval(timer);
    }
    const urlDiv = document.querySelector(".urlDiv");
    const src = document
      .querySelector("#ide")
      ?.shadowRoot?.querySelector("#rhs")
      ?.querySelector("playground-preview")
      ?.shadowRoot?.querySelector("iframe")?.src;
    if (src?.includes("playground-elements")) {
      urlDiv.innerText = src;
      clearInterval(timer);
    }
    count++;
  }, 1000);
});
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>
