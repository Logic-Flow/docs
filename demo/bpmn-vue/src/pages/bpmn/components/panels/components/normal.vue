<template>
  <strong class="form-label">NORMAL</strong>
  <div>
    <p class="form-label">Id</p>
    <input
      autocomplete="off"
      style="margin: 6px 0px"
      :value="target.id"
      id="name-input"
      type="text"
      class="form-control"
      @input="onIdInput"
    />
    <p class="form-label">Name</p>
    <input
      autocomplete="off"
      style="margin: 6px 0px"
      :value="target.text.value"
      id="name-input"
      type="text"
      class="form-control"
      @input="onNameInput"
    />
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';

const lf: any = inject('lf');

const target: any = inject('target');

function onIdInput(e: any) {
  lf.changeNodeId(target.value.id, e.currentTarget.value);
}

function onNameInput(e: any) {
  target.value.updateText(e.currentTarget.value);
}
</script>
