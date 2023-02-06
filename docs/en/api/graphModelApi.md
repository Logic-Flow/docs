# graphModel

GraphModel is the model corresponding to the entire canvas in LogicFlow.。

Most of the methods on LogicFlow instances are simple wrappers around the graphModel.

The graphModel can be obtained in several ways:

- directly from the lf attribute. `lf.graphModel`
- Get it from the constructor when customizing `model`, or from `this` in the method.

```js
class CustomModel extends RectNodeModel {
  getNodeStyle() {
    const graphModel = this.graphModel;
  }
}
```

- Get from `props` when customizing `view`.

```js
class CustomNode extends RectNode {
  getShape() {
    const { model, graphModel } = this.props;
    // ...
  }
}
```

!> **Note**  
All properties on graphModel are read-only. If you want to modify them, please use the corresponding methods provided.

## width

`Property`

LogicFlow Canvas Width

## height

`Property`

LogicFlow Canvas Height

## theme

`Property`

Theme configuration

[Detailed API](en/api/themeApi)

## animation

`Property`

Animation state configuration, whether the corresponding animation has been opened

## eventCenter

`Property`

Event hub inside logicflow. Events can be thrown externally through this object.

Example

```ts
class UserTaskModel extends RectNodeModel {
  setAttributes() {
    this.menu = [
      {
        text: "details",
        callback: (res) => {
          this.graphModel.eventCenter.emit("user:detail", res);
        },
      },
    ];
  }
}
// listening
lf.on("user:detail", (res) => {});
```

## topElement

`Property`

The element at the top of the current canvas.
This element exists only when the stacking mode is the default mode.
Used to restore the initial height of the previous top element in default mode.

## nodeMoveRules

`Property`
Node movement rule judgment. When a node is moved, all rules in this array are judged。

## edgeType

`Property`

The default edge type used when creating edges by operations on the graph.

## nodes

`Property`

All node objects of the canvas

## edges

`Property`

All edge objects of the canvas

## overlapMode

`Property`

Stacking mode when elements overlap

- value `0`: default mode. When nodes and edges are selected, they will be displayed at the top. When unchecked, the element will revert to its previous hierarchy.
- value `1`: incremental mode. When nodes and edges are selected, they will be displayed at the top. When unchecked, the element will keep the hierarchy.

## background

`Property`

Canvas background configuration

## transformModel

`Property`

The matrix model of the current canvas translation and scaling.

[Detailed API](en/api/transformModelApi)

## editConfigModel

`Property`

Page editor basic configuration object, see [editConfigApi](en/api/editConfigModelApi) for details.

## gridSize

`Property`

Grid size

## partial

`Property`

Whether to enable partial rendering. When the number of page elements is too large, turning on local rendering will improve the page rendering performance.

## nodesMap

`Property`

A map of the composition of all nodes of the canvas

## edgesMap

`Property`

A map of the composition of all edges of the canvas

## sortElements

`Property`

The elements are sorted by zIndex, which controls who is on top when the elements are stacked.

## textEditElement

`Property`

The currently edited element

## selectElements

`Property`

All selected elements of the current canvas

## getAreaElement

`Method`

Get all elements in the specified area

Parameters:

| Name              | Type       | Default | Description                       |
| ----------------- | ---------- | ------ | -------------------------- |
| leftTopPoint      | PointTuple | -     | Dot in the upper left of the area             |
| rightBottomPoint  | PointTuple | -     | The dot in the lower right corner of the area             |
| wholeEdge         | boolean    | -     | Does the entire edge have to be inside the region   |
| wholeNode         | boolean    | -     | Does the entire node have to be inside the region  |
| ignoreHideElement | boolean    | -     | Whether to ignore hidden nodes         |

```js
graphModel.getAreaElement([100, 100], [800, 800]);
```

## getModel

`Method`

Get the Model constructor for the specified Type

Parameters:

| Name | Type   | Default | Description |
| ---- | ------ | ------ | ---- |
| type | string | -     | type |

Return value:

[NodeModel](en/api/baseNodeModelApi) or [EdgeModel](en/api/baseEdgeModelApi)

```js
graphModel.getModel("rect");
```

## getNodeModelById

`Method`

Get the Mdoel constructor for a node of the specified type。

Parameters:

| Name | Type   | Default | Description |
| ---- | ------ | ------ | ---- |
| type | string | -     | Type |

Return value

[NodeModel](en/api/baseNodeModelApi)

```js
graphModel.getNodeModelById("node_1");
```

## getPointByClient

`Method`

Get the coordinates of the mouse click position on the canvas.

> Since the flowchart can be located anywhere on the page, when the internal event needs to get the trigger event, its position relative to the top left corner of the canvas. The position of the event trigger needs to be subtracted from the position of the canvas relative to the client.

Parameters:

| Name  | Type     | Default | Description      |
| ----- | -------- | ------ | --------- |
| point | Position | -     | HTML coordinate |

Return value：

| Name                  | Type     | Default | Description                                            |
| --------------------- | -------- | ------ | ----------------------------------------------- |
| domOverlayPosition    | Position | -     | HTML layer coordinate, which are generally used when controlling the position of components     |
| canvasOverlayPosition | Position | -     | Canvas layer coordinate, generally the coordinates of nodes and edges are the coordinates of this layer |

Why do we need this method and why does the same mouse click produce two different coordinates for the same location?

Because there is scaling and panning of the canvas. When the canvas is moved, it appears visually that the position of the elements on the canvas has changed, but at the data level, the position of the nodes and edges on the canvas is unchanged.On the other hand, for example, there is a node in the middle of a canvas of width and height 1000px \* 1000px, but the position of this node is probably `{x: -999,y: -999}`, because it is panned over. But when double-clicking this node, we need to display a text input box at the node position, because the input box is in the `domOverlay` layer, which does not have scaling and panning like `CanvasOverlay`, and its width and height are the same as the canvas width and height. So the coordinates of this text input box should be `{x: 500, y: 500}`.

Let's look again at why we need this Method.

Suppose this canvas is 100 from the top of the browser and 100 from the left. Then when the user clicks on the center of the canvas, js listens to the click function and gets the position as `{x: 600, y: 600}`, and when this Method is called, we get `canvasOverlayPosition` as `{x: -999. y: -999}` and `domOverlayPosition` as `{x: 500, y: 500}`. Developers can then do what they need to do based on these two coordinates. For example, displaying a menu at the `domOverlayPosition` position or something like that.
```js
graphModel.getPointByClient({ x: 200, y: 200 });
```

## isElementInArea

`Method`

Determines if an element is inside the specified rectangle area.

Parameters:

| Name      | Type                   | Default | Description                         |
| --------- | ---------------------- | ------ | ---------------------------- |
| element   | NodeModel 或 EdgeModel | -     | The model of the element                 |
| lt        | PointTuple             | -     | Top left point                  |
| rb        | PointTuple             | -     | Lower right corner point                      |
| wholeEdge | boolean                | true   | Does the edge want all nodes to be in the region |

Return value

boolean

```js
const node = {
  type: "rect",
  x: 300,
  y: 300,
};
graphModel.isElementInArea(node, [200, 200], [400, 400]);
```

## graphDataToModel

`Method`

Resetting the elements of the entire canvas with new data

Note: it will clear all existing nodes and edges on the canvas.

Parameters:

| Name      | Type            | Default | Description         |
| --------- | --------------- | ------ | ------------ |
| graphData | GraphConfigData | -     | Basic data of the graph |

```js
const graphData = {
  nodes: [
    {
      id: "node_id_1",
      type: "rect",
      x: 100,
      y: 100,
      text: { x: 100, y: 100, value: "node1" },
      properties: {},
    },
    {
      id: "node_id_2",
      type: "circle",
      x: 200,
      y: 300,
      text: { x: 200, y: 300, value: "node2" },
      properties: {},
    },
  ],
  edges: [
    {
      id: "edge_id",
      type: "polyline",
      sourceNodeId: "node_id_1",
      targetNodeId: "node_id_2",
      text: { x: 139, y: 200, value: "egde" },
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

graphModel.graphDataToModel(graphData);
```

## modelToGraphData

`Method`

Get the raw data corresponding to the graphModel

Return value： GraphConfigData

```js
cosnt graphData = graphModel.modelToGraphData();
console.log(graphData)
```

## getEdgeModelById

`Method`

Get the egde model

Parameters:

| Name   | Type   | Default | Description  |
| ------ | ------ | ------ | ----- |
| edgeId | string | -     | egde id |

Return value

[EdgeModel](en/api/baseEdgeModelApi)

```js
cosnt edgeModel = graphModel.getEdgeModelById('edge_id');
console.log(edgeModel)
```

## getElement

`Method`

Get Model of the node or edge

Parameters:

| Name | Type   | Default | Description              |
| ---- | ------ | ------ | ----------------- |
| id   | string | -     | edge id  or node id |

Return value

[EdgeModel](en/api/baseEdgeModelApi) or [NodeModel](en/api/baseNodeModelApi)

```js
cosnt edgeModel = graphModel.getElement('edge_id');
console.log(edgeModel)
```

## getNodeEdges

`Method`

Get all the edges on the specified node

Parameters:

| Name   | Type   | Default | Description    |
| ------ | ------ | ------ | ------- |
| nodeId | string | -     | node id |

Return value

[EdgeModel](en/api/baseEdgeModelApi)

```js
cosnt edgeModels = graphModel.getNodeEdges('node_id_1');
console.log(edgeModels)
```

## getSelectElements

`Method`

Get data of the selected element

Parameters:

| Name          | Type    | Default | Description                                                                                                               |
| ------------- | ------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| isIgnoreCheck | boolean | true   | Whether to include edges where sourceNode and targetNode are not selected, default is include. This type of edge cannot be included when copying, because overhanging edges are not allowed when copying. |

```js
cosnt elements = graphModel.getSelectElements(true);
console.log(elements)
```

## updateAttributes

`Method`

Modify the property in the corresponding element model

!> **Warning**  
Note: Use this method with caution, unless you have sufficient knowledge of logicflow internals.  
In most cases, use methods such as setProperties, updateText, changeNodeId, etc.  
For example, if you use this method to modify the id of a node, the sourceNodeId of the edge connected to the node will not be found.

Parameters:

| Name       | Type   | Default | Description     |
| ---------- | ------ | ------ | -------- |
| id         | string | -     | node id  |
| attributes | object | -     | Element properties |

```js
graphModel.updateAttributes("node_id_1", {
  radius: 4,
});
```

## changeNodeId

Modify the id of the node, if no new id is passed, one will be created internally automatically.

Parameters:

| Name  | Type   | Default | Description    |
| ----- | ------ | ------ | ------- |
| oldId | string | -     | node id |
| newId | string | -     | new node id |

```js
graphModel.changeNodeId("node_id_1", "node_id_2");
```

## changeEdgeId
Modify the id of the edge, if no new id is passed, one will be created internally automatically.

Parameters:

| Name  | Type   | Default | Description    |
| ----- | ------ | ------ | ------- |
| oldId | string | -     | egde id |
| newId | string | -     | new egde id |

```js
graphModel.changeEdgeId("edge_id_1", "edge_id_2");
```

## toFront

`Method`

Place the specified node or edge in front.

If the stacking mode is the default, the original top element is restored to its original level.

If the stacking mode is incremental, the zIndex of the element to be specified is set to the current maximum zIndex + 1.

Parameters:

| Name | Type   | Default | Description            |
| ---- | ------ | ------ | --------------- |
| id   | string | -     | node id or edge id |

```js
graphModel.toFront("edge_id_1");
```

## setElementZIndex

`Method`

Set the zIndex of the element.

Note: it is not recommended to use this Method in default stacking mode.

Parameters:

| Name   | Type                    | Default | Description            |
| ------ | ----------------------- | ------ | --------------- |
| id     | string                  | -     | node id or edge id |
| zIndex | number\|'top'\|'bottom' | -     | node id or edge id |

```js
graphModel.setElementZIndex("top");
```

## deleteNode

`Method`

Delete node

Parameters:

| Name | Type   | Default | Description    |
| ---- | ------ | ------ | ------- |
| id   | string | -     | node id |

```js
graphModel.deleteNode("node_1");
```

## addNode

`Method`

Add node

Parameters:

| Name       | Type       | Default | Description     |
| ---------- | ---------- | ------ | -------- |
| nodeConfig | NodeConfig | -     | node configuration |

```js
const nodeModel = graphModel.addNode({
  type: "rect",
  x: 300,
  y: 300,
});
```

## cloneNode

`Method`

Clone node

Parameters:

| Name   | Type   | Default | Description    |
| ------ | ------ | ------ | ------- |
| nodeId | string | -     | node id |

```js
const nodeModel = graphModel.cloneNode("node_1");
```

## moveNode

`Method`

Move node

Parameters:

| Name         | Type    | Default | Description                 |
| ------------ | ------- | ------ | -------------------- |
| nodeId       | string  | -     | node id              |
| deltaX       | number  | -     | x-axis translation distance        |
| deltaY       | number  | -     | y-axis translation distance        |
| isignoreRule | boolean | false  | Whether to ignore movement rule restrictions |

```js
graphModel.moveNode("node_1", 10, 10, true);
```

## moveNode2Coordinate

`Method`

Move node - absolute position

Parameters:

| Name         | Type    | Default | Description                 |
| ------------ | ------- | ------ | -------------------- |
| nodeId       | string  | -     | node id              |
| x            | number  | -     | x-axis translation distance        |
| y            | number  | -     | y-axis translation distance        |
| isignoreRule | boolean | false  | Whether to ignore movement rule restrictions |

```js
graphModel.moveNode2Coordinate("node_1", 100, 100, true);
```

## editText

`Method`

Show node, linking text edit box, enter edit state

Parameters:

| Name | Type   | Default | Description              |
| ---- | ------ | ------ | ----------------- |
| id   | string | -     | node id or edge id |

```js
graphModel.editText("node_1");
```

!> **Note**  
When an lf instance is initialized with the text set to non-editable, LogicFlow does not internally listen for events to cancel the editing state of the element. This time you need to listen manually, and then use `setElementState` method to cancel the text editing state.

## setElementState

`Method`

Set the state of the element

Parameters:

| Name | Type   | Default | Description                                                                           |
| ---- | ------ | ------ | ------------------------------------------------------------------------------ |
| type | number | -     | 1 indicates default state, 2 indicates text editing, 4 indicates no node is not allowed to be connected, 5 indicates node is allowed to be connected |

For example, in some scenes, nodes and links are not allowed to be edited by default. But when editing is allowed after some operations, this Method can be used to set the element from edited state to uneditable state.

```js
lf.on("node:dbclick", ({ data }) => {
  lf.graphModel.editText(data.id);
  lf.once("graph:transform,node:click,blank:click", () => {
    lf.graphModel.textEditElement.setElementState(1);
  });
});
```

## addEdge

`Method`

Add egde

Parameters:

| Name       | Type       | Default | Description   |
| ---------- | ---------- | ------ | ------ |
| edgeConfig | EdgeConfig | -     | edge configuration |

```js
const edgeModel = graphModel.addEdge({
  type: "polyline",
  sourceNodeId: "node_1",
  targetNodeId: "node_2",
});
```

## deleteEdgeBySourceAndTarget

`Method`

Delete edge

Parameters:

| Name         | Type   | Default | Description        |
| ------------ | ------ | ------ | ----------- |
| sourceNodeId | string | -     | starting node id    |
| targetNodeId | string | -     | ending node id |

```js
graphModel.deleteEdgeBySourceAndTarget("node_1", "node_2");
```

## deleteEdgeById

`Method`

Delete edge based on edge id

Parameters:

| Name | Type   | Default | Description  |
| ---- | ------ | ------ | ----- |
| id   | string | -     | egde id |

```js
graphModel.deleteEdgeById("edge_1");
```

## deleteEdgeBySource

`Method`

Delete all edges starting from the specified node

Parameters:

| Name | Type   | Default | Description      |
| ---- | ------ | ------ | --------- |
| id   | string | -     | id of the starting node of the edge |

```js
graphModel.deleteEdgeBySource("node_1");
```

## deleteEdgeByTarget

`Method`

Delete all edges ending at the specified node

Parameters:

| Name | Type   | Default | Description        |
| ---- | ------ | ------ | ----------- |
| id   | string | -     | id of the ending node of the edge |

```js
graphModel.deleteEdgeByTarget("node_1");
```

## updateText

`Method`

Set the text of the specified element

```js
graphModel.updateText("node_1", "hello world");
```

## selectNodeById

`Method`

Select node

Parameters:

| Name     | Type    | Default | Description     |
| -------- | ------- | ------ | -------- |
| id       | string  | -     | node id  |
| multiple | boolean | -     | whether to multi-select |

```js
graphModel.selectNodeById("node_1", true);
```

## selectEdgeById

`Method`

Select edge

Parameters:

| Name     | Type    | Default | Description     |
| -------- | ------- | ------ | -------- |
| id       | string  | -     | edge id  |
| multiple | boolean | -     | whether to multi-select |

```js
graphModel.selectEdgeById("edge_1", true);
```

## selectElementById

`Method`

Select node or edge

Parameters:

| Name     | Type    | Default | Description        |
| -------- | ------- | ------ | ----------- |
| id       | string  | -     | node id or edge id |
| multiple | boolean | -     | whether to multi-select    |

```js
graphModel.selectElementById("edge_1", true);
```

## clearSelectElements

`Method`

Uncheck all selected elements

```js
graphModel.clearSelectElements();
```

## moveNodes

`Method`

Batch move nodes. When nodes are moved, the edge positions of all nodes and unmoved nodes are dynamically calculated.

The edges between the moving nodes will maintain their relative positions.

Parameters

| Name    | Type     | Required | Default | Description            |
| :------ | :------- | :--- | :----- | :-------------- |
| nodeIds | string[] | true | -     | All node ids     |
| deltaX  | number   | true | -     | x-axis translation distance  |
| deltaY  | number   | true | -     | y-axis translation distance  |

```js
graphModel.moveNodes(["node_id", "node_2"], 10, 10);
```

## addNodeMoveRules

`Method`

Add a node movement restriction rule to trigger when a node moves.

If returns false, it will prevent the node from moving.

```js
graphModel.addNodeMoveRules((nodeModel, x, y) => {
  if (nodeModel.properties.disabled) {
    return false;
  }
  return true;
});
```

## getNodeIncomingNode

`Method`

Get all parent nodes of the node

```ts
graphModel.getNodeIncomingNode(nodeId: string): BaseNodeModel[]
```

Parameters：

| Name   | Type   | Required | Default | Description    |
| :----- | :----- | :--- | :----- | :------ |
| nodeId | String | ✅   | -      | node id |

## getNodeOutgoingNode

`Method`

Get all the next-level nodes of the node

```ts
graphModel.getNodeOutgoingNode(nodeId: string): BaseNodeModel[]
```

Parameters：

| Name   | Type   | Required | Default | Description    |
| :----- | :----- | :--- | :----- | :------ |
| nodeId | String | ✅   | -      | node id |

## getNodeIncomingEdge

`Method`

Get all the edges ending at this node

```ts
graphModel.getNodeIncomingEdge(nodeId: string): BaseEdgeModel[]
```

Parameters：

| Name   | Type   | Required | Default | Description    |
| :----- | :----- | :--- | :----- | :------ |
| nodeId | String | ✅   | -      | node id |

## getNodeOutgoingEdge

`Method`

Get all the edges starting from this node

```ts
graphModel.getNodeOutgoingEdge(nodeId: string): BaseEdgeModel[]
```

Parameters：

| Name   | Type   | Required | Default | Description    |
| :----- | :----- | :--- | :----- | :------ |
| nodeId | String | ✅   | -      | node id |

## setDefaultEdgeType

`Method`

Modify the Type of the default edge

Parameters

| Name | Type   | Required | Default | Description   |
| :--- | :----- | :--- | :----- | :----- |
| type | string | true | -     | edge type |

```js
graphModel.setDefaultEdgeType("bezier");
```

## changeNodeType

`Method`

Modify the Type of the specified node

Parameters

| Name | Type   | Required | Default | Description     |
| :--- | :----- | :--- | :----- | :------- |
| id   | string | true | -     | node id     |
| type | string | true | -     | node type |

```js
graphModel.changeNodeType("node_1", "circle");
```

## changeEdgeType

`Method`

Modify the Type of the specified edge

Parameters

| Name | Type   | Required | Default | Description   |
| :--- | :----- | :--- | :----- | :----- |
| id   | string | true | -     | node id   |
| type | string | true | -     | edge type |

```js
graphModel.changeEdgeType("edge_1", "bezier");
```

## setTheme

Set theme.

```js
graphModel.setTheme({
  rect: {
    fill: "red",
  },
});
```

## resize

Resetting the width and height of the canvas.

```js
graphModel.resize(1000, 600);
```

## clearData

`Method`

Clear all elements of the canvas.

```js
graphModel.clearData();
```
