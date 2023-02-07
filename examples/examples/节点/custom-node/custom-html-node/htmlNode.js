class CustomHtmlNodeModel extends HtmlNodeModel {
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

class CustomHtmlNode extends HtmlNode {
  setHtml(rootEl) {
    const { properties } = this.props.model;
  
    const el = document.createElement('div');
    el.className = 'uml-wrapper';
    const html = `
      <div>
        <div class="uml-head">Head</div>
        <div class="uml-body">
          <div><button onclick="setData()" onmousedown="stop(arguments[0])">+</button> ${properties.name}</div>
          <div>${properties.body}</div>
        </div>
        <div class="uml-footer">
          <div>setHead(Head $head)</div>
          <div>setBody(Body $body)</div>
        </div>
      </div>
    `
    el.innerHTML = html;
    // 需要先把之前渲染的子节点清除掉。
    rootEl.innerHTML = '';
    rootEl.appendChild(el);
    window.stop = (ev) => {
      ev.stopPropagation();
    };
    window.setData = () => {
      const { graphModel, model } = this.props;
      graphModel.eventCenter.emit("custom:button-click", model);
    };
  }
}

export default {
  type: 'html-node',
  view: CustomHtmlNode,
  model: CustomHtmlNodeModel,
}