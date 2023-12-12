<template>
  <div class="panel-wrap" v-if="visible">
    <panels v-if="visible" :key="selectedOne" />
  </div>
</template>

<script setup lang="ts">
import panels from './components/panels.vue';
import { ref, onUnmounted, provide } from 'vue';

const props = defineProps({
  lf: {
    type: Object,
    default: {},
  },
});


const { lf } = props;
const selectedType = ref('');
const selectedOne = ref('');

provide('lf', lf);
provide('selectedOne', selectedOne);
provide('selectedType', selectedType);

const visible = ref(false);

function panelVisible(type: 'node' | 'edge') {
  return (e: any) => {
    if (visible.value) {
      if (e.data.id === selectedOne.value) {
        visible.value = false;
      }
    } else {
      visible.value = true;
    }
    selectedOne.value = e.data.id;
    selectedType.value = type;
  };
}

lf.on('node:click', panelVisible('node'));
lf.on('node:delete', panelVisible('node'));
lf.on('blank:mousedown', (_e: any) => {
  if (visible.value) {
    visible.value = false;
  }
});
lf.on('edge:click', panelVisible('edge'));
lf.on('edge:delete', panelVisible('edge'));

onUnmounted(() => {
  lf.off('node:click', panelVisible('node'));
  lf.off('edge:click', panelVisible('edge'));
});
</script>

<style lang="less">
#my-panel {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 100%;
}
.panel-wrap {
  width: 300px;
  height: 100%;
  display: block;
  background-color: #efefef;
  padding: 20px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  overflow: scroll;
}
.panel-wrap::-webkit-scrollbar {
  display: none;
}
</style>
