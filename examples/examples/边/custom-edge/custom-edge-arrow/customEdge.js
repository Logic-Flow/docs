class Connection extends PolylineEdge {
  getEndArrow() {
    const { model, graphModel } = this.props;
    const { id, properties: { arrowType } } = model;
    const { stroke, strokeWidth } = this.getArrowStyle();
    const pathAttr = {
      stroke,
      strokeWidth
    }
    if (arrowType === 'empty') {  // 空心箭头
      return h('path', {
        ...pathAttr,
        fill: '#FFF',
        d: 'M -10 0  -20 -5 -30 0 -20 5 z'
      })
    } else if (arrowType === 'half') { // 半箭头
      return (
        h('path', {
          ...pathAttr,
          d: 'M 0 0 -10 5'
        })
      )
    }
    return h('path', {
      ...pathAttr,
      d: 'M 0 0 -10 -5 -10 5 z'
    })
  }
}

export default {
  type: 'custom-polyline-edge',
  view: Connection,
  model: PolylineEdgeModel,
}