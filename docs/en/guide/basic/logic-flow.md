# LogicFlow Instance

## Create an instance

Each process design interface is an instance of LogicFlow. In order to unify the terminology, we will write the instance of `LogicFlow` as `lf` later.

```html
<style>
  #container {
    width: 1000px;
    height: 500px;
  }
</style>
<div id="container"></div>
```

```js
const lf = new LogicFlow({
  container: document.querySelector("#container"),
});
```

When creating an instance, we need to provide the configuration items to initialize the LogicFlow instance. LogicFlow supports a very rich set of initialization configuration items, but only the parameter `container`, the DOM node that is mounted when the LogicFlow canvas is initialized, is necessary. For complete configuration items see [LogicFlow API](en/api/logicFlowApi#constructor)。

## Graph Data for LogicFlow

In LogicFlow, we think of a flowchart as a graph of nodes and connected lines. So we use the following data structure to represent the graph data of LogicFlow.

```js
const graphData = {
  nodes: [
    {
      id: "node_id_1",
      type: "rect",
      x: 100,
      y: 100,
      text: { x: 100, y: 100, value: "节点1" },
      properties: {},
    },
    {
      id: "node_id_2",
      type: "circle",
      x: 200,
      y: 300,
      text: { x: 300, y: 300, value: "节点2" },
      properties: {},
    },
  ],
  edges: [
    {
      id: "edge_id",
      type: "polyline",
      sourceNodeId: "node_id_1",
      targetNodeId: "node_id_2",
      text: { x: 139, y: 200, value: "连线" },
      startPoint: { x: 100, y: 140 },
      endPoint: { x: 200, y: 250 },
      pointsList: [
        { x: 100, y: 140 },
        { x: 100, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 250 },
      ],
      properties: {},
    },
  ],
};
```

> **Why does the node text need to have coordinates, can't we just use the coordinates of the node?**
>
> `text` can use string type data. At this time, if it is the text on the node, we will automatically use the node coordinates as the text coordinates. If it is text on the line, we will calculate a suitable coordinate as the text coordinate based on different line types.
> In some application scenarios, text can be dragged around, so LogicFlow exports text data with coordinates.

> **Why are the startPoint and endPoint data duplicated with the pointsList?**
>
> Currently, LogicFlow has three built-in base line types, `line`, `polyline`, and `bezier`, all of which contain `startPoint` and `endPoint` data. But the data exported from `line` will not contain `pointsList`. For `polyline`, `pointsList` represents all the points of the polyline. For `bezier`, `pointsList` means `['starting point', 'first control point', 'second control point', 'end point']`.

> **What are properties used for?**  
> properties are data that LogicFlow reserves for use in specific business scenarios.
>
> For example: In the approval flow scenario, we define a certain node, which is green if the node passes, and red if it fails. Then the data description of the node can be:
>
> ```js
> {
>   type: 'apply',
>   properties: {
>     isPass: true
>   }
> }
> ```
>
> PS: For how to control the style of a node based on properties, see Customizing Nodes later.

> **What is the meaning of type?**
>
> type indicates the type of the node or line. The type can be not only `rect`, `polyline`, which is the built-in base type of LogicFlow, but also a user-defined type based on the base type.

### Render graph data to the canvas

```js
lf.render(graphData);
```
