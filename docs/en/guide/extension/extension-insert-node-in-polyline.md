# InsertNodeInPolyline

## Function

Drag a node to the middle of an edge and the node will automatically become part of the middle of the edge.
Example: There exists a polyline E from node A to node B. Drag a node N onto the polyline E. Release the mouse when the center point of node N is exactly on the path of the polyline E. Then node N becomes an intermediate node between A and B. The original edge E will be deleted and two new polylines will be generated, A to N and N to B respectively.

<a href="https://site.logic-flow.cn/demo/dist/examples/#/extension/InserNodeInPolyline?from=doc" target="_blank"> Demo in CodeSandBox</a>

## support

Currently, only polylines are supported.

## Getting started

```js
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import { InsertNodeInPolyline } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";
LogicFlow.use(InsertNodeInPolyline);
```

## Personalized configuration

Node dragging can be divided into two situations:

- The first one is to drag nodes from the control panel to the canvas and call Dnd's Api to add nodes, which is supported by this plugin by default. Disable this function with the following settings:
  ```js
  InsertNodeInPolyline.dndAdd = false;
  ```
- The second is a free node in the canvas, that is, a node that is not connected to other nodes, dragging the position to the edge, which is supported by this plug-in by default. Turn off this function is set as follows:
  ```js
  InsertNodeInPolyline.dropAdd = false;
  ```
