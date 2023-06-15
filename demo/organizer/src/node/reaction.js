import base from './base'

class ReactionNodeView extends base.view {}

class ReactionNodeModel extends base.model {
  getNodeName () {
    return this.properties.name
  }
  getNodeAbstract () {
    const title = '节点行为'
    const content = []
    if (this.properties && this.properties.reactions && this.properties.reactions.length) {
      this.properties.reactions.forEach(item => {
        content.push({
          desc: item.keyDefine,
          type: 'reaction'
        })
      });
    }
    return {
      title,
      content,
      showButton: true
    }
  }
  getNodeLogo () {
    return this.properties && this.properties.logo
  }
}

export default {
  type: 'reaction-node',
  model: ReactionNodeModel,
  view: ReactionNodeView
}
