<template>
  <div>
    <div v-for="item in panels" :key="item">
      <component :is="components[item]"></component>
    </div>

    <div v-for="item in target.properties.panels" :key="item.key">
      <component :is="components[item]"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchEffect, inject, provide, ref } from "vue";
import components from ".";


const lf: any = inject("lf");
const selectedOne: any = inject("selectedOne");
const selectedType: any = inject("selectedType");

const panels = ref([]);

const target: any = ref({});

watchEffect(() => {
  target.value =
    selectedType.value === "node"
      ? lf.getNodeModelById(selectedOne.value)
      : lf.getEdgeModelById(selectedOne.value);
  panels.value =
    selectedType.value === "node" ? ["normal"] : ["normal", "condition"];
});

provide("target", target);
</script>
