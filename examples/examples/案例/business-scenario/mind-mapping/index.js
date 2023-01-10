import miniMapNode from "./htmlCard.js";
import miniMapEdge from './htmlEdge.js';

// logicflow流程图配置
const LFConfig = {
  edgeTextDraggable: false,
  adjustEdgeMiddle: true,
  hoverOutline: false,
  nodeSelectedOutline: false,
  adjustNodePosition: false,
  hideAnchors: true,
  background: {
    backgroundImage:
            "url('https://dpubstatic.udache.com/static/dpubimg/805efa14-d908-4332-a7a2-bee8fbb903e3.jpg')",
    backgroundRepeat: 'repeat',
  },
  grid: {
    size: 1,
    visible: false,
  },
  style: {
    edgeText: {
      background: {
        fill: '#F7F7F7',
      },
      hoverBackground: {
        fill: '#F7F7F7',
      },
    },
  },
};

// 引入菜单插件
LogicFlow.use(Menu);

const container = document.querySelector('#container');
const lf = new LogicFlow({
  ...LFConfig,
  // 容器
  container,
  // 指定画布区域的宽高，默认使用容器宽高
  width: 1000,
  height: 1000,
});

lf.register(miniMapNode);
lf.register(miniMapEdge);

lf.extension.menu.setMenuConfig({
  nodeMenu: [
    {
      text: '删除',
      callback(node) {
        deleteNode(baseData, node.properties.id);
        renderData(baseData);
      },
    },
  ], // 覆盖默认的节点右键菜单
  edgeMenu: false, // 删除默认的边右键菜单
  graphMenu: [],  // 覆盖默认的画布右键菜单，与false表现一样
});

lf.setTheme({ 
  arrow: {
    offset: 0, // 箭头垂线长度
    verticalLength: 0, // 箭头底线长度
  }
});

let enterNode = null;

// 鼠标移入节点显示按钮
lf.on('node:mouseenter', ({e}) => {
  enterNode = e.target;
  for (let index = 0; index < e.target.children.length; index++) {
    const element = e.target.children[index];
    if (element.className === 'staff-options') {
      element.style.visibility = 'visible';
    }
  }
});

// 鼠标离开节点隐藏按钮
lf.on('node:mouseleave', (e) => {
  for (let index = 0; index < enterNode.children.length; index++) {
    const element = enterNode.children[index];
    if (element.className === 'staff-options') {
      element.style.visibility = 'hidden';
    }
  }
});

// 初始节点数据
const baseData =  {
  id: '1',
  type: 'html-card',
  properties: {
    type: 'centerTheme',
    leftFold: false,
    rightFold: false,
  },
  text: '中心主题',
  children: [
    {
      side: 'right',
      id: '2',
      type: 'html-card',
      properties: {
        type: 'branchTheme',
        rightFold: false,
      },
      text: '分支主题1',
      children: [
        {
          side: 'right',
          id: '4',
          type: 'html-card',
          properties: {
            type: 'childTheme',
            rightFold: false,
          },
          text: '子主题1',
        },
        {
          side: 'right',
          id: '5',
          type: 'html-card',
          properties: {
            type: 'childTheme',
            rightFold: false,
          },
          text: '子主题2',
        }
      ]
    },
    {
      side: 'right',
      id: '3',
      type: 'html-card',
      properties: {
        type: 'branchTheme',
        rightFold: false,
      },
      text: '分支主题2',
    }
  ]
};

// 分支主题编号
let branchThemeOrder = 2;
// 子主题编号
let childTheme = 2;

// 注册节点添加事件
lf.on('custom:node-add', ({id, type, side}) => {
  addChildNode(baseData, id, type, side, baseData);
  renderData(baseData);
});

// 注册节点折叠事件
lf.on('custom:node-fold', ({id, side}) => {
  foldChildNode(baseData, id, side);
  renderData(baseData);
});

// 注册节点展开事件
lf.on('custom:node-expand', ({id, side}) => {
  expandChildNode(baseData, id, side);
  renderData(baseData);
});

/**
 * 为指定的节点添加子节点
 * @param {Object} baseData 节点数据
 * @param {String} id 当前节点ID
 * @param {String} type 当前节点类型
 * @param {String} side 当前节点方向
 * @param {Object} soriginBaseDatade 初始节点数据
 */
const addChildNode = (baseData, id, type, side, originBaseData) => {
  if (baseData.id === id) {
    baseData.children = baseData.children ? [
      ...baseData.children,
      {
        side,
        id: `${Math.round(Math.random() * 10000)}`,
        type: 'html-card',
        properties: {
          type: childType[type],
        },
        text: `${type === 'centerTheme' ? `分支主题${branchThemeOrder += 1}` :
         `子主题${childTheme += 1}`}`,
      }
    ] : [
      {
        side,
        id: `${Math.round(Math.random() * 10000)}`,
        type: 'html-card',
        properties: {
          type: childType[type],
        },
        text: `${type === 'centerTheme' ? `分支主题${branchThemeOrder += 1}` :
         `子主题${childTheme += 1}`}`,
      }
    ];
    return;
  }
  if (baseData.children && baseData.children.length) {
    baseData.children.forEach((node) => {
      addChildNode(node, id, type, side, baseData);
    });
  }
};

// 当前节点的子节点类型
const childType = {
  'centerTheme': 'branchTheme',
  'branchTheme': 'childTheme',
  'childTheme': 'childTheme',
}

/**
 * 删除指定的节点及其子节点
 * @param {Object} baseData 节点数据
 * @param {String} id 当前节点ID
 * @param {Object} parent 当前节点父节点
 * @param {Number} nodeIndex 当前节点索引
 */
const deleteNode = (baseData, id, parent, nodeIndex) => {
  if (baseData.id === id) {
    if (!parent) {
      alert('根节点不能删除');
      return;
    }
    parent.children.splice(nodeIndex, 1);
    return;
  }
  if (baseData.children && baseData.children.length) {
    baseData.children.forEach((node, index) => {
      deleteNode(node, id, baseData, index);
    });
  }
};

/**
 * 折叠指定节点的子节点
 * @param {Object} baseData 节点数据
 * @param {String} id 当前节点ID
 * @param {String} side 折叠方向
 */
const foldChildNode = (baseData, id, side) => {
  if (baseData.id === id) {
    if (side === 'left') {
      baseData.properties.leftFold = true;
      baseData.properties.leftChildNodeNum = getChildNodeNum(baseData, id, side);
    } else {
      baseData.properties.rightFold = true;
      baseData.properties.rightChildNodeNum = getChildNodeNum(baseData, id, side);
    }
    return;
  }
  if (baseData.children && baseData.children.length) {
    baseData.children.forEach((node) => {
      foldChildNode(node, id, side);
    });
  }
}

// 递归获取当前节点孩子节点数量
const getChildNodeNum = (baseData, id, side) => {
  let nodeNum = 0;
  if (baseData.children && baseData.children.length) {
    baseData.children.forEach((node) => {
      if (node.side === side) {
        nodeNum += getChildNodeNum(node, id, side) + 1;
      }
    });
  }
  return nodeNum;
}

/**
 * 展开指定节点的子节点
 * @param {Object} baseData 节点数据
 * @param {String} id 当前节点ID
 * @param {String} side 折叠方向
 */
const expandChildNode = (baseData, id, side) => {
  if (baseData.id === id) {
    if (side === 'left') {
      baseData.properties.leftFold = false;
    } else {
      baseData.properties.rightFold = false;
    }
    return;
  }
  if (baseData.children && baseData.children.length) {
    baseData.children.forEach((node) => {
      expandChildNode(node, id, side);
    });
  }
};

// 节点平移
const moveX = 400;
const moveY = 300;

// 图数据渲染
const renderData = (baseData) => {
  // baseData中折叠的子节点不参与渲染
  const exclueFoldNodes = (data) => {
    const newChildren = [];
    if (data.children) {
      data.children.forEach((item) => {
        // 左侧节点且未折叠
        if (item.side === 'left' && !data.properties.leftFold) {
          const newItem = exclueFoldNodes(item);
          newChildren.push(newItem);
        }
        // 右侧节点且未折叠
        if (item.side === 'right' && !data.properties.rightFold) {
          const newItem = exclueFoldNodes(item);
          newChildren.push(newItem);
        }
      });
    }
    return {
      ...data,
      children: newChildren,
    };
  };
  // 节点布局
  const miniMapData = window.Hierarchy.mindmap(exclueFoldNodes(baseData), {
    getSide(d) {
      return d.data.side || 'right';
    },
    direction: 'H',
    getHGap() {
      return 130;
    },
    getVGap() {
      return 20;
    },
  });

  // 将布局后的数据转换成LogicFlow所需的图数据
  const tansferNodes = (node, parent) => {
    const nodes = [];
    const edges = [];
    const curNode = {
      id: `node_${node.data.id}`,
      x: node.x + moveX,
      y: node.y + moveY,
      type: 'mindmap-node',
      properties: {
        ...node.data,
        ...node.data.properties,
      },
      text: node.data.text,
    };
    nodes.push(curNode);
    if (parent) {
      edges.push({
        id: `edge_${node.data.id}_${parent.properties.id}`,
        sourceNodeId: parent.id,
        targetNodeId: curNode.id,
        type: 'mindmap-edge',
      });
    }
    if (node.children && node.children.length) {
      node.children.forEach((childNode) => {
        const graphData = tansferNodes(childNode, curNode);
        nodes.push(...graphData.nodes);
        edges.push(...graphData.edges);
      });
    }
    return {
      nodes,
      edges,
    };
  };

  const graphData = tansferNodes(miniMapData);
  // 渲染
  lf.render(graphData);
}

renderData(baseData);