# LogicFlow

All node instance operations on the flowchart, as well as events and behavior listening, are performed on the `LogicFlow` instance.

## constructor

`LogicFlow` Configuration Items

```js
const lf = new LogicFlow(options: Options)
```

| Options                   | Type              | Required | Default    | Description                                                                                                                                                                                                                                                                                                                                                                      |
| :------------------------ | :---------------- | :------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| container                 | HTMLElement       | ✅       | -          | DOM container of the graph                                                                                                                                                                                                                                                                                                                                                       |
| width                     | Number            | -        | -          | Specify the width of the canvas in 'px', the default is to use the container width.                                                                                                                                                                                                                                                                                              |
| height                    | Number            | -        | -          | Specify the height of the canvas in 'px', the default is to use the container height.                                                                                                                                                                                                                                                                                            |
| [background](#background) | false \| Object   | -        | false      | Background, no background by default                                                                                                                                                                                                                                                                                                                                             |
| [grid](#grid)             | false \| Object   | -        | false      | Grid, if set to `false` without grid on, it is 1px moving units, no grid background is drawn; if set to `true` on, it is 20px dotted grid by default                                                                                                                                                                                                                             |
| [keyboard](#keyboard)     | Object            | -        | -          | Custom keyboard-related configuration                                                                                                                                                                                                                                                                                                                                            |
| [style](#style)           | Object            | -        | -          | Style                                                                                                                                                                                                                                                                                                                                                                            |
| animation                 | Boolean \| Object | -        | -          | Whether to turn on the animation function, can be unified switch and individual configuration                                                                                                                                                                                                                                                                                    |
| disabledPlugins           | string[]          | -        | -          | Disable the loaded plugins when passing in the initialization                                                                                                                                                                                                                                                                                                                    |
| snapline                  | Boolean           | -        | true       | Whether to enable node auxiliary alignment lines                                                                                                                                                                                                                                                                                                                                 |
| history                   | Boolean           | -        | true       | Whether to turn on the history function                                                                                                                                                                                                                                                                                                                                          |
| partial                   | Boolean           | -        | false      | Whether to enable local rendering                                                                                                                                                                                                                                                                                                                                                |
| edgeType                  | String            | -        | 'polyline' | Edit the type of created edge on the graph, and support custom type.                                                                                                                                                                                                                                                                                                             |
| guards                    | Array             | -        | -          | Whether to add guard function, function returns true then execute default logic, return false then block                                                                                                                                                                                                                                                                         |
| disabledTools             | string[]          | -        | -          | Disable built-in tools, logicflow built-in tools are 'multipleSelect' and 'textEdit' currently.                                                                                                                                                                                                                                                                                  |
| isSilentMode              | Boolean           | -        | false      | Browse only non-editable mode, not on by default                                                                                                                                                                                                                                                                                                                                 |
| stopZoomGraph             | boolean           | -        | false      | Disable scaling of the canvas                                                                                                                                                                                                                                                                                                                                                    |
| stopScrollGraph           | boolean           | -        | false      | Disable mouse scrolling to move the canvas                                                                                                                                                                                                                                                                                                                                       |
| stopMoveGraph             | boolean           | -        | false      | Disable dragging the canvas                                                                                                                                                                                                                                                                                                                                                      |
| adjustEdge                | boolean           | -        | true       | Allows adjustment of edges                                                                                                                                                                                                                                                                                                                                                       |
| adjustEdgeStartAndEnd     | boolean           | -        | false      | Whether to allow dragging the endpoints of an edge to adjust the linkage                                                                                                                                                                                                                                                                                                         |
| adjustNodePosition        | boolean           | -        | true       | Whether to allow dragging of nodes                                                                                                                                                                                                                                                                                                                                               |
| hideAnchors               | boolean           | -        | false      | Whether to hide the node's anchor point, default hidden in silent mode                                                                                                                                                                                                                                                                                                           |
| hoverOutline              | boolean           | -        | true       | Show the outer frame of the node when the mouse hovers                                                                                                                                                                                                                                                                                                                           |
| nodeSelectedOutline       | boolean           | -        | true       | Show the outer frame of the node when the mouse is selected                                                                                                                                                                                                                                                                                                                      |
| edgeSelectedOutline       | boolean           | -        | true       | Show the outer frame of the edge when mouse hover                                                                                                                                                                                                                                                                                                                                |
| nodeTextEdit              | boolean           | -        | true       | Allow node text to be editable                                                                                                                                                                                                                                                                                                                                                   |
| edgeTextEdit              | boolean           | -        | true       | Allow edge text to be editable                                                                                                                                                                                                                                                                                                                                                   |
| textEdit                  | Boolean           | -        | true       | Whether to enable text editing                                                                                                                                                                                                                                                                                                                                                   |
| nodeTextDraggable         | boolean           | -        | false      | Allow node text to be dragged                                                                                                                                                                                                                                                                                                                                                    |
| edgeTextDraggable         | boolean           | -        | false      | Allow edge text to be dragged                                                                                                                                                                                                                                                                                                                                                    |
| multipleSelectKey         | string            | -        | -          | Multi-select keys, including meta (cmd), shift and alt. Support key combination to click on elements to achieve multi-selection.                                                                                                                                                                                                                                                 |
| idGenerator               | function          | -        | -          | Customize the rules for generating ids when creating nodes and edges.                                                                                                                                                                                                                                                                                                            |
| edgeGenerator             | function          | -        | -          | Rules for generating edges when connecting nodes and moving edges                                                                                                                                                                                                                                                                                                                |
| plugins                   | Array             | -        | -          | The plug-in loaded by the current LogicFlow instance, or the global plug-in if it is not passed.                                                                                                                                                                                                                                                                                 |
| autoExpand                | boolean           | -        | -          | Whether to automatically expand the canvas when nodes are dragged near the edge of the canvas, default true. Note that if the canvas keeps scrolling when nodes are dragged to a certain position, it is because there is a problem with the width and height of the initialized canvas. It is recommended to turn off autoExpand if the canvas is of variable width and height. |
| overlapMode               | number            | -        | -          | The stacking mode for element overlap defaults to connected lines at the bottom, nodes at the top, and selected elements at the top. Can be set to 1 for self-incrementing mode (common for graphing tool scenes).                                                                                                                                                               |

### `background`

No background default; support pass-through of any style property to the background layer

```js
export type BackgroundConfig = {
  backgroundImage?: string, // background image address
  backgroundColor?: string, // background color
  backgroundRepeat?: string, // background image duplication mode
  backgroundPosition?: string, // background image position
  backgroundSize?: string, // background image size
  backgroundOpacity?: number, // background image opacity
  filter?: string, // filter
  [key: any]: any,
};
```

### `grid`

Grid default on, support options:

```js
export type GridOptions = {
  size?: number // grid size
  visible?: boolean, // visible or not, false hides the grid lines but keeps the grid effect
  type?: 'dot' | 'mesh', // grid style, built-in support for dot 'dot' and grid 'mesh' currently
  config?: {
    color: string, // grid color
    thickness?: number, // gridline width
  }
};
```

### `keyboard`

Keyboard shortcuts are not enabled by default, support options:

```ts
export interface KeyboardDef {
  enabled: boolean;
  shortcuts?: Array<{
    keys: string | string[];
    callback: Handler;
    action?: Action;
  }>;
}
```

Using built-in shortcuts:

```js
const lf = new LogicFlow({
  keyboard: {
    enabled: true,
  },
});
```

Built-in shortcut key function：

- `'cmd + c', 'ctrl + c'` Flowchart Replication
- `'cmd + v', 'ctrl + v'` Flowchart Paste
- `'cmd + z', 'ctrl + z'` Previous step
- `'cmd + y', 'ctrl + y'` Next step
- `'backspace'` Delete

Customized shortcut keys:

```js
const lf = new LogicFlow({
  keyboard: {
    enable: true,
    shortcuts: [
      {
        keys: ["cmd + o", "ctrl + o"],
        callback: () => {
          // customized logic
        },
      },
    ],
  },
});
```

### `style`

The theme can be configured via style, see the tutorial [Theme](en/guide/basic/theme) for details of the supported style options.

### `snapline`

Alignment lines that contain the center point of the node, the top and bottom borders, and the left and right border alignment.

- In edit mode, the alignment line is turned on by default. Set snapline to false to turn off the alignment line.
- In non-editable mode, alignment lines are turned off.

## register

Register nodes, edges.

```js
lf.register(config):void
```

Parameters:

| Parameter Name | Type   | Required | Default | Description                            |
| :------------- | :----- | :------- | :------ | :------------------------------------- |
| config.type    | String | ✅       | -       | Customize the names of nodes and edges |
| config.model   | Model  | ✅       | -       | Model of nodes and edges               |
| config.view    | View   | ✅       | -       | View of nodes and edges                |

Example:

```js
import { RectNode, RectNodeModel, h } from "@logicflow/core";
// provide nodes
class UserNode extends RectNode {}
// provide the attributes of the node
class UserModel extends RectNodeModel {
  constructor(data) {
    super(data);
    const { size } = data.properties;
    this.width = size * 40;
    this.height = size * 40;
    this.fill = "green";
  }
}
lf.register({
  type: "user",
  view: UserNode,
  model: UserModel,
});
```

## batchRegister

Batch register

```ts
lf.batchRegister([
  {
    type: 'user',
    view: UserNode,
    model: UserModel,
  },
    {
    type: 'user1',
    view: UserNode1,
    model: UserModel1,
  },
);
```

## render

Render graph data

```js
const lf = new LogicFlow({
  ...
})
lf.render(graphData)
```

## renderRawData

Rendering of the raw graph data. The difference with `render` is that after using `adapter`, you can use this method if you still want to render the data in logicflow format.

```js
const lf = new LogicFlow({
  ...
})
lf.renderRawData({
  nodes: [],
  edges: []
})
```

## setTheme

Set the theme, see [Theme](en/api/themeApi) for details

## changeNodeType

Modify node type

```ts
changeNodeType(id: string, type: string): void
```

| Name | Type   | Required | Default | Description |
| :--- | :----- | :------- | :------ | :---------- |
| id   | String | ✅       |         | Node id     |
| type | String | ✅       |         | New type    |

Example:

```js
lf.changeNodeType("node_id", "rect");
```

## getNodeEdges

Get the model of all edges connected by the node.

```ts
getNodeEdges(id: string): BaseEdgeModel[]
```

| Parameter | Type   | Required | Default | Description |
| :-------- | :----- | :------- | :------ | :---------- |
| id        | String | ✅       |         | Node id     |

Example:

```js
const edgeModels = lf.getNodeEdges("node_id");
```

## addNode

Add nodes to the graph.

```js
addNode(nodeConfig: NodeConfig):nodeModel
```

Parameters:

| Name       | Type           | Required | Default | Description                                |
| :--------- | :------------- | :------- | :------ | :----------------------------------------- |
| type       | String         | ✅       | -       | Node type name                             |
| x          | Number         | ✅       | -       | Node horizontal coordinate x               |
| y          | Number         | ✅       | -       | Node vertical coordinate y                 |
| text       | Object\|String |          | -       | Node text content and location coordinates |
| id         | String         |          | -       | Node id                                    |
| properties | Object         |          | -       | Node properties, user can customize        |

Example:

```js
lf.addNode({
  type: "user",
  x: 500,
  y: 600,
  id: 20,
  text: {
    value: "test",
    x: 500,
    y: 600,
  },
  properties: {
    size: 1,
  },
});
```

## deleteNode

Deletes a node on the graph, and if there is a line attached to this node, then also deletes the line.

```js
deleteNode(nodeId: string): void
```

Parameters:

| Name   | Type   | Required | Default | Description                      |
| :----- | :----- | :------- | :------ | :------------------------------- |
| nodeId | String | ✅       | -       | The id of the node to be deleted |

Example:

```js
lf.deleteNode("id");
```

## cloneNode

Clone node

```js
cloneNode(nodeId: string): BaseNodeModel
```

Parameters:

| Name   | Type   | Required | Default | Description    |
| :----- | :----- | :------- | :------ | :------------- |
| nodeId | String | ✅       | -       | Target node id |

Example:

```js
lf.cloneNode("id");
```

## changeNodeId

Modify the id of the node, if no new id is passed, one will be created internally automatically.

Example:

```js
lf.changeNodeId("oldId", "newId");
```

## getNodeModelById

Get the `model` of the node

```ts
getNodeModelById(nodeId: string): BaseNodeModel
```

Parameters:

| Name   | Type   | Required | Default | Description |
| :----- | :----- | :------- | :------ | :---------- |
| nodeId | String | ✅       | -       | Node id     |

Example:

```js
lf.getNodeModelById("id");
```

## getNodeDataById

Get the `model` data of the node

```ts
getNodeDataById(nodeId: string): NodeConfig
```

Parameters:

| Name   | Type   | Required | Default | Description |
| :----- | :----- | :------- | :------ | :---------- |
| nodeId | String | ✅       | -       | Node id     |

Example:

```js
lf.getNodeDataById("id");
```

## getNodeIncomingNode

Get all parent nodes of the node

```ts
getNodeIncomingNode(nodeId: string): BaseNodeModel[]
```

Parameters:

| Name   | Type   | Required | Default | Description |
| :----- | :----- | :------- | :------ | :---------- |
| nodeId | String | ✅       | -       | Node id     |

## getNodeOutgoingNode

Get all the next-level nodes of the node

```ts
getNodeOutgoingNode(nodeId: string): BaseNodeModel[]
```

Parameters:

| Name   | Type   | Required | Default | Description |
| :----- | :----- | :------- | :------ | :---------- |
| nodeId | String | ✅       | -       | Node id     |

## getNodeIncomingEdge

Get all the edges that end at this node

```ts
getNodeIncomingEdge(nodeId: string): BaseEdgeModel[]
```

Parameters:

| Name   | Type   | Required | Default | Description |
| :----- | :----- | :------- | :------ | :---------- |
| nodeId | String | ✅       | -       | Node id     |

## getNodeOutgoingEdge

Get all the edges that start at this node

```ts
getNodeOutgoingEdge(nodeId: string): BaseEdgeModel[]
```

Parameters:

| Name   | Type   | Required | Default | Description |
| :----- | :----- | :------- | :------ | :---------- |
| nodeId | String | ✅       | -       | Node id     |

## addEdge

Create an edge connecting two nodes

```js
addEdge(edgeConfig: EdgeConifg): void
```

Parameters:

| Name         | Type            | Required | Default | Description                                  |
| :----------- | :-------------- | :------- | :------ | :------------------------------------------- |
| id           | String          |          | -       | Edge id                                      |
| type         | String          |          | -       | Egde type                                    |
| sourceNodeId | String          | ✅       | -       | id of the start node of the edge             |
| targetNodeId | String          | ✅       | -       | id of the end node of the edge               |
| startPoint   | Object          |          | -       | Coordinate of the starting point of the edge |
| endPoint     | Object          |          | -       | Coordinate of the ending point of the edge   |
| text         | String\| Object |          | -       | Edge text                                    |

Example:

```js
lf.addEdge({
  sourceNodeId: '10',
  targetNodeId: '21',
  startPoint: {
    x: 11,
    y: 22,
  }
  endPoint: {
    x: 33,
    y: 44,
  }
  text: 'Edge Text',
});
```

## deleteEdge

Delete an edge based on its id

```js
removeEdge(id): void
```

Parameters:

| Name | Type   | Required | Default | Description |
| :--- | :----- | :------- | :------ | :---------- |
| id   | String |          | -       | Edge id     |

Example:

```js
lf.deleteEdge("edge_1");
```

## deleteEdgeByNodeId

Deletes an edge of the specified type, based on the start and end points of the edge, and can pass only one of them.

```js
deleteEdgeByNodeId(config: EdgeFilter): void
```

Parameters:

| Name         | Type   | Required | Default | Description                         |
| :----------- | :----- | :------- | :------ | :---------------------------------- |
| sourceNodeId | String |          | -       | id of the starting node of the edge |
| targetNodeId | String |          | -       | id of the ending node of the edge   |

Example:

```js
lf.removeEdge({
  sourceNodeId: "id1",
  targetNodeId: "id2",
});

lf.removeEdge({
  sourceNodeId: "id1",
});

lf.removeEdge({
  targetNodeId: "id2",
});
```

## getEdgeModelById

Get the `model` of the edge based on the its id

```ts
getEdgeModelById(edgeId: string): BaseEdgeModel
```

Parameters:

| Name   | Type   | Required | Default | Description |
| :----- | :----- | :------- | :------ | :---------- |
| edgeId | String | ✅       | -       | Node id     |

Example:

```js
lf.getEdgeModelById("id");
```

## getEdgeModels

Get the model of the edge that satisfies the condition

| Name       | Type   | Required | Default | Description          |
| :--------- | :----- | :------- | :------ | :------------------- |
| edgeFilter | Object | ✅       | -       | Filtering conditions |

```js
// get all the mods of the edges whose starting point is node A
lf.getEdgeModels({
  sourceNodeId: "nodeA_id",
});
// get all the mods of the edges whose ending point is node B
lf.getEdgeModels({
  targetNodeId: "nodeB_id",
});
// Get the edge whose starting point is node A and ending point is node B
lf.getEdgeModels({
  sourceNodeId: "nodeA_id",
  targetNodeId: "nodeB_id",
});
```

## changeEdgeId

Modify the edge id. If a new id is not passed, one will be created internally automatically.

Example:

```js
lf.changeEdgeId("oldId", "newId");
```

## changeEdgeType

Switch type of edge

Example:

```js
lf.changeEdgeType("edgeId", "bezier");
```

## getEdgeDataById

Get edge data by `id`

```js
getEdgeDataById(edgeId: string): EdgeConfig
// 返回值
export type EdgeConfig = {
  id: string;
  type: string;
  sourceNodeId: string;
  targetNodeId: string;
  startPoint?: {
    x: number;
    y: number;
  },
  endPoint?: {
    x: number;
    y: number;
  },
  text?: {
    x: number;
    y: number;
    value: string;
  },
  pointsList?: Point[];
  properties?: Record<string, unknown>;
};
```

Parameters:

| Name   | Type   | Required | Default | Description |
| :----- | :----- | :------- | :------ | :---------- |
| edgeId | String | ✅       | -       | Edge id     |

Example:

```js
lf.getEdgeDataById("id");
```

## setDefaultEdgeType

Set the type of edge, i.e. set the type of linkage drawn directly by the user at the node.

```js
setDefaultEdgeType(type: EdgeType): void
```

| Name | Type   | Required | Default    | Description                                                                                                                                                                                                             |
| :--- | :----- | :------- | :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type | String | ✅       | 'polyline' | Set the type of edge, built-in support for edge types are line (straight line), polyline (line), bezier (Bezier curve). The default is a line, and users can customize the type name to switch to the user-defined edge |

Example:

```js
lf.setDefaultEdgeType("line");
```

## editText

Same as [graphModel.editText](en/api/graphModelApi#edittext)

## updateText

Update the node or edge text

```ts
updateText(id: string, value: string): void
```

| Name  | Type   | Required | Default | Description        |
| :---- | :----- | :------- | :------ | :----------------- |
| id    | String | ✅       |         | Node or edge id    |
| value | String | ✅       |         | Updated text value |

Example:

```js
lf.updateText("id", "value");
```

## deleteElement

Delete element

```ts
deleteElement(id: string): boolean
```

| Name | Type   | Required | Default | Description     |
| :--- | :----- | :------- | :------ | :-------------- |
| id   | String | ✅       |         | Node or edge id |

Example:

```js
lf.deleteElement("node_id");
```

## selectElementById

Select the graph

Parameters:

| Name     | Type    | Required | Default | Description                   |
| :------- | :------ | :------- | :------ | :---------------------------- |
| id       | string  | ✅       | -       | Node or edge id               |
| multiple | boolean |          | false   | Whether it is multiple choice |

Example:

```ts
lf.selectElementById(id: string, multiple = false)
```

## getGraphData

Get flow graphing data

```ts
// Return value. If the adapter plugin is applied and the setting is adapterOut, the return is the converted data format, otherwise it is the default format.
// Starting from version 1.2.5, new input parameters have been added for the execution of certain adapterOut that require input parameters.
// For example, the built-in BpmnAdapter may require an array of attribute reserve fields to be passed in to ensure that certain node attributes in the exported data are properly processed.
// The input parameters here should be consistent with the other parameters of the adapterOut method from the imported adapter, except for the data parameter.
getGraphData(...params: any): GraphConfigData | unknown
```

LogicFlow default data format

```ts
type GraphConfigData = {
  nodes: {
    id?: string;
    type: string;
    x: number;
    y: number;
    text?: TextConfig;
    properties?: Record<string, unknown>;
  }[];
  edges: {
    id: string;
    type: string;
    sourceNodeId: string;
    targetNodeId: string;
    startPoint: any;
    endPoint: any;
    text: {
      x: number;
      y: number;
      value: string;
    };
    properties: {};
  }[];
};
```

Example:

```js
lf.getGraphData();
```

## getGraphRawData

Get the raw data of the flow graph. The difference with getGraphData is that the data obtained by this method is not affected by the adapter.

```ts
getGraphRawData(): GraphConfigData
```

Example:

```js
lf.getGraphRawData();
```

## setProperties

Set custom properties of nodes or edges

```ts
setProperties(id: string, properties: Object): void
```

Example:

```js
lf.setProperties("aF2Md2P23moN2gasd", {
  isRollbackNode: true,
});
```

## deleteProperty

Delete node attributes

```ts
deleteProperty(id: string, key: string): void
```

Example:

```js
lf.deleteProperty("aF2Md2P23moN2gasd", "isRollbackNode");
```

## getProperties

Get the custom properties of a node or an edge

```ts
getProperties(id: string): Object
```

Example:

```js
lf.getProperties("id");
```

## toFront

Places an element to the top.

If the stacking mode is the default, the original top element is restored to its original level.

If the stacking mode is incremental, the zIndex of the element to be specified is set to the current maximum zIndex + 1.

Example:

```js
lf.toFront("id");
```

## setElementZIndex

Set the zIndex of the element.

Note: This method is not recommended for the default stacking mode.

Parameters:

| Name   | Type            | Required | Default | Description                                               |
| :----- | :-------------- | :------- | :------ | :-------------------------------------------------------- |
| id     | String          | ✅       | -       | Node or edge id                                           |
| zIndex | String\| Number | ✅       | -       | Passing numbers, also supports passing `top` and `bottom` |

Example:

```js
// 置为顶部
lf.setElementZIndex("element_id", "top");
// 置为底部
lf.setElementZIndex("element_id", "bottom");
lf.setElementZIndex("element_id", 2000);
```

## addElements

Batch add nodes and edges

Example:

```js
// Put at the top
lf.addElements({
  nodes: [
    {
      id: "node_1",
      type: "rect",
      x: 100,
      y: 100,
    },
    {
      id: "node_2",
      type: "rect",
      x: 200,
      y: 300,
    },
  ],
  edges: [
    {
      id: "edge_3",
      type: "polyline",
      sourceNodeId: "node_1",
      targetNodeId: "node_2",
    },
  ],
});
```

## getAreaElement

Gets all the elements in the specified region, which must be a DOM layer.

For example, after drawing a selection with the mouse, get all the elements inside the selection.

Parameters:

| Name              | Type       | Default | Description                                         |
| ----------------- | ---------- | ------- | --------------------------------------------------- |
| leftTopPoint      | PointTuple | -       | Point at the upper left of the area                 |
| rightBottomPoint  | PointTuple | -       | point at the bottom right of the area               |
| wholeEdge         | boolean    | -       | Whether the entire edge has to be inside the region |
| wholeNode         | boolean    | -       | Whether the entire node has to be inside the region |
| ignoreHideElement | boolean    | -       | Whether ignoring hidden nodes                       |

```js
lf.getAreaElement([100, 100], [500, 500]);
```

## getSelectElements

Get all elements selected

```ts
getSelectElements(isIgnoreCheck: boolean): GraphConfigData
```

| Name          | Type    | Required | Default | Description                                                                                    |
| :------------ | :------ | :------- | :------ | :--------------------------------------------------------------------------------------------- |
| isIgnoreCheck | boolean | ✅       | true    | Whether to include edges where sourceNode and targetNode are not selected, default is include. |

```js
lf.getSelectElements(false);
```

## clearSelectElements

Uncheck all elements

```js
lf.clearSelectElements();
```

## getModelById

Get the model of a node or edge based on its id

```js
lf.getModelById("node_id");
lf.getModelById("edge_id");
```

## getDataById

Get data of a node or edge based on its id

```js
lf.getDataById("node_id");
lf.getDataById("edge_id");
```

## clearData

Clear the canvas

```js
lf.clearData();
```

## updateEditConfig

Update the basic configuration of the flow editor.

See [editConfig](en/api/editConfigModelApi) for detailed parameters

```js
lf.updateEditConfig({
  stopZoomGraph: true,
});
```

## getEditConfig

Get the basic configuration of the flow editor.

See [editConfig](en/api/editConfigModelApi) for detailed parameters

```js
lf.getEditConfig();
```

## getPointByClient

Get the coordinates of the event location relative to the top left corner of the canvas

The location of the canvas can be anywhere on the page. The coordinates returned by the native event are relative to the top-left corner of the page, and this method provides the exact location with the top-left corner of the canvas as the origin.

```js
getPointByClient(x: number, y: number)
```

Parameters:

| Name | Type   | Required | Default | Description                                                                                                                        |
| :--- | :----- | :------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------- |
| x    | Number | ✅       | -       | The `x` coordinate relative to the top left corner of the page, which is generally the `x` coordinate returned by the native event |
| y    | Number | ✅       | -       | The `y` coordinate relative to the top left corner of the page, which is generally the `y` coordinate returned by the native event |

返回值：

| Name  | Type  | Description                                                     |
| :---- | :---- | :-------------------------------------------------------------- |
| point | Point | Two coordinates relative to the upper left corner of the canvas |

```ts
type Position = {
  x: number;
  y: number;
};
type Point = {
  domOverlayPosition: Position; // Coordinates on the HTML layer relative to the top-left corner of the canvas`{x, y}`
  canvasOverlayPosition: Position; // Coordinates on the SVG layer relative to the top-left corner of the canvas`{x, y}`
};
```

Example:

```js
lf.getPointByClient(event.x, event.y);
```

## focusOn

Position to the center of the canvas viewport

Parameters:

| Name        | Type   | Required | Default | Description                         |
| :---------- | :----- | :------- | :------ | :---------------------------------- |
| focusOnArgs | object | ✅       | -       | Required parameters for positioning |

Example:

```ts
// position the center of the canvas viewport to the position of the node_1 element
lf.focusOn({
  id: "node_1",
});
// position the center of the canvas viewport to the coordinates [1000, 1000]
lf.focusOn({
  coordinate: {
    x: 1000,
    y: 1000,
  },
});
```

## resize

Adjust canvas width and height

Parameters:

| Name   | Type   | Required | Default | Description          |
| :----- | :----- | :------- | :------ | :------------------- |
| width  | Number | ✅       | -       | Width of the canvas  |
| height | Number | ✅       | -       | Height of the canvas |

```js
lf.resize(1200, 600);
```

## zoom

Zoom in and out of the canvas

Parameters:

| Name     | Type              | Required | Default | Description                                                                                                                                                                                                                               |
| :------- | :---------------- | :------- | :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isZoomIn | Boolean or Number |          | false   | The value of zoom in and zoom out is supported by passing in a number between 0 and n. Less than 1 means zoom in, more than 1 means zoom out. It also supports passing true and false to zoom in and out according to the built-in scale. |
| isZoomIn | [x,y]             |          | false   | The origin of the zoom, not passing the default top left corner.                                                                                                                                                                          |

Example:

```js
lf.zoom(true);
```

## resetZoom

Resets the zoom scale of the graph to default

Example:

```js
lf.resetZoom();
```

## setZoomMiniSize

Sets the minimum number of times the graph can be scaled when it is reduced. The parameter takes values from 0 to 1. Default 0.2

```js
setZoomMiniSize(size: number): void
```

Parameters:

| Name | Type   | Required | Default | Description                        |
| :--- | :----- | :------- | :------ | :--------------------------------- |
| size | Number | ✅       | 0.2     | Minimum scaling ratio, default 0.2 |

Example:

```js
lf.setZoomMiniSize(0.3);
```

## setZoomMaxSize

Set the maximum magnification

```js
setZoomMaxSize(size: number): void
```

Parameters:

| Name | Type   | Required | Default | Description                       |
| :--- | :----- | :------- | :------ | :-------------------------------- |
| size | Number | ✅       | 16      | Maximum magnification, default 16 |

Example:

```js
lf.setZoomMaxSize(20);
```

## getTransform

Get the zoom in/out value of the current canvas

```js
const transform = lf.getTransform();
console.log(transform);
```

## translate

Panning graph

Parameters:

| Name | Type   | Required | Default | Description                 |
| :--- | :----- | :------- | :------ | :-------------------------- |
| x    | Number | ✅       |         | x-axis translation distance |
| y    | Number | ✅       |         | y-axis translation distance |

```js
lf.translate(100, 100);
```

## resetTranslate

Restore the graph to its original position

```js
lf.resetTranslate();
```

## fitView

Reduce the entire flowchart to a size where the entire canvas can be displayed

```js
lf.fitView(deltaX, deltaY);
```

## on

Listening events of the graph，see [事件](en/api/eventCenterApi) for more events

```js
on(evt: string, callback: Function): this
// Callback function parameters
{
  e, // Native event objects for the mouse <MouseEvent>
  data?, // General properties of elements
  position?, // Coordinates of the mouse trigger point in the canvas { x, y }
  msg?, // Edge calibration information
}
```

Parameters:

| Name     | Type   | Required | Default | Description       |
| :------- | :----- | :------- | :------ | :---------------- |
| evt      | String | ✅       | -       | Event name        |
| callback | String | ✅       | -       | Callback function |

Example:

```js
lf.on("node:click", (args) => {
  console.log("node:click", args.position);
});
lf.on("element:click", (args) => {
  console.log("element:click", args.e.target);
});
```

## off

Remove event listener

```js
off(evt: string, callback: Function): this
```

Parameters:

| Name     | Type   | Required | Default | Description       |
| :------- | :----- | :------- | :------ | :---------------- |
| evt      | String | ✅       | -       | Event name        |
| callback | String | ✅       | -       | Callback function |

Example:

```js
lf.off("node:click", () => {
  console.log("node:click off");
});
lf.off("element:click", () => {
  console.log("element:click off");
});
```

## once

Event Listening Once

```js
once(evt: string, callback: Function): this
```

Parameters:

| Name     | Type   | Required | Default | Description       |
| :------- | :----- | :------- | :------ | :---------------- |
| evt      | String | ✅       | -       | Event name        |
| callback | String | ✅       | -       | Callback function |

Example:

```js
lf.once("node:click", () => {
  console.log("node:click");
});
```

## emit

Trigger events

```js
emit(evt: string, ...args): this
```

Parameters:

| Name | Type   | Required | Default | Description              |
| :--- | :----- | :------- | :------ | :----------------------- |
| evt  | String | ✅       | -       | Event name               |
| args | Array  | ✅       | -       | Trigger event parameters |

Example:

```js
lf.eventCenter.emit("custom:button-click", model);
```

## undo

History Operation - Back to previous step

Example:

```js
lf.undo();
```

## redo

History Operation - Resume Next

Example:

```js
lf.redo();
```
