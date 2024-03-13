# BpmnElement

> BPMN is one of the better known modeling language standards for workflow. LogicFlow implements a BPMN extension that allows you to use LogicFlow directly to draw BPMN 2.0 compliant processes, and its exported data can be run on the Activiti process engine.

LogicFlow provides [custom nodes](en/guide/basic/node) and [custom edges](en/guide/basic/edge) to implement nodes and edges that meet the BPMN2.0 specification. Then use [data adapter](en/guide/extension/adapter) to convert the generated data into the format Activiti needs.

?> **Note** In real projects, we recommend developers to fully customize the project's nodes and data adapter instead of using the bpmnElement and bpmnAdapter plugins we provide. Our built-in plugins only include basic presentation functions, and do not support more bpmn elements and custom attributes. You can refer to our bpmnElement and bpmnAdapter plugins and reimplement a set of nodes and data adapter plugins locally to meet your own product requirements. One of the reasons we developed LogicFlow was to have the front-end reflect all the business logic in the code, so that the front-end R&D would be closer to the business, instead of leaving the business logic to third-party libraries.

## Getting started

```html
<script src="/logic-flow.js"></script>
<script src="/lib/BpmnElement.js"></script>
<script src="/lib/BpmnAdapter.js"></script>
<script>
  LogicFlow.use(BpmnElement);
  LogicFlow.use(BpmnAdapter);
</script>
```

<example href="/examples/#/extension/bpmn-elements" :height="360"></example>

## Converting to XML

`BpmnAdapter` supports interconversion between bpmnjson and LogicFlow data. If you want LogicFlow data to be interconverted with XML, you can use `BpmnXmlAdapter`.

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
      text: "Start",
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
      text: "End",
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
      text: "User Task",
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
      text: "service Task",
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

For a complete BPMN example, please go to [example](en/usage/bpmn) to experience it.
