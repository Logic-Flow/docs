# 数据转换 Adapter

## LogicFlow 的数据格式

在 LogicFlow 中，一个流程图是由**节点**和**边**组成的。

- 对于一个节点，我们需要知道这个节点的 **id**、[类型](zh/guide/extension/adapter#类型)、**位置**、**文本**、[properties](zh/guide/extension/adapter#properties)
- 对于一个边，我们则需要知道这个边的 **id**、[类型](zh/guide/extension/adapter#类型)、起始节点 id（**sourceNodeId**）、目标节点 id（**targetNodeId**）、**文本**、[properties](zh/guide/extension/adapter#properties) 以及边的起点位置（**startPoint**），边的终点位置（**endPoint**）。

  - 折线的额外数据`pointsList`，因为折线是可以被用户手动调整的，所以增加此字段用于记录这个折线的具体路径。

### 类型

在 LogicFlow 中，一个节点宽、高、颜色等表示外观的信息都不会保存到数据中，而是统一使用这个节点的类型来表示。例如我们通过 LogicFlow 的自定义机制定义一个节点为“开始节点(startNode)”，那么当前的这个项目中，就应该是知道这个 type 为 startNode 的节点外观是什么样的。

### properties

properties 是 LogicFlow 预留给开发者的一个空对象，开发者可以基于这个属性来绑定任何数据。上面的类型中提到，一个节点具体外观是通过类型来确定。但是当在项目中，需要基于某些业务条件，将这个节点外观进行一些调整时，我们可以将这些业务条件放到 properties 中，然后在自定义节点的时候，通过`this.props.model`方法拿到 properties，然后基于 proerties 中的内容重新设置这个节点的样式。

### 使用方法

```js
lf.render({
  nodes: [
    {
      id: "1",
      type: "rect",
      x: 100,
      y: 100,
    },
    {
      id: "2",
      type: "circle",
      x: 300,
      y: 200,
    },
  ],
  edges: [
    {
      id: "edge1",
      type: "polyline",
      sourceNodeId: "1",
      targetNodeId: "2",
      startPoint: { x: 150, y: 100 },
      endPoint: { x: 250, y: 200 },
      pointList: [
        { x: 150, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 250, y: 200 },
      ],
    },
  ],
});
```

## 什么是数据转换工具

在某些情况下，LogicFlow 生成的数据格式可能不满足业务需要的格式。比如后端需要的数据格式是 bpmn-js 生成的格式，那么可以使用数据转换工具，将 LogicFlow 生成的数据转换为 bpmn-js 生成的数据。

## 如何自定义数据转换工具

自定义数据转换工具本质上是将用户传入的数据，通过一个`lf.adapterIn`方法，将其转换为 LogicFlow 可以识别的格式。然后在生成数据的时候，又通过`lf.adapterOut`方法将 LogicFlow 的数据转换为用户传入的数据。所以自定义数据转换工具我们只需要重新覆盖这两个方法即可。

```js
const lf = new LogicFlow({
  container: document.querySelector("#app"),
});
lf.adapterIn = function (userData) {
  // 这里把userData转换为LogicFlow支持的格式
  return logicFlowData;
};
lf.adapterOut = function (logicFlowData) {
  // 这里把LogicFlow生成的数据转换为用户需要的格式。
  return userData;
};
// 如果需要额外的参数，你也可以这样定义
lf.adapterOut = function (logicFlowData, params, ...rest) {
  console.log(params, ...rest);
  return userData;
};
```

## 使用内置的数据转换工具

LogicFlow 内置通用的 bpmn-js 兼容的转换工具。可以支持将 LogicFlow 上绘制的图在 bpmn-js 上显示，也支持 bpmn-js 上绘制的图在 LogicFlow 上显示。[LogicFlow2Bpmn](https://github.com/didi/LogicFlow/tree/master/packages/extension/src/bpmn-adapter)

### bpmnAdapter

```ts
import LogicFlow from "@logicflow/core";
import { BpmnAdapter } from "@logicflow/extension";

// 注册插件
LogicFlow.use(BpmnAdapter);

// 实例化 LogicFlow
const lf = new LogicFlow();
lf.render();

// 通过 getGraphData 来获取转换后的数据
// 1.2.5版本以后新增了getGraphData的入参，来保证某些adapterOut的正常执行，例如这里的bpmn-adapter的adapterOut有一个可选的入参数"retainedFields"
// 这意味着出现在这个数组里的字段当它的值是数组或是对象时不会被视为一个节点而是一个属性。我们定义了一些默认的属性字段，如"properties", "startPoint","endPoint", "pointsList"，显然这些字段并不足以满足数据处理的要求
// 所以为了保证导出数据中某些节点属性被正常处理，请按需传入属性保留字段的数组。e.g. lf.getGraphData(['attribute-a', 'attribute-b'])
lf.getGraphData();
```

### 转换结果示例

<a href="https://docs.logic-flow.cn/demo/dist/examples/#/extension/adapter?from=doc" target="_blank"> 去 CodeSandbox 查看示例</a>
