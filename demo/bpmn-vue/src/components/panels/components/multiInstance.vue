<template>
  <strong class="form-label">MULTI-INSTANCE</strong>
  <div>
    <p class="form-label">Multi-instance Type</p>
    <select
      name="multiInstanceType"
      class="form-select"
      style="margin: 6px 0px"
      :value="target.properties.multiInstanceType"
      @change="onInstanceTypeChange"
    >
      <option value="">none</option>
      <option value="parallel">parallel</option>
      <option value="sequential">sequential</option>
      <!-- <option value="loop">loop</option> -->
    </select>
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';

const target: any = inject('target');

function onInstanceTypeChange(e: any) {
  target.value.setProperties({
    multiInstanceType: e.target.value,
  });
}
</script>
