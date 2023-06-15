/**
 * 图形操作类：画布新增、插入、删除等操作
 * @class Graph
 * @constructor
 */

 import { genId, genStartPos, genNewNodePos } from './calculate'
 import { NODE_SPACE_Y, NODE_WIDTH, NODE_HEIGHT, GRAPH_START_X, GRAPH_START_Y, EDITOR_EVENT} from './constant'
 import { getNodeName } from './node' 
 import event from '../node/event'
 import logicLine from '../node/logicLine'
 import { eventNodeMap, defaultLogo } from './typeMap'
 import Layout from './layout'
//  import { History } from '@didi/suda-utils'

class Graph {
  constructor (options) {
    this.lf = options.lf
    this.context = options.context
    this.layout = new Layout(this.lf, { // 布局
      rankdir: 'LR',
      align: 'UL',
      nodesep: 2,
      ranksep: 20,
    })
    // this.history = new History() // 操作记录
    this.selectedNodes = []
    this.hoveredNodes = []
    this.addHistory()
  }

  /**
   * 当选中左侧画布组件时，选中逻辑图上对应节点
   */
  selectNodesByModel (model) {
    const componentId = model.id
    const data = this.lf.getGraphData()
    const { nodes } = data
    this.selectedNodes && this.selectedNodes.forEach(nodeModel => {
      nodeModel.setProperties({
        status: 'normal'
      })
    })
    this.selectedNodes = []
    nodes.forEach(node => {
      if (node.properties && node.properties.componentId === componentId) {
        const nodeId = node.id
        const nodeModel = this.lf.getNodeModelById(nodeId)
        nodeModel.setProperties({
          status: 'selected'
        }) 
        this.selectedNodes.push(nodeModel)
      }
    })
  }

 /**
   * 当悬浮左侧画布组件时，高亮逻辑图上响应节点
   */
  hoverNodesByModel (model) {
    const componentId = model.id
    const data = this.lf.getGraphData()
    const { nodes } = data
    nodes.forEach(node => {
      const nodeId = node.id
      const nodeModel = this.lf.getNodeModelById(nodeId)
      if(node.properties && node.properties.componentId === componentId) {
        nodeModel.setProperties({
          status: 'hovered'
        })
      } else {
        if (nodeModel.properties && nodeModel.properties.status === 'selected') return;
        nodeModel.setProperties({
          status: 'normal'
        })
      }
    })
  }

  /**
   * 选中某一节点
   */
  selectNode (seletedModel) {  
    const nodeId = seletedModel.id
    const nodeModel = this.lf.getNodeModelById(nodeId)
    this.selectedNodes && this.selectedNodes.forEach(nodeModel => {
      nodeModel.setProperties({
        status: 'normal'
      })
    })
    this.selectedNodes = []
    nodeModel.setProperties({
      status: 'selected'
    })
    this.selectedNodes.push(nodeModel)
    this.lf.graphModel.eventCenter.emit('node:model-selected', seletedModel)
  }

  /**
   * hover某一节点
   */
   hoverNode (seletedModel) {
    const nodeId = seletedModel.id
    const nodeModel = this.lf.getNodeModelById(nodeId)
    this.hoveredNodes && this.hoveredNodes.forEach(nodeModel => {
      nodeModel.setProperties({
        status: 'normal'
      })
    })
    this.hoveredNodes = []
    nodeModel.setProperties({
      status: 'hovered'
    })
    this.hoveredNodes.push(nodeModel)
    this.lf.graphModel.eventCenter.emit('node:model-selected', seletedModel)
  }

   /**
   * 清空所有节点状态
   */
  clearNodesStatus () {
    this.selectedNodes && this.selectedNodes.forEach(nodeModel => {
      nodeModel.setProperties({
        status: 'normal'
      })
    })
    this.hoveredNodes && this.hoveredNodes.forEach(nodeModel => {
      nodeModel.setProperties({
        status: 'normal'
      })
    })
    this.selectedNodes = []
    this.hoveredNodes = []
  }

  /**
   * 通过拖拽添加节点
   */
  addNodeByDrop (model, e) {
    const { clientX, clientY } = e
    const point = this.lf.graphModel.getPointByClient({ x: clientX - 5, y: clientY - 5 })
    const canvasPoint = point.canvasOverlayPosition
    const id = genId(10)
    const componentName = model.componentName
    const material = this.context.getMaterialByType(componentName)
    const logo = material.logo || defaultLogo
    const x = Math.abs((canvasPoint.x + NODE_WIDTH/2) - GRAPH_START_X) < 50 ? GRAPH_START_X : (canvasPoint.x + NODE_WIDTH/2)
    const y = canvasPoint.y + NODE_HEIGHT/2
    const nodeData = {
      id,
      type: event.type,
      x,
      y,
      properties: {
        name: getNodeName(model),
        componentId: model.id,
        componentName: model.componentName,
        logo,
        item: {
          prop: false
        }
      }
    }
    const node = this.lf.addNode(nodeData)
    this.selectNode(node) // 添加后默认选中该节点
    this.addHistory()
  }
  
  /**
   * 在节点或边后新插入新节点
   */
  insertNode (nodeModel, type, properties) {
    // todo: 几种情况的处理：1.一个节点连出多条边 2.一个节点的入口连入多条边 3.线的回连
    const lf = this.lf
    if (nodeModel.data.type === logicLine.type) { // 如果是基于边插入节点，则在此边之后新增节点
      const edge = nodeModel
      const id = genId(10)
      const node = lf.addNode({ // 在此边的尾端插入一个新节点
        id,
        type,
        x: edge.endPoint.x + NODE_WIDTH / 2, // 75为节点宽度
        y: edge.endPoint.y,
        properties
      })
      const targetNodeId =  edge.data.targetNodeId // 原来此边之后的节点id
      const preEdge = { // 基于此边新建一条边，代替此边，连接新节点
        ...edge.data,
        targetNodeId: id,
        type: logicLine.type
      }
      const nextEdge = { // 新建一条边，连接新节点与原来此边之后的节点
        id: genId(10),
        sourceNodeId: id,
        targetNodeId: targetNodeId,
        type: logicLine.type
      }
      // const targetNode = lf.getNodeModelById(targetNodeId) // 获取原来此边之后的节点model
      // this.shiftNextNodes(targetNode, NODE_SPACE_X) // 移动此边之后的所有节点
      lf.deleteEdge(edge.id) // 删除此边
      lf.addEdge(preEdge)
      lf.addEdge(nextEdge)
      this.layout.layout(node)
      this.selectNode(node) // 添加后默认选中该节点
    } else { // 如果是基于node插入节点，则在此node之后新增一个节点
      const id = genId(10)
      const pos = genNewNodePos(lf, nodeModel)
      const node = lf.addNode({ // 在此边的尾端插入一个新节点
        id,
        type,
        x: pos.x, // 75为节点宽度
        y: pos.y,
        properties
      })
      lf.addEdge({ // 在此边的尾端插入一个新节点
        id: genId(10),
        sourceNodeId: nodeModel.id,
        targetNodeId: id,
        type: logicLine.type
      })
      this.layout.layout(node)
      this.selectNode(node) // 添加后默认选中该节点
    }
    this.addHistory()
  }

  /**
   * 删除选中的节点并自动连接前后节点
   */
   deleteNode (nodeModel) {
    const incommingEdges = this.lf.getNodeIncomingEdge(nodeModel.id)
    const outgoingNodes = this.lf.getNodeOutgoingNode(nodeModel.id)
    const incomingNodes = this.lf.getNodeIncomingNode(nodeModel.id)
    if (outgoingNodes.length && incommingEdges.length) { // 如果有后续节点并且非循环节点
      const edge = incommingEdges[0]
      const node = outgoingNodes[0]
      let newEdge = {
        ...edge.data,
        targetNodeId: node.id
      }
      this.lf.deleteEdge(edge)
      this.addEdge(newEdge)
    } 
    this.lf.deleteNode(nodeModel.id)
    if (incomingNodes.length) {
      this.layout.layout(incomingNodes[0])
    } else if (incomingNodes.length) {
      this.layout.layout(outgoingNodes[0])
    }
    this.addHistory()
  }

  /**
   * 复制选中的节点并放于该节点下方
   */
  copyNode (nodeModel) {
    const { data }= nodeModel
    let x = 0, y = 0
    if (nodeModel.type === event.type) {
      let pos = genStartPos(this.lf)
      x = pos.x
      y = pos.y
    } else {
      x = data.x
      y = data.y + NODE_SPACE_Y
    }
    const newNodeData = {
      ...data,
      id: genId(10),
      x,
      y
    }
    const node = this.lf.addNode(newNodeData)
    this.selectNode(node) // 添加后默认选中该节点
    this.addHistory()
  }
  
  /**
   * 添加边
   */
  addEdge (edgeData) {
    this.lf.addEdge(this.calcPointsList(edgeData))
  }

  /**
   * 连接至已有节点
   */
  connectToNode(id, model) {
    const targetModel = this.lf.graphModel.getNodeModelById(id)
    this.lf.addEdge({ // 在此边的尾端插入一个新节点
      id: genId(10),
      sourceNodeId: model.id,
      targetNodeId: id,
      type: logicLine.type
    })
    this.layout.layout(model)
    this.addHistory()
  }
  
  /**
   * 计算控制点
   */
  calcPointsList (edgeData) {
    const lf = this.lf
    if (!edgeData.pointsList || edgeData.pointsList.length === 0) {
      const startNode = lf.getNodeModelById(edgeData.sourceNodeId)
      const endNode = lf.getNodeModelById(edgeData.targetNodeId)
      // 如果开始节点在结束节点右边，则算一个节点连线
      if (startNode.x > endNode.x) {
        edgeData.pointsList = [
          {
            x: endNode.x + 75,
            y: endNode.y
          },
          {
            x: endNode.x + 75,
            y: endNode.y - 150
          },
          {
            x: startNode.x - 75,
            y: startNode.y
          },
          {
            x: startNode.x - 75,
            y: startNode.y - 150
          }
        ]
      }
    }
    return edgeData
  }
  
  /**
   * 某节点后插入新节点时，移动后续所有节点位置
   */
  shiftNextNodes (nodeModel, dx) {
    // todo: 考虑线的回连情况
    const lf = this.lf
    nodeModel.x = nodeModel.x + dx
    const outgoingNodes = lf.getNodeOutgoingNode(nodeModel.id)
    const outgoingEdges = lf.getNodeOutgoingEdge(nodeModel.id)
    if (outgoingNodes.length) {
      outgoingNodes.forEach((model) => {
        this.shiftNextNodes(model, dx)
      })
    }
    if (outgoingEdges.length) {
      outgoingEdges.forEach((edge) => {
        const { data } = edge
        const newEdge = data
        lf.deleteEdge(edge.id)
        this.addEdge(newEdge)
      })
    }
  }
  
  /**
   * 判断是否为循环节点
   */
  isLoopNode (nodeModel, nodeId) {
    const outgoingNodes = this.lf.getNodeOutgoingNode(nodeModel.id)
    if (outgoingNodes.length) {
      for (let i = 0; i < outgoingNodes.length; i++) {
        const model = outgoingNodes[i]
        if (model.id === nodeId) {
          return true
        }
        return this.isLoopNode(model, nodeId)
      }
    } 
    return false
  }

  /**
   * 添加初始化节点
   */
  addInitNode() {
    const { x, y } = genStartPos(this.lf)
    const node = this.lf.addNode({
      id: genId(10, 'init_'),
      type: event.type,
      x,
      y,
      properties: {
        componentId: 'page_init',
        componentName: 'pageInit',
        name: '页面初始化',
        logo: eventNodeMap.pageInit.logo
      }
    })
    this.selectNode(node) // 添加后默认选中该节点
    return node
  }

  initView() {
    const { nodes} = this.lf.getGraphData()
    const rect = this.layout.getNodesRect(nodes)
    this.lf.graphModel.transformModel.translate(-rect.minX + GRAPH_START_X, -rect.minY + GRAPH_START_Y)
  }

  /**
   * 增加历史记录
   */
  addHistory() {
    const graphData = this.lf.getGraphData()
    // this.history.add(graphData)
    // this.context.eventCenter.emit(EDITOR_EVENT.LOGIC_HISTORY_CHANGE, {
    //   canUndo: this.history.canUndo,
    //   canRedo: this.history.canRedo
    // })
  }

  /**
   * 撤销
   */
  undo() {
    // const canUndo = this.history.canUndo
    // if (canUndo) {
    //   const data = this.history.undo()
    //   data && this.lf.render(data)
    // }
    // this.context.eventCenter.emit(EDITOR_EVENT.LOGIC_HISTORY_CHANGE, {
    //   canUndo: this.history.canUndo,
    //   canRedo: this.history.canRedo
    // })
  }

  /**
   * 重做
   */
  redo() {
    // const canRedo = this.history.canRedo
    // if (canRedo) {
    //   const data = this.history.redo()
    //   data && this.lf.render(data)
    // }
    // this.context.eventCenter.emit(EDITOR_EVENT.LOGIC_HISTORY_CHANGE, {
    //   canUndo: this.history.canUndo,
    //   canRedo: this.history.canRedo
    // })
  }
}

export default Graph
