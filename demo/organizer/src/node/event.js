import base from './base'
import { eventNodeMap } from '../util/typeMap'

class EventNodeView extends base.view {}

class EventNodeModel extends base.model {
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = 'none';
    style.hover.stroke = 'none';
    return style;
  }
  getDefaultAnchor() {
    const {
      id,
      x,
      y,
      width,
    } = this;
    const anchors = [];
    anchors.push({
      x: x + width / 2,
      y,
      id: `${id}_outgoing`,
      type: "outgoing"
    });
    return anchors;
  }
  getNodeName () {
    if (this.properties && this.properties.event && this.properties.event.keyDefine) {
      return this.properties.name + this.properties.event.keyDefine
    }
    return this.properties.name
  }
  getNodeAbstract () {
    const title = '节点事件'
    const content = []
    let showButton = true
    if (this.properties && this.properties.componentName === 'pageInit') {
      content.push({
        desc: '页面初始化',
        type: 'event'
      })
      showButton = false
    } else if (this.properties.event && this.properties.event.keyDefine) {
      content.push({
        desc: this.properties.event.keyDefine,
        type: 'event'
      })
    }
    return {
      title,
      content,
      showButton,
    }
  }
  getNodeLogo () {
    if (this.properties && this.properties.componentName === 'pageInit') {
      return eventNodeMap.pageInit.logo
    } else {
      return this.properties && this.properties.logo
    }
  }
  getNodeClassName () {
    return 'event'
  }
}

export default {
  type: 'event-node',
  model: EventNodeModel,
  view: EventNodeView
}