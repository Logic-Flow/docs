const nodeStyle = {
  'centerTheme': 'center-theme',
  'branchTheme': 'branch-theme',
  'childTheme': 'child-theme',
};

class HtmlCard extends HtmlNode {
  // 重写HtmlNode的setHtml，来控制html节点内容。
  setHtml(rootEl) {
    const { properties } = this.props.model;
    const html= `
      <div class="node-add" onclick="addChildNode('${properties.id}', '${properties.properties.type}', 'left')">
        ${(properties.side === 'left' || !properties.side) ? `<img src="https://img-hxy021.didistatic.com/static/starimg/img/4YJ5oVGRhF1669467073849.png" alt=""  width="20px" height="20px" />` : ''}
       </div>
      <div class="${nodeStyle[properties.type]}">
      </div>
      <div class="node-add" onclick="addChildNode('${properties.id}', '${properties.properties.type}', 'right')">
        ${(properties.side === 'right' || !properties.side) ? `<img src="https://img-hxy021.didistatic.com/static/starimg/img/4YJ5oVGRhF1669467073849.png" alt=""  width="20px" height="20px" />` : ''}
      </div>
    `;
    const el = document.createElement('div');
    el.className = 'mind-mapping-node';
    el.innerHTML = html;
    rootEl.innerHTML = '';
    rootEl.appendChild(el);
    window.addChildNode = (id, type, side) => {
      const { graphModel } = this.props;
      graphModel.eventCenter.emit("custom:node-add", {
        id,
        type,
        side,
      });
    };
  }
}

class HtmlCardModel extends HtmlNodeModel {
  initNodeData(data) {
    if (data.properties.type === 'childTheme' && (!data.text || typeof data.text === 'string')) {
      data.text = {
        value: data.text || "",
        x: data.x,
        y: data.y - 15,
      };
    }
    super.initNodeData(data);
    switch (this.properties.type) {
      case 'centerTheme':
        this.width = 200;
        this.height = 60;
        break;
      case 'branchTheme':
        this.width = 200;
        this.height = 40;
        break;
      case 'childTheme':
        this.width = 200;
        this.height = 40;
        break;
      default:
        break;
    }
  }

  getDefaultAnchor() {
    const { width, height, x, y, id } = this;
    return [
      {
        x: x - width / 2 + 40,
        y,
        name: 'left',
        id: `${id}_0`
      },
      {
        x: x + width / 2 - 40,
        y,
        name: 'right',
        id: `${id}_1`,
        edgeAddable: false
      },
    ]
  }

  getTextStyle() {
    const style = super.getTextStyle();
    switch (this.properties.type) {
      case 'centerTheme':
        style.color = 'white';
        style.fontSize = 16;
        break;
      case 'branchTheme':
        style.fontSize = 14;
        break;
      case 'childTheme':
        style.fontSize = 12;
        break;
      default:
        break;
    }
    return style;
  }
}

export default {
  type: 'mindmap-node',
  view: HtmlCard,
  model: HtmlCardModel,
}