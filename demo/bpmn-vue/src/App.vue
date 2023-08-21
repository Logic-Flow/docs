<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import BPMN from './pages/bpmn.vue';
</script>

<template>
  <BPMN />
</template>

<style scoped>
html,
body {
  width: 100%;
  height: 100%;
  background-color: white;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
