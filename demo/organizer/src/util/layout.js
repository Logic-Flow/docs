/**
 * 图形布局类：计算节点位置，避免重叠
 * @class Layout
 * @constructor
 */

import { DagreLayout } from '@antv/layout'
import { PATH_SPACE_Y } from './constant'

class Layout {
  constructor (lf, option = {}) {
    this.option = option
    this.lf = lf
    this.paths = [] // 所有路径
    this.targetPath = {}  // 当前路径
    this.targetNode = {} // 当前节点
    this.targetStartNode = {}
    this.targetPathIndex = undefined
    this.nodeMap = {}
    this.edgeMap = {}
  }

  reset () {
    this.paths = []
    this.targetPath = {}
    this.targetNode = {}
    this.targetStartNode = {}
    this.targetPathIndex = undefined
    this.nodeMap = {}
    this.edgeMap = {}
  }

  getBytesLength (word) {
    if (!word) {
      return 0;
    }
    let totalLength = 0;
    for (let i = 0; i < word.length; i++) {
      const c = word.charCodeAt(i);
      if ((word.match(/[A-Z]/))) {
        totalLength += 1.5;
      } else if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        totalLength += 1;
      } else {
        totalLength += 2;
      }
    }
    return totalLength;
  }

  /**
   * option: {
   *   rankdir: "TB", // layout 方向, 可选 TB, BT, LR, RL
   *   align: undefined, // 节点对齐方式，可选 UL, UR, DL, DR
   *   nodeSize: undefined, // 节点大小
   *   nodesepFunc: undefined, // 节点水平间距(px)
   *   ranksepFunc: undefined, // 每一层节点之间间距
   *   nodesep: 40, // 节点水平间距(px) 注意：如果有grid，需要保证nodesep为grid的偶数倍
   *   ranksep: 40, // 每一层节点之间间距 注意：如果有grid，需要保证ranksep为grid的偶数倍
   *   controlPoints: false, // 是否保留布局连线的控制点
   *   radial: false, // 是否基于 dagre 进行辐射布局
   *   focusNode: null, // radial 为 true 时生效，关注的节点
   * };
   */

  layout(node = {}, option = {}) {
    this.reset()
    this.targetNode = node
    this.getPaths(node)
    this.paths.forEach((item, index)=> {
      if(item.startNode === this.targetStartNode) {
        this.targetPath = item
        this.targetPathIndex = index
      }
    })
    const layoutData = this.getLayoutData(this.targetPath, option)
    const newGraphData = {
      nodes: [],
      edges: [],
    };
    layoutData.nodes.forEach(node => {
      // @ts-ignore: pass node data
      const { model } = node;
      const data = model.getData();
      // @ts-ignore: pass node data
      data.x = node.x;
      // @ts-ignore: pass node data
      data.y = node.y;
      newGraphData.nodes.push(data);
    });
    layoutData.edges.forEach(edge => {
      // @ts-ignore: pass edge data
      const { model } = edge;
      const data = model.getData();
      newGraphData.edges.push(data);
    });
    const targetPathRect = this.getNodesRect(newGraphData.nodes)
    // 当前路径的所有上方路径保持不变
    this.paths.forEach((path, index) => { 
      if (index < this.targetPathIndex) { 
        path.nodes.forEach(node => {
          const data = node.getData()
          newGraphData.nodes.push(data)
        })
        newGraphData.edges.push(...path.edges)
      }
    })
    // 当前路径的下方路径判断重叠
    const nextPath = this.paths[this.targetPathIndex + 1]
    if (nextPath) {
      if (this.isOverlap(nextPath.rect, targetPathRect)) { // 有重叠,所有下方节点下移
        const deltaY = targetPathRect.maxY - nextPath.rect.minY + PATH_SPACE_Y
        this.paths.forEach((path, index) => { 
          if (index > this.targetPathIndex) { 
            path.nodes.forEach(node => {
              const data = node.getData()
              data.y = data.y + deltaY
              newGraphData.nodes.push(data)
            })
            newGraphData.edges.push(...path.edges)
          }
        })
      } else { // 无重叠，保持不变
        this.paths.forEach((path, index) => { 
          if (index > this.targetPathIndex) { 
            path.nodes.forEach(node => {
              const data = node.getData()
              newGraphData.nodes.push(data)
            })
            newGraphData.edges.push(...path.edges)
          }
        })
      }
    }
    const newEdges = []
    newGraphData.edges.forEach(edge => {
      // @ts-ignore: pass edge data
      const model = this.lf.getEdgeModelById(edge.id)
      const data = model.getData();
      data.pointsList = this.calcPointsList(model, newGraphData.nodes);
      if (data.pointsList) {
        const first = data.pointsList[0];
        const last = data.pointsList[data.pointsList.length - 1];
        data.startPoint = { x: first.x, y: first.y };
        data.endPoint = { x: last.x, y: last.y };
        if (data.text && data.text.value) {
          data.text = {
            x: last.x - this.getBytesLength(data.text.value) * 6 - 10,
            y: last.y,
            value: data.text.value,
          };
        }
      } else {
        data.startPoint = undefined;
        data.endPoint = undefined;
        if (data.text && data.text.value) {
          data.text = data.text.value;
        }
      }
      newEdges.push(data);
    });
    newGraphData.edges = newEdges
    this.lf.render(newGraphData);
  }

  isOverlap(rect1, rect2) {
    return !(rect2.maxY < rect1.minY || rect1.maxY < rect2.minY || rect1.minX > rect2.maxX || rect2.minX > rect1.maxX)
  }

  getLayoutData (path, option = {}) {
    let nodesep = 40;
    let ranksep = 40;
    this.option = {
      type: 'dagre',
      rankdir: 'LR',
      align: 'DR',
      nodesep,
      ranksep,
      ...this.option,
      ...option,
      begin: [path.startNode.x, path.startNode.y],
    };
    const layoutInstance = new DagreLayout(this.option);
    const { nodes } = path
    // 过滤出连接至另一条路径的边
    const pathNodeMap = {}
    nodes.forEach(node => {
      pathNodeMap[node.id] = node
    })
    const spEdges = path.edges.filter(item => !pathNodeMap[item.targetNodeId])
    const edges = path.edges.filter(item => pathNodeMap[item.targetNodeId])
    const layoutData = layoutInstance.layout({
      nodes: nodes.map((node) => ({
        id: node.id,
        size: {
          width: node.width,
          height: node.height,
        },
        model: node,
      })),
      edges: edges.map((edge) => ({
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
        model: edge,
      })),
    });
    const spEdgesData = spEdges.map((edge) => ({
      source: edge.sourceNodeId,
      target: edge.targetNodeId,
      model: edge,
    }))
    layoutData.edges.push(...spEdgesData)
    return layoutData
  }

  getPaths () {
    const { nodes, edges, gridSize } = this.lf.graphModel;
    const startNodes = nodes.filter(item => item.type === 'event-node')
    startNodes.sort((a,b) => a.y - b.y)
    const paths = []
    startNodes.forEach((startNode) => {
      const path =  this.getPath(startNode)
      const nodes = path.nodes
      path.startNode = startNode
      path.start = [startNode.x, startNode.y]
      const rect = this.getNodesRect (nodes)
      path.rect = rect
      paths.push(path)
    })
    this.paths = paths
    return paths
  }

  getPath (startNode) {
    const nodes = [], edges = []
    nodes.push(startNode)
    const find = (model) => {
      const outgoingNodes = this.lf.getNodeOutgoingNode(model.id)
      const outgoingEdges = this.lf.getNodeOutgoingEdge(model.id)
      if (outgoingNodes.length) {
        outgoingNodes.forEach((node) => {
          if (!this.nodeMap[node.id]) {
            nodes.push(node)
            this.nodeMap[node.id]= node
            find(node)
          }
        })
        outgoingEdges.forEach((edge) => {
          if (!this.edgeMap[edge.id]) {
            edges.push(edge)
            this.edgeMap[edge.id]= edge
          }
        })
      }
    }
    find(startNode)
    nodes.forEach(node => {
      if (node.id === this.targetNode.id) {
        this.targetStartNode = startNode
      }
    })
    return {
      nodes,
      edges
    }
  }

  getNodesRect (nodes) {
    const maxX = nodes.reduce((val, node) => {
      return Math.max(val, node.x)
    }, -Infinity)
    const maxY = nodes.reduce((val, node) => {
      return Math.max(val, node.y)
    }, -Infinity)
    const minX = nodes.reduce((val, node) => {
      return Math.min(val, node.x)
    }, Infinity)
    const minY = nodes.reduce((val, node) => {
      return Math.min(val, node.y)
    }, Infinity)
    return { minX, minY, maxX, maxY }
  }

  pointFilter(points) {
    const allPoints = points;
    let i = 1;
    while (i < allPoints.length - 1) {
      const pre = allPoints[i - 1];
      const current = allPoints[i];
      const next = allPoints[i + 1];
      if ((pre.x === current.x && current.x === next.x)
        || (pre.y === current.y && current.y === next.y)) {
        allPoints.splice(i, 1);
      } else {
        i++;
      }
    }
    return allPoints;
  }

  calcPointsList(model, nodes) {
    // 在节点确认从左向右后，通过计算来保证节点连线清晰。
    // TODO: 避障
    const pointsList = [];
    const offset = model.offset || 50
    if (this.option.rankdir === 'LR' && model.modelType === 'polyline-edge') {
      const sourceNodeModel = this.lf.getNodeModelById(model.sourceNodeId);
      const targetNodeModel = this.lf.getNodeModelById(model.targetNodeId);
      const newSourceNodeData = nodes.find(node => node.id === model.sourceNodeId);
      const newTargetNodeData = nodes.find(node => node.id === model.targetNodeId);
      if (newSourceNodeData.x < newTargetNodeData.x) {
        if (newSourceNodeData.y > newTargetNodeData.y) {
          pointsList.push({
            x: newSourceNodeData.x + sourceNodeModel.width / 2,
            y: newSourceNodeData.y,
          });
          pointsList.push({
            x: newTargetNodeData.x - targetNodeModel.width / 2 - offset,
            y: newSourceNodeData.y,
          });
          pointsList.push({
            x: newTargetNodeData.x - targetNodeModel.width / 2 - offset,
            y: newTargetNodeData.y,
          });
          pointsList.push({
            x: newTargetNodeData.x - targetNodeModel.width / 2,
            y: newTargetNodeData.y,
          });
        } else {
          pointsList.push({
            x: newSourceNodeData.x + sourceNodeModel.width / 2,
            y: newSourceNodeData.y,
          });
          pointsList.push({
            x: newSourceNodeData.x + sourceNodeModel.width / 2 + offset,
            y: newSourceNodeData.y,
          });
          pointsList.push({
            x: newSourceNodeData.x + sourceNodeModel.width / 2 + offset,
            y: newTargetNodeData.y,
          });
          pointsList.push({
            x: newTargetNodeData.x - targetNodeModel.width / 2,
            y: newTargetNodeData.y,
          });
        }
        return this.pointFilter(pointsList);
      }
      // 向回连线
      if (newSourceNodeData.x > newTargetNodeData.x) {
        if (newSourceNodeData.y >= newTargetNodeData.y) {
          pointsList.push({
            x: newSourceNodeData.x + sourceNodeModel.width / 2,
            y: newSourceNodeData.y,
          });
          pointsList.push({
            x: newSourceNodeData.x + sourceNodeModel.width / 2 + offset,
            y: newSourceNodeData.y,
          });
          pointsList.push({
            x: newSourceNodeData.x + sourceNodeModel.width / 2 + offset,
            y: newTargetNodeData.y + offset,
          });
          pointsList.push({
            x: newTargetNodeData.x - targetNodeModel.width / 2 - offset,
            y: newTargetNodeData.y + offset,
          });
          pointsList.push({
            x: newTargetNodeData.x - targetNodeModel.width / 2 - offset,
            y: newTargetNodeData.y,
          });
          pointsList.push({
            x: newTargetNodeData.x - targetNodeModel.width / 2,
            y: newTargetNodeData.y,
          });
        } else {
          pointsList.push({
            x: newSourceNodeData.x,
            y: newSourceNodeData.y - sourceNodeModel.height / 2,
          });
          pointsList.push({
            x: newSourceNodeData.x,
            y: newSourceNodeData.y - sourceNodeModel.height / 2 - offset,
          });
          pointsList.push({
            x: newTargetNodeData.x,
            y: newSourceNodeData.y - sourceNodeModel.height / 2 - offset,
          });
          pointsList.push({
            x: newTargetNodeData.x,
            y: newTargetNodeData.y - targetNodeModel.height / 2,
          });
        }
        return this.pointFilter(pointsList);
      }
    }
    return undefined;
  }
}

export default Layout