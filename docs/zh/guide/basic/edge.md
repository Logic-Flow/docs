# 边 Edge

和节点一样，LogicFlow 也内置一些基础的边。LogicFlow 的内置边包括:

- 直线(line)
- 直角折线(polyline)
- 贝塞尔曲线(bezier)

效果如下：

<a href="https://codesandbox.io/embed/condescending-nash-lx1n1?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> 去 CodeSandbox 查看示例</a>

## 选择自定义边继承的内置边

```js
// 直线
import { LineEdge, PolylineEdgeModel } from "@logicflow/core";
// 折线
import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";
// 贝塞尔曲线
import { BezierEdge, BezierEdgeModel } from "@logicflow/core";
```

## 基于继承的自定义边

和节点一样，LogicFlow 的边也支持基于继承的自定义机制。同样也只需同时继承`view`和`model`。
但是和节点不一样的是，由于边的编辑复杂度问题，绝大多数情况下，自定义边时不推荐自定义`view`。
只需要在自定义[edgeModel](zh/api/edgeModelApi)中样式类即可。

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

[去 codesandbox 中编辑](https://codesandbox.io/s/logicflow-step5-i4xes?file=/step5/sequence.js)

## 基于 React 组件自定义边

使用以下方法可以基于 React 组件自定义边，你可以在边上添加任何你想要的 React 组件，甚至将原有的边通过样式隐藏，使用 React 重新绘制

```js
import React from "react";
import ReactDOM from "react-dom";
import { BaseEdgeModel, LineEdge, h } from "@logicflow/core";

const DEFAULT_WIDTH = 48;
const DEFAULT_HEIGHT = 32;

class CustomEdgeModel extends BaseEdgeModel {
  getEdgeStyle() {
    const edgeStyle = super.getEdgeStyle();
    //可以自己设置线的显示样式，甚至隐藏掉原本的线，自己用react绘制
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
  getAppend() {
    return h("g", {}, []);
  }
}

export default {
  type: "CustomEdge",
  view: CustomEdgeView,
  model: CustomEdgeModel,
};
```

### 示例

<a href="https://codesandbox.io/embed/affectionate-visvesvaraya-uexl0y?fontsize=14&hidenavigation=1&theme=dark" target="_blank"> 去 CodeSandbox 查看示例</a>

## 保存锚点信息

默认情况下，LogicFlow 只记录节点与节点的信息。但是在一些业务场景下，需要关注到锚点，比如在 UML 类图中的关联关系；或者锚点表示节点的入口和出口之类。这个时候需要重写连线的保存方法，将锚点信息也一起保存。

```js
class CustomEdgeModel2 extends LineEdgeModel {
  /**
   * 重写此方法，使保存数据是能带上锚点数据。
   */
  getData() {
    const data = super.getData();
    data.sourceAnchorId = this.sourceAnchorId;
    data.targetAnchorId = this.targetAnchorId;
    return data;
  }
}
```

<a href="https://codesandbox.io/embed/logicflow-base17-h5pis?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> 去 CodeSandbox 查看示例</a>

## 自定义边文本位置

默认情况下，边上文本的位置是用户双击点击边时的位置。如果是通过 API 的方式给边添加的文本，文本位置按照如下规则。

- line: 起点和终点中间
- polyline: 最长线段中间
- bezier: 起点、终点、调整点中间

LogicFlow 支持开发者自定义文本位置，例如文本位置永远在边起点旁边。定义方式为将属性`customTextPosition`设置为 true, 然后重写`getTextPosition`方法, 此方法发回的坐标就是文本的坐标。

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
        // 垂直
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

### 示例

<a href="https://codesandbox.io/embed/laughing-dream-x3v87?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> 去 CodeSandbox 查看示例</a>

## 给边开启动画

由于 LogicFlow 是基于 svg 的流程图编辑框架，所以我们可以给 svg 添加动画的方式来给流程图添加动画效果。为了方便使用，我们也内置了基础的动画效果。在定义边的时候，可以将属性`isAnimation`设置为 true 就可以让边动起来，也可以使用`lf.openEdgeAnimation(edgeId)`来开启边的默认动画。

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

### 示例

<a href="https://codesandbox.io/embed/suspicious-tree-hw82v8?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> 去 CodeSandbox 查看示例</a>

## 自定义节点之间边的类型

默认情况下，通过从锚点手动连接节点生成的边为初始化`edgeType`指定的类型，也可以通过`lf.setDefaultEdgeType(edgeType)`来指定。但是当需要不同的节点之间连接的边类型不一样时，就只有自定义节点之间边的类型了。

```js
const lf = new LogicFlow({
  ...,
  // 默认边
  edgeType: 'bezier',
  // 移动已有边时会有 currentEdge 信息, 否则为空
  edgeGenerator: (sourceNode, targetNode, currentEdge) => {
    // 起始节点类型 rect 时使用 自定义的边 custom-edge
    if (sourceNode.type === 'rect') return 'custom-edge'
  }
})

```

## 自定义箭头

在`1.1.27`版本后，LogicFlow 支持单独自定义连线两端的箭头。和之前的自定义方式一样，支持通过主题自定义大小等基本数据和通过重写对应的方法实现完全的自定义。

### 主题设置

```js
lf.setTheme({
  arrow: {
    offset: 4, // 箭头垂线长度
    verticalLength: 2, // 箭头底线长度
  },
});
```

### 自定义箭头形状

在自定义连线 view 的时候，可以重写`getEndArrow`和`getStartArrow`方法来实现自定义连线两端的图形，这两个方法可以返回的任意`svg`图形。

这里以通过连线属性中的 arrowType 来控制连线不同的外观为例。

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
      // 空心箭头
      return h("path", {
        ...pathAttr,
        fill: "#FFF",
        d: "M -10 0  -20 -5 -30 0 -20 5 z",
      });
    } else if (arrowType === "half") {
      // 半箭头
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

### 自定义调整点样式

在初始化 LogicFlow 实例的时候,可以通过参数`adjustEdgeStartAndEnd`来开启调整边的起始点和结束点的功能。

在自定义连线 view 的时候，可以重写`getAdjustPointShape`方法来实现自定义调整点的样式。

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

<a href="https://codesandbox.io/embed/logicflow026-edgeanimation-forked-fdg3v0?fontsize=14&hidenavigation=1&theme=dark" target="_blank"> 去 CodeSandbox 查看示例</a>
