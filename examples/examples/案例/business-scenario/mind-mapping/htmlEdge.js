class Model extends BezierEdgeModel {
  initEdgeData(data) {
    super.initEdgeData(data);
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = '#0074d9';
    style.strokeWidth = 2;
    return style;
  }
}

export default {
  type: 'mindmap-edge',
  view: BezierEdge,
  model: Model,
};

