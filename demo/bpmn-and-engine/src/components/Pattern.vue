<template>
  <div id="pattern">
    <template v-for="item in patternConfig" :key="item.id">
      <SvgIcon :iconClass="item.class" @mousedown.native="item.fn" />
    </template>
    <SvgIcon class="entry" iconClass="bpmn-entry" @mousedown.native="noDev" />
    <hr style="width: 50%" />
    <Tools />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import SvgIcon from "./SvgIcon.vue";
import Tools from "./Tools.vue";
import { provide } from "vue";
const props = defineProps({
  lf: Object,
});
const { lf } = props;

provide("lf", lf);

const noDev = () => {
  window.alert("暂未开发");
};

function addNode(type: string, { text, properties }: any) {
  lf!.dnd.startDrag({
    type,
    text: text,
    properties,
  });
}

const patternConfig = [
  {
    class: "bpmn-icon-start-event-none",
    fn: () => {
      addNode("bpmn:startEvent", { text: "开始" });
    },
  },
  {
    class: "bpmn-icon-start-event-timer",
    fn: () => {
      addNode("bpmn:startEvent", {
        text: "时间开始",
        properties: {
          definitionType: "bpmn:timerEventDefinition",
          panels: ["timerDefinition"],
        },
      });
    },
  },
  {
    class: "bpmn-icon-end-event-none",
    fn: () => {
      addNode("bpmn:endEvent", { text: "结束" });
    },
  },
  {
    class: "bpmn-icon-gateway-xor",
    fn: () => {
      addNode("bpmn:exclusiveGateway", {
        text: "排他网关",
        properties: {
          panels: ["variable"],
        },
      });
    },
  },
  {
    class: "bpmn-icon-user-task",
    fn: () => {
      addNode("bpmn:userTask", {
        text: "人工任务",
        properties: {
          panels: ["multiInstance"],
        },
      });
    },
  },
];

lf &&
  lf!.on("selection:selected", () => {
    lf!.updateEditConfig({
      stopMoveGraph: false,
    });
  });
</script>

<style lang="css">
#pattern {
  width: 60px;
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
  flex-direction: column;
  z-index: 111;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  padding: 10px 0;
  font-size: 12px;
  color: #676768;
  user-select: none;
  border-radius: 5px;
}
#pattern svg {
  margin-top: 10px;
}
.entry:hover {
  color: #6e9fda;
  cursor: pointer;
}
</style>
