<template>
  <strong class="form-label">DEFAULT</strong>
  <div>
    <p class="form-label">Is Default Flow?</p>
    <select
      name="isDefaultFlow"
      class="form-select"
      style="margin: 6px 0px"
      :value="target.properties.isDefaultFlow"
      @change="onDefaultChange"
    >
      <option :value="true">yes</option>
      <option :value="false">no</option>
    </select>
    <strong class="form-label">CONDITION</strong>
    <p class="form-label">Expression Type</p>
    <select
      name="isDefaultFlow"
      class="form-select"
      style="margin: 6px 0px"
      :value="target.properties.expressionType"
      @change="onExpressionTypeChange"
    >
      <option value="cdata">cdata</option>
      <option value="normal">normal</option>
    </select>
    <p class="form-label">Expression</p>
    <input
      autocomplete="off"
      style="margin: 6px 0px"
      :value="target.properties.condition"
      id="name-input"
      type="text"
      class="form-control"
      @input="onConditionInput"
    />
  </div>
</template>
<script setup lang="ts">
import { inject, ref } from 'vue';

const target: any = inject('target');
const expressionType: any = ref('');

function onDefaultChange(e: any) {
  target.value.setProperties({
    isDefaultFlow: e.target.value === 'true',
  });
}

function onExpressionTypeChange(e: any) {
  expressionType.value = e.target.value;
  target.value.setProperties({
    expressionType: e.target.value,
  });
}

function onConditionInput(e: any) {
  target.value.setProperties({
    condition: e.currentTarget.value,
  });
}
</script>
