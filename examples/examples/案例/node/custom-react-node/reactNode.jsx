import Hello from "./reactComponent.js";

class CustomReactNodeModel extends HtmlNodeModel {
  setAttributes() {
    this.text.editable = false; // 禁止节点文本编辑
    // 设置节点宽高和锚点
    const width = 200;
    const height = 130;
    this.width = width;
    this.height = height;
    this.anchorsOffset = [
      [width / 2, 0],
      [0, height / 2],
      [-width / 2, 0],
      [0, -height/2],
    ]
  }
}

class CustomReactNode extends HtmlNode {
  setHtml(rootEl) {
    const { properties } = this.props.model;
    ReactDOM.render(
      <Hello
        name={properties.name}
        body={properties.body}
        graphModel={this.props.graphModel}
        model={this.props.model}
      />,
      rootEl
    );
  }
}

export default {
  type: 'react-node',
  view: CustomReactNode,
  model: CustomReactNodeModel,
}