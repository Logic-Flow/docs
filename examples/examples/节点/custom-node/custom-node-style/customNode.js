class CustomNodeModel extends RectNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    const { properties } = this;
    this.width = properties.width || 150;
    this.height = properties.height || 80;
  }

  setAttributes() {
    const { x, y, properties } = this;
    const { textHorizontalMove = 0, textVerticalMove = 0 } = properties;
    this.text = {
      ...this.text,
      x: x + textHorizontalMove,
      y: y + textVerticalMove,
    }
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    const { properties } = this;
    style.fill = properties.color || style.fill;
    style.stroke = properties.strokeColor || style.stroke;
    style.strokeWidth = properties.strokeWidth || style.strokeWidth;
    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    const { properties } = this;
    style.color = properties.textColor || style.color;
    style.fontSize = properties.fontSize || style.fontSize;
    return style;
  }
}

export default {
  type: 'custom-node',
  view: RectNode,
  model: CustomNodeModel,
}