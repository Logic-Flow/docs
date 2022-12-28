class HtmlCard extends HtmlNode {
  // 重写HtmlNode的setHtml，来控制html节点内容。
  setHtml(rootEl) {
    const { properties } = this.props.model;
    const html= `
      ${
        properties.gender === 'male' ? 
        '<img src="https://img-hxy021.didistatic.com/static/starimg/img/7GdwliYTKp1669532392610.png" alt=""  width="60px" height="60px" />' :
        '<img src="https://img-hxy021.didistatic.com/static/starimg/img/6tKEIAgA2k1669532400487.png" alt=""  width="60px" height="60px" />'
      }
      <div class="staff-detail">
        <div class="staff-name">${properties.name}</div>
        <div class="staff-position">${properties.position}</div>
        <div class="staff-department">${properties.department}</div>
      </div>
      ${
        properties.isFold ? `
        <div class="staff-nodenum" onclick="updateNode('${properties.id}', 'expand')">
          ${properties.childNodeNum}
        </div>
        ` : `
        <div class="staff-options">
          <div class="node-delete" onclick="updateNode('${properties.id}', 'fold')">
            <img src="https://img-hxy021.didistatic.com/static/starimg/img/DyFI0DgXJb1669537739785.png" alt=""  width="20px" height="20px" />
          </div>
          <div class="node-add" onclick="updateNode('${properties.id}', 'add')">
            <img src="https://img-hxy021.didistatic.com/static/starimg/img/4YJ5oVGRhF1669467073849.png" alt=""  width="20px" height="20px" />
          </div>
        </div>
        `
      }
    `;
    const el = document.createElement('div');
    el.className = 'mind-mapping-node';
    el.innerHTML = html;
    rootEl.innerHTML = '';
    rootEl.appendChild(el);
    window.updateNode = (id, type) => {
      const { graphModel } = this.props;
      graphModel.eventCenter.emit("custom:node-update", {
        id,
        type,
      });
    };
  }
}

class HtmlCardModel extends HtmlNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 250;
    this.height = 80;
  }

  getDefaultAnchor() {
    const { width, height, x, y, id } = this;
    return [
      {
        x,
        y: y - height / 2 + 11,
        name: 'top',
        id: `${id}_0`
      },
      {
        x,
        y: y + height / 2 - 11,
        name: 'bottom',
        id: `${id}_1`,
        edgeAddable: false
      },
    ]
  }
}

export default {
  type: 'organization-node',
  view: HtmlCard,
  model: HtmlCardModel,
}