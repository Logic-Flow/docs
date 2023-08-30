<template>
  <div id="pattern">
    <div className="pattern">
      <SvgIcon iconClass="bpmn-icon-group" @mousedown.native="openSelection" />
      <div>选区</div>
      <SvgIcon
        iconClass="bpmn-icon-start-event-none"
        @mousedown.native="addStartNode"
      />
      <div>开始</div>
      <SvgIcon
        iconClass="bpmn-icon-start-event-timer"
        @mousedown.native="addTimerStartNode"
      />
      <div>时间开始</div>
      <SvgIcon
        iconClass="bpmn-icon-intermediate-event-catch-timer"
        @mousedown.native="addTimerCatchNode"
      ></SvgIcon>
      <div>时间捕获</div>
      <SvgIcon
        iconClass="bpmn-icon-intermediate-event-catch-timer"
        @mousedown.native="
          addNode('bpmn:boundaryEvent', {
            text: '时间边界',
            properties: {
              definitionType: 'bpmn:timerEventDefinition',
              panels: ['timerDefinition'],
            },
          })
        "
      ></SvgIcon>
      <div>时间边界</div>
      <SvgIcon
        iconClass="bpmn-icon-start-event-message"
        @mousedown.native="addMessageNode"
      />
      <div>消息开始时间</div>
      <SvgIcon
        iconClass="bpmn-icon-end-event-none"
        @mousedown.native="addEndNode"
      />

      <div>结束</div>
      <SvgIcon
        iconClass="bpmn-icon-gateway-or"
        @mousedown.native="
          addNode('bpmn:inclusiveGateway', { text: '包容网关' })
        "
      />
      <div>包容网关</div>
      <SvgIcon
        iconClass="bpmn-icon-gateway-parallel"
        @mousedown.native="
          addNode('bpmn:parallelGateway', { text: '并行网关' })
        "
      />
      <div>并行网关</div>
      <SvgIcon
        iconClass="bpmn-icon-gateway-xor"
        @mousedown.native="
          addNode('bpmn:exclusiveGateway', { text: '排他网关' })
        "
      />
      <div>排他网关</div>

      <SvgIcon
        iconClass="bpmn-icon-service-task"
        @mousedown.native="
          addNode('bpmn:serviceTask', {
            text: '服务任务',
            properties: {
              panels: ['multiInstance'],
            },
          })
        "
      />
      <div>服务任务</div>
      <SvgIcon
        iconClass="bpmn-icon-user-task"
        @mousedown.native="
          addNode('bpmn:userTask', {
            text: '人工任务',
            properties: {
              panels: ['multiInstance'],
            },
          })
        "
      />
      <div>人工任务</div>
      <!-- <SvgIcon
        iconClass="bpmn-icon-participant"
        @mousedown.native="addNode('bpmn:collaboration', { text: '泳道' })"
      />
      <div>泳道</div> -->
      <SvgIcon
        iconClass="bpmn-icon-subprocess-expanded"
        @mousedown.native="addNode('bpmn:subProcess', '')"
      />
      <div>subprocess</div>
      <button @click="adapterOut" style="margin-top: 10px">导出</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import SvgIcon from "./SvgIcon.vue";
const props = defineProps({
  lf: Object,
});
const { lf } = props;

function adapterOut() {
  // const graphData: any = {
  //   nodes: [
  //     {
  //       id: 'Event_0rqndvp',
  //       type: 'bpmn:startEvent',
  //       x: 350,
  //       y: 110,
  //       properties: {},
  //       text: {
  //         x: 350,
  //         y: 150,
  //         value: '开始',
  //       },
  //     },
  //     {
  //       id: '121213b3-8fad-4b41-bb1e-a7672e9bfc07',
  //       type: 'bpmn:subProcess',
  //       x: 640,
  //       y: 530,
  //       properties: {},
  //       children: [
  //         'Activity_383p4ds',
  //         'Event_3nm6g45',
  //         'Gateway_10p8112',
  //         'Gateway_36vu52v',
  //       ],
  //     },
  //     {
  //       id: 'Event_2ffv4vc',
  //       type: 'bpmn:boundaryEvent',
  //       x: 220,
  //       y: 570,
  //       properties: {
  //         attachedToRef: 'Activity_05avavm',
  //         definitionType: 'bpmn:timerEventDefinition',
  //         definitionId: 'bpmn:timerEventDefinitionEventDefinition_3u73cjd',
  //         isBoundaryEvent: true,
  //         timerType: '',
  //         timerValue: '',
  //       },
  //       text: {
  //         x: 220,
  //         y: 610,
  //         value: '时间边界',
  //       },
  //     },
  //     {
  //       id: 'Event_2o2l6ht',
  //       type: 'bpmn:boundaryEvent',
  //       x: 310,
  //       y: 320,
  //       properties: {
  //         attachedToRef: 'Activity_28r64ai',
  //         definitionType: 'bpmn:timerEventDefinition',
  //         timerValue: 'PT15S',
  //         timerType: 'timeDuration',
  //         definitionId: 'bpmn:timerEventDefinitionEventDefinition_0t3ai3e',
  //         isBoundaryEvent: true,
  //       },
  //       text: {
  //         x: 310,
  //         y: 360,
  //         value: '时间边界',
  //       },
  //     },
  //     {
  //       id: 'Event_3nm6g45',
  //       type: 'bpmn:boundaryEvent',
  //       x: 710,
  //       y: 530,
  //       properties: {
  //         attachedToRef: 'Activity_383p4ds',
  //         definitionType: 'bpmn:timerEventDefinition',
  //         timerValue: 'R5/PT10S',
  //         timerType: 'timeCycle',
  //         definitionId: 'bpmn:timerEventDefinitionEventDefinition_0h2ic1p',
  //         isBoundaryEvent: true,
  //       },
  //       text: {
  //         x: 710,
  //         y: 570,
  //         value: '时间边界',
  //       },
  //     },
  //     {
  //       id: 'Gateway_0ke5iid',
  //       type: 'bpmn:parallelGateway',
  //       x: 500,
  //       y: 140,
  //       properties: {},
  //       text: {
  //         x: 500,
  //         y: 180,
  //         value: '并行网关',
  //       },
  //     },
  //     {
  //       id: 'Gateway_10p8112',
  //       type: 'bpmn:parallelGateway',
  //       x: 490,
  //       y: 530,
  //       properties: {
  //         expr: '${A > B}',
  //       },
  //       text: {
  //         x: 490,
  //         y: 570,
  //         value: '并行网关',
  //       },
  //     },
  //     {
  //       id: 'Activity_05avavm',
  //       type: 'bpmn:userTask',
  //       x: 270,
  //       y: 540,
  //       properties: {
  //         boundaryEvents: ['Event_2ffv4vc'],
  //       },
  //       text: {
  //         x: 270,
  //         y: 540,
  //         value: '人工任务',
  //       },
  //     },
  //     {
  //       id: 'Activity_28r64ai',
  //       type: 'bpmn:userTask',
  //       x: 370,
  //       y: 280,
  //       properties: {
  //         boundaryEvents: ['Event_2o2l6ht'],
  //       },
  //       text: {
  //         x: 370,
  //         y: 280,
  //         value: '人工任务',
  //       },
  //     },
  //     {
  //       id: 'Event_3t9u7bs',
  //       type: 'bpmn:endEvent',
  //       x: 220,
  //       y: 210,
  //       properties: {},
  //       text: {
  //         x: 220,
  //         y: 250,
  //         value: '结束',
  //       },
  //     },
  //     {
  //       id: 'Activity_383p4ds',
  //       type: 'bpmn:serviceTask',
  //       x: 760,
  //       y: 530,
  //       properties: {
  //         boundaryEvents: ['Event_3nm6g45'],
  //       },
  //       text: {
  //         x: 760,
  //         y: 530,
  //         value: '服务任务',
  //       },
  //     },
  //     {
  //       id: 'Gateway_36vu52v',
  //       type: 'bpmn:inclusiveGateway',
  //       x: 640,
  //       y: 580,
  //       properties: {},
  //       text: {
  //         x: 640,
  //         y: 620,
  //         value: '包容网关',
  //       },
  //     },
  //   ],
  //   edges: [
  //     {
  //       id: 'Flow_19ep598',
  //       type: 'bpmn:sequenceFlow',
  //       pointsList: [
  //         {
  //           x: 475,
  //           y: 140,
  //         },
  //         {
  //           x: 445,
  //           y: 140,
  //         },
  //         {
  //           x: 445,
  //           y: 210,
  //         },
  //         {
  //           x: 238,
  //           y: 210,
  //         },
  //       ],
  //       sourceNodeId: 'Gateway_0ke5iid',
  //       targetNodeId: 'Event_3t9u7bs',
  //       properties: {},
  //     },
  //     {
  //       id: 'Flow_1cju7v0',
  //       type: 'bpmn:sequenceFlow',
  //       pointsList: [
  //         {
  //           x: 500,
  //           y: 165,
  //         },
  //         {
  //           x: 500,
  //           y: 195,
  //         },
  //         {
  //           x: 640,
  //           y: 195,
  //         },
  //         {
  //           x: 640,
  //           y: 430,
  //         },
  //       ],
  //       sourceNodeId: 'Gateway_0ke5iid',
  //       targetNodeId: '121213b3-8fad-4b41-bb1e-a7672e9bfc07',
  //       properties: {},
  //     },
  //     {
  //       id: 'Flow_0phuver',
  //       type: 'bpmn:sequenceFlow',
  //       pointsList: [
  //         {
  //           x: 220,
  //           y: 540,
  //         },
  //         {
  //           x: 190,
  //           y: 540,
  //         },
  //         {
  //           x: 190,
  //           y: 410,
  //         },
  //         {
  //           x: 450,
  //           y: 410,
  //         },
  //         {
  //           x: 450,
  //           y: 280,
  //         },
  //         {
  //           x: 420,
  //           y: 280,
  //         },
  //       ],
  //       sourceNodeId: 'Activity_05avavm',
  //       targetNodeId: 'Activity_28r64ai',
  //       properties: {},
  //     },
  //     {
  //       id: 'Flow_3ql1931',
  //       type: 'bpmn:sequenceFlow',
  //       pointsList: [
  //         {
  //           x: 440,
  //           y: 530,
  //         },
  //         {
  //           x: 380,
  //           y: 530,
  //         },
  //         {
  //           x: 380,
  //           y: 540,
  //         },
  //         {
  //           x: 320,
  //           y: 540,
  //         },
  //       ],
  //       sourceNodeId: '121213b3-8fad-4b41-bb1e-a7672e9bfc07',
  //       targetNodeId: 'Activity_05avavm',
  //       properties: {},
  //     },
  //     {
  //       id: 'Flow_39cdevi',
  //       type: 'bpmn:sequenceFlow',
  //       pointsList: [
  //         {
  //           x: 515,
  //           y: 530,
  //         },
  //         {
  //           x: 545,
  //           y: 530,
  //         },
  //         {
  //           x: 545,
  //           y: 460,
  //         },
  //         {
  //           x: 760,
  //           y: 460,
  //         },
  //         {
  //           x: 760,
  //           y: 490,
  //         },
  //       ],
  //       sourceNodeId: 'Gateway_10p8112',
  //       targetNodeId: 'Activity_383p4ds',
  //       properties: {
  //         expressionType: 'cdata',
  //         condition: 'foo &gt; bar',
  //       },
  //     },
  //     {
  //       id: 'Flow_1mpq63n',
  //       type: 'bpmn:sequenceFlow',
  //       pointsList: [
  //         {
  //           x: 515,
  //           y: 530,
  //         },
  //         {
  //           x: 565,
  //           y: 530,
  //         },
  //         {
  //           x: 565,
  //           y: 580,
  //         },
  //         {
  //           x: 615,
  //           y: 580,
  //         },
  //       ],
  //       sourceNodeId: 'Gateway_10p8112',
  //       targetNodeId: 'Gateway_36vu52v',
  //       properties: {
  //         isDefaultFlow: true,
  //       },
  //     },
  //   ],
  // };
  // console.log(lf!.adapterOut(graphData));
  // console.log(lf!.graphModel.nodes);
  console.log(lf!.getGraphRawData());
  console.log(lf!.adapterOut(lf!.getGraphRawData()));
}

function addNode(type: string, { text, properties }: any) {
  lf!.dnd.startDrag({
    type,
    text: text,
    properties,
  });
}
function addStartNode() {
  lf!.dnd.startDrag({
    type: "bpmn:startEvent",
    text: "开始",
  });
}
function addTimerStartNode() {
  lf!.dnd.startDrag({
    type: "bpmn:startEvent",
    text: "时间开始",
    properties: {
      definitionType: "bpmn:timerEventDefinition",
      panels: ["timerDefinition"],
    },
  });
}
function addTimerCatchNode() {
  lf!.dnd.startDrag({
    type: "bpmn:intermediateCatchEvent",
    text: "时间捕获",
    properties: {
      definitionType: "bpmn:timerEventDefinition",
      panels: ["timerDefinition"],
    },
  });
}

function addMessageNode() {
  lf!.dnd.startDrag({
    type: "bpmn:startEvent",
    text: "消息开始事件",
    properties: {
      definitionType: "bpmn:messageEventDefinition",
    },
  });
}

function addEndNode() {
  lf!.dnd.startDrag({
    type: "bpmn:endEvent",
    text: "结束",
  });
}

function openSelection() {
  console.log("object");
  lf!.updateEditConfig({
    stopMoveGraph: true,
  });
}

lf &&
  lf!.on("selection:selected", () => {
    lf!.updateEditConfig({
      stopMoveGraph: false,
    });
  });
</script>

<style lang="css">
svg {
  margin-top: 10px;
}

.pattern {
  position: absolute;
  left: 10px;
  top: 33px;
  width: 60px;
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
}
</style>
