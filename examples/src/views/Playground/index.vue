<!--  -->
<template>
  <div>
    <div class="lf-playground" :class="src">
      <playground-project id="ide-project" :project-src="src">
      </playground-project>
      <div class="ide">
        <div class="preview">
          <playground-preview id="ide-preview" :project="project">
          </playground-preview>
        </div>
        <div class="editor">
          <playground-tab-bar
            :project="project"
            editor="ide-editor"
            editable-file-system="true"
          ></playground-tab-bar>
          <playground-file-editor
            id="ide-editor"
            :project="project"
            line-numbers
          ></playground-file-editor>
        </div>
      </div>
      <div class="urlDiv">1</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const src = computed(() => {
  return `/docs.logic-flow.cn/examples/dist/playground_json/${route.hash.slice(
    1
  )}.playground.json`;
});
const project = ref(null);
onMounted(() => {
  project.value = "ide-project";
  const timer = setInterval(() => {
    const urlDiv = document.querySelector(".urlDiv");
    const el = document
      .querySelector("#ide-preview")
      ?.shadowRoot?.querySelector("iframe")?.src;
    if (el?.includes("playground-elements")) {
      urlDiv.innerText = el;
      clearInterval(timer);
    }
  }, 1000);
});
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>
