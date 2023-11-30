<template>
  <div class="flow-controller">
    <div v-for="item in config" :key="item.id">
      <SvgIcon
        :iconClass="item.class"
        @mousedown.native="item.onClick"
        style="width: 20px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import SvgIcon from "./SvgIcon.vue";
const props = defineProps({
  engine: Object,
  lf: Object,
});

const path = ref([]);

function findExecutePath(records: any[]) {
  records.forEach((record: any) => {
    const { outgoing } = record;
    outgoing.forEach((item) => {
      const p = records.find((r: any) => r.nodeId === item.target);
      if (p) {
        path.value.push(item);
      }
    });
  });
  path.value.forEach((item) => {
    props.lf.openEdgeAnimation(item.id);
  });
}

onBeforeUnmount(() => {
  path.value.forEach((item) => {
    props.lf.closeEdgeAnimation(item.id);
  });
});

const config = [
  {
    text: "执行",
    class: "flow-control-play",
    onClick: async () => {
      if (path.value.length) {
        path.value.forEach((item) => {
          props.lf.getEdgeModelById(item.id) &&
            props.lf.closeEdgeAnimation(item.id);
        });
      }
      const data = props.lf.getGraphRawData();
      const flowData = props.engine.load({
        graphData: data,
        startNodeType: "bpmn:startEvent",
      });
      const result = await props.engine.execute();
      const records = await props.engine.getExecutionRecord(result.executionId);
      findExecutePath(records);
    },
  },
  {
    text: "重置",
    class: "flow-control-refresh",
    onClick: () => {
      path.value.forEach((item) => {
        props.lf.getEdgeModelById(item.id) &&
          props.lf.closeEdgeAnimation(item.id);
      });
      path.value = [];
    },
  },
];
</script>
<style lang="less" scoped>
.flow-controller {
  display: flex;
  background: #ebebeb;
  position: fixed;
  top: 5px;
  right: 50%;
  border-radius: 5px;
  box-shadow: 0px 1px 4px 0px #a6a6a6;
}
.svg-icon {
  margin: 0px 5px;
}
</style>
