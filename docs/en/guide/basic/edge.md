# Edge

Like nodes, LogicFlow also has some basic edges built in. LogicFlow's built-in edges include:

- line
- polyline
- bezier

The effect is as follows:

<a href="https://codesandbox.io/embed/condescending-nash-lx1n1?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>

## Select the built-in edge that the custom edge inherits from

```js
// line
import { LineEdge, PolylineEdgeModel } from "@logicflow/core";
// polylineEdge
import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";
// bezier
import { BezierEdge, BezierEdgeModel } from "@logicflow/core";
```

## Custom Edges Based on Inheritance

Like nodes, LogicFlow's edges support an inheritance-based customization mechanism. It is also necessary to inherit both `view` and `model`. However, unlike nodes, customizing `view` is not recommended in most cases due to the complexity of editing edges. Just customize [edgeModel](en/api/edgeModelApi).

```js
import { PolylineEdgeModel } from "@logicflow/core";

class SequenceModel extends PolylineEdgeModel {
  setAttributes() {
    this.offset = 20;
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    const { properties } = this;
    if (properties.isActived) {
      style.strokeDasharray = "4 4";
    }
    style.stroke = "orange";
    return style;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = "#3451F1";
    style.fontSize = 30;
    style.background.fill = "#F2F131";
    return style;
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = "red";
    style.hover.stroke = "red";
    return style;
  }
}

export default {
  type: "sequence",
  view: PolylineEdge,
  model: SequenceModel,
};
```

[Edit in codesandbox](https://codesandbox.io/s/logicflow-step5-i4xes?file=/step5/sequence.js)

## Custom edges based on React components

Use the following methods to customize edges based on React components. You can add any React components you want on the side, and even hide the original side through styles and use React to redraw it.

```js
import React from "react";
import ReactDOM from "react-dom";
import { BaseEdgeModel, LineEdge, h } from "@logicflow/core";

const DEFAULT_WIDTH = 48;
const DEFAULT_HEIGHT = 32;

class CustomEdgeModel extends BaseEdgeModel {
  getEdgeStyle() {
    const edgeStyle = super.getEdgeStyle();
    // You can set the style of the line by yourself, even hide the original line, and draw it with react
    edgeStyle.strokeDasharray = "4 4";
    edgeStyle.stroke = "#DDDFE3";
    return edgeStyle;
  }
}

const CustomLine: React.FC = () => {
  return <div className="custom-edge">aaa</div>;
};

class CustomEdgeView extends LineEdge {
  getEdge() {
    const { model } = this.props;
    const { customWidth = DEFAULT_WIDTH, customHeight = DEFAULT_HEIGHT } =
      model.getProperties();
    const id = model.id;
    const edgeStyle = model.getEdgeStyle();
    const { startPoint, endPoint, arrowConfig } = model;
    const lineData = {
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endPoint.x,
      y2: endPoint.y,
    };
    const positionData = {
      x: (startPoint.x + endPoint.x - customWidth) / 2,
      y: (startPoint.y + endPoint.y - customHeight) / 2,
      width: customWidth,
      height: customHeight,
    };
    const wrapperStyle = {
      width: customWidth,
      height: customHeight,
    };

    setTimeout(() => {
      ReactDOM.render(<CustomLine />, document.querySelector("#" + id));
    }, 0);
    return h("g", {}, [
      h("line", { ...lineData, ...edgeStyle, ...arrowConfig }),
      h("foreignObject", { ...positionData }, [
        h("div", {
          id,
          style: wrapperStyle,
          className: "lf-custom-edge-wrapper",
        }),
      ]),
    ]);
  }
}

export default {
  type: "CustomEdge",
  view: CustomEdgeView,
  model: CustomEdgeModel,
};
```

### Example

<a href="https://codesandbox.io/embed/affectionate-visvesvaraya-uexl0y?fontsize=14&hidenavigation=1&theme=dark" target="_blank"> Demo in CodeSandBox</a>

## Save anchor information

By default, LogicFlow only records information about nodes and edges. However, in some business scenarios, attention needs to be paid to anchor points, such as associative relationships in UML. This time you need to rewrite the save method of the edge to save the anchor information as well.

```js
class CustomEdgeModel2 extends LineEdgeModel {
  /**
   * Override this method so that the saved data contains anchor information.
   */
  getData() {
    const data = super.getData();
    data.sourceAnchorId = this.sourceAnchorId;
    data.targetAnchorId = this.targetAnchorId;
    return data;
  }
}
```

<a href="https://codesandbox.io/embed/logicflow-base17-h5pis?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>

## Customize side text position

By default, the position of the text on the edge is where it was when the user double-clicked on the edge. If the text is added to the edge through the API, the text position follows the following rules:

- line: Middle of start point and end point
- polyline: Middle of longest line segment
- bezier: Middle of start point, end point and adjustment point

LogicFlow supports developers to customize the text position, for example, the text position is always next to the starting point. This is achieved by setting the property `customTextPosition` to true, and then overriding the `getTextPosition` method, which returns the coordinates of the text.

```js
class CustomEdgeModel extends PolylineEdgeModel {
  customTextPosition = true;
  getTextPosition() {
    const position = super.getTextPosition();
    const currentPositionList = this.points.split(" ");
    const pointsList = [];
    currentPositionList &&
      currentPositionList.forEach((item) => {
        const [x, y] = item.split(",");
        pointsList.push({ x: Number(x), y: Number(y) });
      });
    if (currentPositionList.length > 1) {
      let [x1, y1] = currentPositionList[0].split(",");
      let [x2, y2] = currentPositionList[1].split(",");
      let distance = 50;
      x1 = Number(x1);
      y1 = Number(y1);
      x2 = Number(x2);
      y2 = Number(y2);
      if (x1 === x2) {
        // vertical
        if (y2 < y1) {
          distance = -50;
        }
        position.y = y1 + distance;
        position.x = x1;
      } else {
        if (x2 < x1) {
          distance = -50;
        }
        position.x = x1 + distance;
        position.y = y1 - 10;
      }
    }
    return position;
  }
}
```

### Example

<a href="https://codesandbox.io/embed/laughing-dream-x3v87?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>

## Opening the animation of edge

Since LogicFlow is an svg-based flowchart editing framework, we can add animation to the flowchart by adding animation to svg. For ease of use, we have built in basic animations. When defining an edge, you can set the property `isAnimation` to true to make the edge animate, or you can use `lf.openEdgeAnimation(edgeId)` to enable the default animation of the edge.

```js
class CustomEdgeModel extends PolylineEdgeModel {
  setAttributes() {
    this.isAnimation = true;
  }
  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle();
    style.strokeDasharray = "5 5";
    style.animationDuration = "10s";
    return style;
  }
}
```

### Example

<a href="https://codesandbox.io/embed/suspicious-tree-hw82v8?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>

## Customize the type of edges between nodes

By default, the edges generated by manually connecting nodes from anchor points are of the type specified by `edgeType` during Logicflow initialization, or can be specified by `lf.setDefaultEdgeType(edgeType)`. But when different types of edges are needed to connect between different nodes, the only way is to customize the types of edges between nodes.

```js
const lf = new LogicFlow({
  ...,
  // Default side
  edgeType: 'bezier',
  // The currentEdge information is available when moving an existing edge, otherwise it is empty.
  edgeGenerator: (sourceNode, targetNode, currentEdge) => {
    // Use custom-edge when source node type is rect
    if (sourceNode.type === 'rect') return 'custom-edge'
  }
})

```

## Custom arrows

After `1.1.27` version, LogicFlow supports custom arrows at both ends of the sides. Like the previous customization method, you can customize the basic data such as size by theme or achieve complete customization by rewriting the corresponding method.

### Theme configuration

```js
lf.setTheme({
  arrow: {
    offset: 4,
    verticalLength: 2,
  },
});
```

### Customize the shape of the arrow

When customizing the view of the edge, you can rewrite the `getEndArrow` and `getStartArrow` methods to realize the arrows at both ends of the custom edge. These two methods can return any `svg` graphics.

Here is an example of controlling the different appearance of an edge by using the arrowType in the edge property.

```js
class Connection extends PolylineEdge {
  getEndArrow() {
    const { model, graphModel } = this.props;
    const {
      id,
      properties: { arrowType },
    } = model;
    const { stroke, strokeWidth } = this.getArrowStyle();
    const pathAttr = {
      stroke,
      strokeWidth,
    };
    if (arrowType === "empty") {
      // Hollow arrow
      return h("path", {
        ...pathAttr,
        fill: "#FFF",
        d: "M -10 0  -20 -5 -30 0 -20 5 z",
      });
    } else if (arrowType === "half") {
      // Half arrow
      return h("path", {
        ...pathAttr,
        d: "M 0 0 -10 5",
      });
    }
    return h("path", {
      ...pathAttr,
      d: "M 0 0 -10 -5 -10 5 z",
    });
  }
}
```

### Customize Adjusting-node styling

When initializing the LogicFlow instance, you can enable the feature to adjust the start and end points of edges by using the parameter adjustEdgeStartAndEnd.

When customizing the connection view, you can override the getAdjustPointShape method to implement custom styling for the adjustment points.

```js
// lf.js
const lf = new LogicFlow({
  adjustEdgeStartAndEnd: true,
});
// edge.js
class CustomEdge extends LineEdge {
  getAdjustPointShape(x, y, edgeModel) {
    return h("g", {}, [
      h("image", {
        x: x - 9,
        y: y - 9,
        width: 18,
        height: 18,
        cursor: "move",
        href: "data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMnB4IiBoZWlnaHQ9IjIycHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iNyIgc3Ryb2tlPSIjZmZmIiBmaWxsPSIjMjliNmYyIi8+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iMyIgc3Ryb2tlPSIjZmZmIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjwvc3ZnPg==",
      }),
    ]);
  }
}
```

<a href="https://codesandbox.io/embed/logicflow026-edgeanimation-forked-fdg3v0?fontsize=14&hidenavigation=1&theme=dark" target="_blank"> Demo in CodeSandBox</a>
