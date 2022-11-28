class Model extends PolylineEdgeModel {
  initEdgeData(data) {
    super.initEdgeData(data);
  }

  setAttributes() {
    const { startPoint, endPoint } = this;
    const midY = (startPoint.y + endPoint.y) / 2;
    const point1 = {
      x: startPoint.x,
      y: midY,
    };
    const point2 = {
      x: endPoint.x,
      y: midY,
    };
    this.pointsList = [{...startPoint}, point1, point2, {...endPoint}];
    this.points = this.pointsList.map((point) => {
      return `${point.x},${point.y}`;
    }).join(' ');
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = '#0074d9';
    style.strokeWidth = 2;
    return style;
  }
}

export default {
  type: 'organization-edge',
  view: PolylineEdge,
  model: Model,
};

