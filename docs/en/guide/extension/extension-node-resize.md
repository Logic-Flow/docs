# Node Resize

## Getting started

LogicFlow provides `RectResize`, `EllipseResize`, `DiamonResize`, `HtmlResize` in the extension package, which are four kinds of basic nodes that support scaling, each with `view` and `model` properties. Scaling of nodes utilizes LogicFlow's custom node mechanism. Developers can inherit these 4 types of nodes that can be scaled to achieve node scaling.

Take for example that we need a rectangle that can be scaled. Our previous way of customizing nodes did not support node scaling：

```js
// Nodes that do not scale
import { RectNode, RectNodeModel } from "@logicflow/core";
class CustomNode extends RectNode {}
class CustomNodeModel extends RectNodeModel {}
export default {
  type: "custom-node",
  model: CustomNodeModel,
  view: CustomNode,
};
```

If we expect the custom node to scale, then change it to:

```js
// Scalable Nodes
import { RectResize } from "@logicflow/extension";
class CustomNode extends RectResize.view {}
class CustomNodeModel extends RectResize.model {}
export default {
  type: "custom-node",
  model: CustomNodeModel,
  view: CustomNode,
};
```

### Set the shape property of the node

LogicFlow refers to attributes such as width, height, and radius of nodes as [shape attributes](en/api/nodeModelApi#ShapeAttributes). We can override the [initNodeData](en/api/nodeModelApi#getoutlinestyle) or [setAttributes](en/api/nodeModelApi#setattributes) methods in the model to set the shape attributes of the node. But when the node can be scaled, we can't set the width and height in `setAttributes`, only in `initNodeData`.

```js
class ResizableRectModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 100;
    this.height = 40;
  }
}
```

### Customizing the view of the node

As mentioned in the tutorial on custom nodes, for nodes with complex style properties, we can override the `getShape` method in `view` to achieve the true rendered appearance of the custom node. But for the view of custom resizable nodes, we need to override `getResizeShape`, not `getShape`.

```js
import { RectResize } from "@logicflow/extension";

class ResizableRectModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 100;
    this.height = 40;
    this.text.draggable = true;
  }
}
class ResizableRectView extends RectResize.view {
  /**
   * This method replaces the getShape method of the custom node.
   */
  getResizeShape() {
    const { model } = this.props;
    const { x, y, width, height, radius, properties } = model;
    const style = model.getNodeStyle();
    return h("g", {}, [
      h("rect", {
        ...style,
        x: x - width / 2,
        y: y - height / 2,
        rx: radius,
        ry: radius,
        width,
        height,
      }),
    ]);
  }
}

export default {
  type: "resizable-rect",
  view: ResizableRectView,
  model: ResizableRectModel,
};
```

!> **Tip** For nodes that inherit from `HtmlResize`, custom `view` please continue to use the `setHtml` method of the `view` of the custom HTML node.

## Event

The event `node:resize` is triggered after node scaling, the event parameters include node position and node size before and after node scaling, the data is {oldNodeSize, newNodeSize}, the details of the fields are as follows:

| Name      | Type   | Description                                  |
| :-------- | :----- | :------------------------------------------- |
| id        | String | Node id                                      |
| type      | String | Node type                                    |
| modelType | String | Node graph type, defined internally          |
| x         | Number | X-axis coordinates of the center of the node |
| y         | Number | Y-axis coordinates of the center of the node |
| rx        | Number | X-axis radius (ellipse, diamond)             |
| ry        | Number | Y-axis radius (ellipse, diamond)             |
| width     | Number | Node width (rectangle)                       |
| height    | Number | Node height (rectangle)                      |

```js
lf.on("node:resize", ({ oldNodeSize, newNodeSize }) => {
  console.log(oldNodeSize, newNodeSize);
});
```

## Set the maximum and minimum value of zoom in and out

After `v1.1.8`, the zoom-in and zoom-out of nodes support setting the maximum and minimum values.

```js
class ResizableRectModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 100;
    this.height = 40;
    this.maxWidth = 400;
    this.maxHeight = 400;
  }
}
```

## Set the default resize distance for zooming in and out

After `v1.1.8`, it supports setting the `girdSize` property of the node, which is used to control how much distance the mouse moves before starting to scale the node.

```js
class ResizableRectModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.gridSize = 400;
  }
}
```

!> **About the gridSize of node scaling** In most cases, in order to ensure the neatness of the nodes, Logicflow will change the size of the nodes only when the mouse moves twice as far as the `gridSize` passed in by initializing the canvas when zooming in and out. But this will have a disadvantage that there is a lagging feeling when adjusting. You can set the `gridSize` of each node individually without changing the initial `gridSize` to make zooming in and out nodes smoother.

## Set the dashed box style

Zoomable nodes display a dashed box against the node when it is selected (the rectangle does not). You can customize its style by overriding the `getResizeOutlineStyle` method.

```js
class ResizableRectModel extends RectResize.model {
  getResizeOutlineStyle() {
    return {
      stroke: "#000000",
      strokeWidth: 1,
      strokeDasharray: "3,3",
    };
  }
}
```

## Set resize point style

The resizable node generates resize action points in the four corners of the dashed box when it is selected. The style can be customized by overriding the `getControlPointStyle` method.

```js
class ResizableRectModel extends RectResize.model {
  getControlPointStyle() {
    return {
      width: 7,
      height: 7,
      fill: "#FFFFFF",
      stroke: "#000000",
    };
  }
}
```

Address: [https://codesandbox.io/s/prod-resonance-ztpvtv](https://codesandbox.io/s/prod-resonance-ztpvtv?file=/step_26_nodeResize/index.js)

<a href="https://codesandbox.io/embed/prod-resonance-ztpvtv?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>
