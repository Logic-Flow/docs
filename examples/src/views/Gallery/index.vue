<!--  -->
<template>
  <div class="gallery">
    <div v-for="item in config" :key="item.key">
      <div
        v-for="examples in item.children"
        :key="examples.key"
        :id="examples.key"
      >
        <div class="sub-title">
          <h2>{{ examples.name }}</h2>
          <h4>{{ examples.key }}</h4>
        </div>
        <div class="case-wrap">
          <div
            v-for="example in examples.examples"
            :key="example.key"
            class="case"
            :id="example.key"
          >
            <div class="case-thumbnail" @click="jumpTo(example)">
              <img :src="handleSrc(example.key)" :alt="example.key" />
            </div>
            <div class="case-name">
              <div>
                <strong>
                  {{ example.name }}
                </strong>
              </div>
              <a
                v-if="example.github"
                :href="example.github"
                class="github-icon"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="24"
                  height="24"
                  data-view-component="true"
                  class="octicon octicon-mark-github v-align-middle"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const jumpTo = (example) => {
  const { mode, key, link } = example;
  if (mode === "playground") {
    type.value = "thumbnail";
    router.push({
      name: "Playground",
      hash: `#${key}`,
    });
  } else {
    (link.includes("http") && window.open(link)) ||
      window.open(`https://site.logic-flow.cn/${link}`);
    window.open(link);
  }
};
const config = inject("originConfig");
const type = inject("type");
const screenshots = inject("screenshots");
const handleSrc = (name) => {
  try {
    return import.meta.env.MODE === "production"
      ? screenshots(name)
      : `src/screenshots/${name}.png`;
  } catch (error) {
    return "no_pic.png";
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
