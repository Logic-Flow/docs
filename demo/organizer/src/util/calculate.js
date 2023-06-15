
import { NODE_SPACE_X, NODE_SPACE_Y, GRAPH_START_X, GRAPH_START_Y } from './constant'
/**
 * 根据当前节点位置生成新节点位置
 */
export const genPos = (lf) => {
  const data = lf.getGraphData()
  const { nodes } = data
  const preNode = nodes.slice(-1)[0]
  if (!preNode) return { x: GRAPH_START_X, y: GRAPH_START_Y }
  const x = preNode.x + NODE_SPACE_X
  const y = preNode.y
  return {
    x,
    y
  }
}

/**
 * 生成一条新逻辑的起点
 */
 export const genStartPos = (lf) => {
  const bound = getBoundRect(lf)
  const x = GRAPH_START_X
  const y = bound.maxY === Infinity ? GRAPH_START_Y : bound.maxY + NODE_SPACE_Y
  return { x, y }
}

/**
 * 基于当前节点生成一个节点的位置
 */
 export const genNewNodePos = (lf, nodeModel) => {
    const outgoingNodes = lf.getNodeOutgoingNode(nodeModel.id)
    if (outgoingNodes.length) {
      const bound = getNodesRect(outgoingNodes)
      const x = bound.minX
      const y = bound.maxY + NODE_SPACE_Y
      return {
        x,
        y
      }
    } else {
      return {
        x: nodeModel.x + NODE_SPACE_X,
        y: nodeModel.y
      }
    }
}

/**
 * 获取当前所有节点的边界
 */
 export const getNodesRect = (nodes) => {
  const maxX = nodes.reduce((val, node) => {
    return Math.max(val, node.x)
  }, 0)
  const maxY = nodes.reduce((val, node) => {
    return Math.max(val, node.y)
  }, 0)
  const minX = nodes.reduce((val, node) => {
    return Math.min(val, node.x)
  }, Infinity)
  const minY = nodes.reduce((val, node) => {
    return Math.min(val, node.y)
  }, Infinity)
  return { minX, minY, maxX, maxY }
}

/**
 * 获取当前图形所有节点的边界
 */
 export const getBoundRect = (lf) => {
  const data = lf.getGraphData()
  const { nodes } = data
  const maxX = nodes.reduce((val, node) => {
    return Math.max(val, node.x)
  }, 0)
  const maxY = nodes.reduce((val, node) => {
    return Math.max(val, node.y)
  }, 0)
  const minX = nodes.reduce((val, node) => {
    return Math.min(val, node.x)
  }, Infinity)
  const minY = nodes.reduce((val, node) => {
    return Math.min(val, node.y)
  }, Infinity)
  return { minX, minY, maxX, maxY }
}

/**
 * 生成一个不重复的ID
 * @param { Number } randomLength 
 */
export const genId = (randomLength, prefix) => {
  const pre = prefix || 'logic' + '_'
  return pre + Number(Math.random().toString().substr(2,randomLength) + Date.now()).toString(36)
}



