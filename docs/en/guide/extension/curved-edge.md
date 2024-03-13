# CurvedEdge

The LogicFlow core package has three built-in base lines: line, polyline, and bezier. Since the polyline of svg does not have rounded corners, we provide the rounded arc CurvedEdge in the extension package.

The use of CurvedEdge is the same as LogicFlow's custom edges, and developers need to inherit the CurvedEdgeModel and CurvedEdge.

```js
import { CurvedEdge, CurvedEdgeModel } from "@logicflow/core";

class myCurvedEdge extends CurvedEdge {}
class myCurvedEdgeModel extends CurvedEdgeModel {
  initEdgeData(data) {
    super.initEdgeData(data);
    this.radius = 5;
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.strokeWidth = 3;
    style.stroke = "rgb(130, 179, 102)";
    return style;
  }
  setAttributes() {
    this.isAnimation = true;
  }
  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle();
    style.strokeDasharray = "15 5";
    style.animationDuration = "10s";
    style.stroke = "rgb(130, 179, 102)";
    return style;
  }
}
```
