<!--  -->
<template>
  <div class="gallery">
    <div v-for="item in config" :key="item.key">
      <div
        v-for="examples in item.children"
        :key="examples.key"
        :id="examples.key"
      >
        <h2>{{ examples.name }}</h2>
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
                {{ example.name }}
              </div>
              <a v-if="example.github" :href="example.github"
                >🔗 view in github
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
    console.log(link);
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
