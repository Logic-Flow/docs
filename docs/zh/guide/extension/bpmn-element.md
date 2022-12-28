# BPMN 元素 BpmnElement

> BPMN 是目前较为著名的 workflow 的建模语言标准之一。LogicFlow 实现了 BPMN 扩展，可以直接使用 LogicFlow 来绘制兼容 BPMN2.0 规范的流程，并且其导出的数据可以在 Activity 流程引擎上运行。

LogicFlow 提供了[自定义节点](zh/guide/basic/node)和[自定义边](zh/guide/basic/edge), 可以实现满足 BPMN2.0 规范的节点和边。然后在使用[数据转换](zh/guide/extension/adapter)将生成的数据转换为 Activity 需要的格式。

?> **注意**在实际项目中，我们推荐开发者完全自定义项目的节点和数据转换，而不是使用我们提供的 bpmnElement 和 bpmnAdapter 插件。我们内置的插件只包括了很基础的演示功能，不支持更多的 bpmn 元素和自定义属性。大家可以参考我们的 bpmnElement 和 bpmnAdapter 插件，自己在本地重新实现一套符合你们自己产品需求的节点和数据格式转换插件。我们开发 LogicFlow 的初衷之一就是希望前端能在代码中体现所有的业务逻辑，这样让前端研发更贴近的业务，而不是把业务逻辑交给第三方库。

## 使用方式

```html
<script src="/logic-flow.js"></script>
<script src="/lib/BpmnElement.js"></script>
<script src="/lib/BpmnAdapter.js"></script>
<script>
  LogicFlow.use(BpmnElement);
  LogicFlow.use(BpmnAdapter);
</script>
```
<iframe src="https://docs.logic-flow.cn/demo/dist/examples/#/extension/bpmn-elements?from=doc"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
></iframe>

## 转换为 XML

`BpmnAdapter` 支持 bpmnjson 和 LogicFlow data 之间的相互转换，如果希望 LogicFlow data 与 XML 互相转换，可以使用`BpmnXmlAdapter`。

```html
<script src="/logic-flow.js"></script>
<script src="/lib/BpmnElement.js"></script>
<script src="/lib/BpmnXmlAdapter.js"></script>
<script>
  LogicFlow.use(BpmnElement);
  LogicFlow.use(BpmnXmlAdapter);
</script>
```

## StartEvent

```js
const data = {
  nodes: [
    {
      id: 10,
      type: "bpmn:startEvent",
      x: 200,
      y: 80,
      text: "开始",
    },
  ],
};
```

## EndEvent

```js
const data = {
  nodes: [
    {
      id: 10,
      type: "bpmn:endEvent",
      x: 200,
      y: 80,
      text: "结束",
    },
  ],
};
```

## UserTask

```js
const data = {
  nodes: [
    {
      id: 10,
      type: "bpmn:userTask",
      x: 200,
      y: 80,
      text: "用户任务",
    },
  ],
};
```

## ServiceTask

```js
const data = {
  nodes: [
    {
      id: 10,
      type: "bpmn:serviceTask",
      x: 200,
      y: 80,
      text: "系统任务",
    },
  ],
};
```

## ExclusiveGateway

```js
const data = {
  nodes: [
    {
      id: 10,
      type: "bpmn:exclusiveGateway",
      x: 200,
      y: 80,
    },
  ],
};
```

完整的 BPMN 案例工具请到[示例](https://docs.logic-flow.cn/examples/#/gallery)中体验。
