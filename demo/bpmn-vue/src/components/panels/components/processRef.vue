<template>
  <strong class="form-label">PROCCESSREF</strong>
  <div>
    <p class="form-label">processRef</p>
    <select
      name="processRef"
      class="form-select"
      style="margin: 6px 0px"
      :value="target.properties.processRef"
      @change="onProcessRefTypeChange"
    >
      <option value="">none</option>
      <!-- <option value="parallel">parallel</option>
      <option value="sequential">sequential</option> -->
      <!-- <option value="loop">loop</option> -->
    </select>
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';

const target: any = inject('target');

function onProcessRefTypeChange(e: any) {
  target.value.setProperties({
    processRef: e.target.value,
  });
}
</script>
