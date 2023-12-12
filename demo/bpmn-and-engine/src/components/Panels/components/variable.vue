<template>
    <div>
      <p class="form-label">变量</p>
      <input
        autocomplete="off"
        style="margin: 6px 0px"
        :value="target.properties.variable"
        id="name-input"
        type="text"
        class="form-control"
        @input="onConditionInput"
      />
    </div>
  </template>
  <script setup lang="ts">
  import { inject, ref } from "vue";
  
  const target: any = inject("target");
  
  function onConditionInput(e: any) {
    target.value.setProperties({
      variable: e.currentTarget.value,
    });
  }
  </script>
  