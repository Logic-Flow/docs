import { reactive, markRaw, defineAsyncComponent } from 'vue';

const components: any = reactive({
  normal: markRaw(defineAsyncComponent(() => import('./normal.vue'))),
  timerDefinition: markRaw(
    defineAsyncComponent(() => import('./timerDefinition.vue')),
  ),
  condition: markRaw(defineAsyncComponent(() => import('./condition.vue'))),
  multiInstance: markRaw(
    defineAsyncComponent(() => import('./multiInstance.vue')),
  ),
  processRef: markRaw(defineAsyncComponent(() => import('./processRef.vue'))),
});

export default components;
