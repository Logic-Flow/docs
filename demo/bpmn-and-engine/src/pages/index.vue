<template>
  <div>
    <div id="main-graph"></div>
    <template v-if="logicFlowInstance">
      <Pattern :lf="logicFlowInstance" />
      <FlowController
        v-if="flowControllerVisible"
        :engine="engineInstance"
        :lf="logicFlowInstance"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from "vue";
import { LogicFlow } from "@logicflow/core";
import {
  BPMNElements,
  BPMNAdapter,
  Group,
  SelectionSelect,
} from "@logicflow/extension";
import Engine from "@logicflow/engine";
import "@logicflow/core/dist/style/index.css";
import Pattern from "../components/Pattern.vue";
import mountPanel from "../components/Panels/index.ts";
import CurvedEdge from "../custom/edges/curvedEdge.ts";
import FlowController from "../components/FlowController.vue";
import TimerStart from "../engine/nodes/start.ts";
import ManualTask from "../engine/nodes/task.ts";
import Gateway from "../engine/nodes/gateway.ts";
import End from "../engine/nodes/end.ts";

const logicFlowInstance = ref();
const flowControllerVisible = ref(false);
const engineInstance = ref();

provide("flowControllerVisible", flowControllerVisible);

LogicFlow.use(BPMNAdapter);
LogicFlow.use(BPMNElements);
LogicFlow.use(Group);
LogicFlow.use(SelectionSelect);

const engine = new Engine({
  context: {},
  debug: true,
});
engine.register({
  type: "bpmn:startEvent",
  model: TimerStart,
});
engine.register({
  type: "bpmn:userTask",
  model: ManualTask,
});
engine.register({
  type: "bpmn:exclusiveGateway",
  model: Gateway,
});
engine.register({
  type: "bpmn:endEvent",
  model: End,
});
engineInstance.value = engine;

const data = {
  nodes: [
    {
      id: "Gateway_76d07c3",
      type: "bpmn:exclusiveGateway",
      x: 439,
      y: 232,
      properties: {
        panels: ["variable"],
        variable: "imLucky",
        flag: "排他网关1",
      },
      rotate: -0.013697773372865818,
      zIndex: 1002,
      text: {
        x: 439,
        y: 272,
        value: "排他网关1",
      },
    },
    {
      id: "Event_bfba389",
      type: "bpmn:startEvent",
      x: 303,
      y: 232,
      properties: {
        panels: ["timerDefinition"],
        definitionType: "bpmn:timerEventDefinition",
        timerValue: 2,
        timerType: "timeDuration",
      },
      rotate: 0.015871682991790315,
      zIndex: 1004,
      text: {
        x: 303,
        y: 272,
        value: "开始",
      },
    },
    {
      id: "Activity_639a2d9",
      type: "bpmn:userTask",
      x: 660,
      y: 149,
      properties: {
        panels: ["multiInstance"],
        flag: "人工任务1",
      },
      zIndex: 1007,
      text: {
        x: 660,
        y: 149,
        value: "人工任务1",
      },
    },
    {
      id: "Activity_a29d1de",
      type: "bpmn:userTask",
      x: 660,
      y: 308,
      properties: {
        panels: ["multiInstance"],
        flag: "人工任务2",
      },
      rotate: -0.003220600781238425,
      zIndex: 1010,
      text: {
        x: 660,
        y: 308,
        value: "人工任务2",
      },
    },
    {
      id: "Event_6fced6f",
      type: "bpmn:endEvent",
      x: 839,
      y: 231,
      properties: {},
      zIndex: 1013,
      text: {
        x: 839,
        y: 271,
        value: "结束",
      },
    },
  ],
  edges: [
    {
      id: "Flow_6096f47",
      type: "bpmn:sequenceFlow",
      sourceNodeId: "Event_bfba389",
      targetNodeId: "Gateway_76d07c3",
      startPoint: {
        x: 321,
        y: 232.36,
        id: "Event_bfba389_1",
      },
      endPoint: {
        x: 414,
        y: 232.25,
        id: "Gateway_76d07c3_3",
      },
      properties: {
        isDefaultFlow: false,
      },
      zIndex: 1005,
      pointsList: [
        {
          x: 321,
          y: 232.36,
        },
        {
          x: 367.5,
          y: 232.36,
        },
        {
          x: 367.5,
          y: 232.25,
        },
        {
          x: 414,
          y: 232.25,
        },
      ],
    },
    {
      id: "Flow_9f50d54",
      type: "bpmn:sequenceFlow",
      sourceNodeId: "Gateway_76d07c3",
      targetNodeId: "Activity_639a2d9",
      text: {
        value: "yes",
      },
      startPoint: {
        x: 464,
        y: 231.75,
      },
      endPoint: {
        x: 610,
        y: 149,
      },
      properties: {
        isDefaultFlow: false,
        conditionExpression: 'imLucky === "yes"',
      },
      zIndex: 1008,
      pointsList: [
        {
          x: 464,
          y: 231.75,
        },
        {
          x: 494,
          y: 231.75,
        },
        {
          x: 494,
          y: 149,
        },
        {
          x: 610,
          y: 149,
        },
      ],
    },
    {
      id: "Flow_0e3575d",
      type: "bpmn:sequenceFlow",
      sourceNodeId: "Gateway_76d07c3",
      targetNodeId: "Activity_a29d1de",
      text: {
        value: "no",
      },
      startPoint: {
        x: 464,
        y: 231.75,
      },
      endPoint: {
        x: 610,
        y: 308,
        id: "Activity_a29d1de_3",
      },
      properties: {
        isDefaultFlow: false,
        conditionExpression: 'imLucky === "no"',
      },
      zIndex: 1011,
      pointsList: [
        {
          x: 464,
          y: 231.75,
        },
        {
          x: 494,
          y: 231.75,
        },
        {
          x: 494,
          y: 308,
        },
        {
          x: 610,
          y: 308,
        },
      ],
    },
    {
      id: "Flow_0b1b6d8",
      type: "bpmn:sequenceFlow",
      sourceNodeId: "Activity_639a2d9",
      targetNodeId: "Event_6fced6f",
      startPoint: {
        x: 710,
        y: 149,
      },
      endPoint: {
        x: 821,
        y: 231,
      },
      properties: {
        isDefaultFlow: false,
      },
      zIndex: 1014,
      pointsList: [
        {
          x: 710,
          y: 149,
        },
        {
          x: 791,
          y: 149,
        },
        {
          x: 791,
          y: 231,
        },
        {
          x: 821,
          y: 231,
        },
      ],
    },
    {
      id: "Flow_46e3a9b",
      type: "bpmn:sequenceFlow",
      sourceNodeId: "Activity_a29d1de",
      targetNodeId: "Event_6fced6f",
      startPoint: {
        x: 710,
        y: 308,
        id: "Activity_a29d1de_1",
      },
      endPoint: {
        x: 821,
        y: 231,
      },
      properties: {
        isDefaultFlow: false,
      },
      zIndex: 1015,
      pointsList: [
        {
          x: 710,
          y: 308,
        },
        {
          x: 791,
          y: 308,
        },
        {
          x: 791,
          y: 231,
        },
        {
          x: 821,
          y: 231,
        },
      ],
    },
  ],
};

onMounted(() => {
  const container = document.getElementById("main-graph");
  const { clientWidth: width, clientHeight: height } = document.body;
  const lf = new LogicFlow({
    container,
    width,
    height,
    stopScrollGraph: true,
    stopZoomGraph: true,
    // multipleSelectKey: "meta",
    overlapMode: 1,
    allowRotation: true,
    keyboard: {
      enabled: true,
    },
    snapline: true,
    // partial: true,
  });
  lf.register(CurvedEdge);
  mountPanel(lf);
  lf.renderRawData(data);

  logicFlowInstance.value = lf;
});
</script>
<style lang="less">
#app {
  margin: 0;
  padding: 0;
}
#main-graph {
  will-change: "transform";
}
</style>
