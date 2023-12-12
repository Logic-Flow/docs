<template>
  <div id="tools">
    <div @click='setFlowControllerVisible'>流程执行</div>
  </div>
</template>

<script setup lang='ts'>
import { inject } from 'vue'
const flowControllerVisible = inject('flowControllerVisible');
const lf: any = inject('lf');
const setFlowControllerVisible = () => {
  console.log(
    lf.getGraphRawData()
  )
  flowControllerVisible.value= !flowControllerVisible.value;
}
</script>
<style lang="less" scoped>
#tools {
  div:hover {
    color: #236eff;
    cursor: pointer;
  }
}
</style>
