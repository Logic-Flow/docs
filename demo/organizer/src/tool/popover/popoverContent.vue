<template>
  <div>
    <div class="node-add-title">添加通用节点:{{model.id}}</div>
    <ul>
      <li @click="clickMe">11</li>
      <li>14</li>
      <li>13</li>
      <li>11</li>
      <li>14</li>
      <li>13</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    model: Object
  },
  methods: {
    clickMe () {
    }
  }
}
</script>

<style>

</style>