const textMove = (model) => {
  const { properties } = model;
  const { textHorizontalMove = 0, textVerticalMove = 0 } = properties;
  model.text = {
    ...model.text,
    x: model.text.x + textHorizontalMove,
    y: model.text.y + textVerticalMove,
  }
  model.isAnimation = properties.isAnimation;
}

const changeEdgeStyle = (model, style) => {
  const { properties } = model;
  style.stroke = properties.strokeColor || style.stroke;
  style.strokeWidth = properties.strokeWidth || style.strokeWidth;
  return style;
}

const changeTextStyle = (model, style) => {
  const { properties } = model;
  style.color = properties.textColor || style.color;
  style.fontSize = properties.fontSize || style.fontSize;
  return style;
}

const changeAnimationStyle = (style) => {
  style.strokeDasharray = "5 5";
  style.animationDuration = "10s";
  return style;
}

class CustomLineModel extends LineEdgeModel {

  setAttributes() {
    textMove(this);
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle();
    return changeEdgeStyle(this, style);
  }

  getTextStyle() {
    const style = super.getTextStyle();
    return changeTextStyle(this, style);
  }

  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle();
    return changeAnimationStyle(style);
  }
}

class CustomBezierModel extends BezierEdgeModel {

  setAttributes() {
    textMove(this);
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle();
    return changeEdgeStyle(this, style);
  }

  getTextStyle() {
    const style = super.getTextStyle();
    return changeTextStyle(this, style);
  }

  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle();
    return changeAnimationStyle(style);
  }
}

class CustomPolylineModel extends PolylineEdgeModel {

  setAttributes() {
    textMove(this);
  }

  getEdgeStyle() {
    const style = super.getEdgeStyle();
    return changeEdgeStyle(this, style);
  }

  getTextStyle() {
    const style = super.getTextStyle();
    return changeTextStyle(this, style);
  }

  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle();
    return changeAnimationStyle(style);
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