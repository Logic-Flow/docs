import vueComponent from "./vueComponent.js";

class CustomVueNode extends HtmlNode {
  constructor (props) {
    super(props)
    this.root = document.createElement('div');
    this.vueComponent = vueComponent;
  }

  setHtml(rootEl) {
    rootEl.appendChild(this.root)
    if (this.vm) {
      this.vm.$mount(this.root)
    } else {
      this.vm = new Vue({
        render: (h) => h(this.vueComponent, {
          props: {
            model: this.props.model,
            graphModel: this.props.graphModel,
            properties: this.props.model.properties
          }
        })
      })
      this.vm.$mount(this.root)
    }
  }
}

class CustomVueModel extends HtmlNodeModel {
  setAttributes() {
    this.text.editable = false;
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

export default {
  type: 'vue-node',
  view: CustomVueNode,
  model: CustomVueModel,
}