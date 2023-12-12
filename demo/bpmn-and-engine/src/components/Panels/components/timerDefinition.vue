<!--  -->
<template>
  <strong class="form-label">TIMER DEFINITION</strong>
  <div>
    <P class="form-label">Type</P>
    <select
      name="timerType"
      class="form-select"
      style="margin: 6px 0px"
      :value="target.properties.timerType"
      @change="change"
    >
      <option value="timeDuration">延迟触发</option>
    </select>
  </div>
  <p class="form-label">Value</p>
  <input
    autocomplete="off"
    style="margin: 6px 0px"
    :value="target.properties.timerValue"
    id="name-input"
    type="text"
    class="form-control"
    @input="input"
  />
  <div style="width: 250px">
    <div v-if="timerType === 'timeDuration'">
      <div>
        <p>例如：15, 单位秒</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, ref } from "vue";

const target: any = inject("target");
const timerType = ref(target.value.properties.timerType || "");

function change(e: any) {
  target.value.setProperties({
    timerType: e.target.value,
  });
  timerType.value = e.target.value;
}

function input(e: any) {
  const time = Number(e.currentTarget.value);
  if (isNaN(time)) {
    alert("请输入有效数字");
    return;
  }
  target.value.setProperties({
    timerValue: time,
  });
}
</script>
