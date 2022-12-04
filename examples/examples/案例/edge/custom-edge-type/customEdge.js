class CustomLineModel extends LineEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = 'red';
    style.strokeWidth = 4;
    style.strokeDasharray = '3 3';
    return style;
  }
}

class CustomPolylineModel extends PolylineEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = 'green';
    style.strokeWidth = 4;
    style.strokeDasharray = '3 3';
    return style;
  }
}

class CustomBezierModel extends BezierEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = 'blue';
    style.strokeWidth = 4;
    style.strokeDasharray = '3 3';
    return style;
  }
}

export const customLine = {
  type: 'custom-line-edge',
  view: LineEdge,
  model: CustomLineModel,
}

export const customPolyline = {
  type: 'custom-polyline-edge',
  view: PolylineEdge,
  model: CustomPolylineModel,
}

export const customBezier = {
  type: 'custom-bezier-edge',
  view: BezierEdge,
  model: CustomBezierModel,
}