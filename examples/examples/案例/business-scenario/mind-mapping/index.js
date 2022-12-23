import miniMapNode from "./htmlCard.js";
import miniMapEdge from './htmlEdge.js';

// logicflow流程图配置
const LFConfig = {
  edgeTextDraggable: true,
  adjustEdgeMiddle: true,
  hoverOutline: false,
  nodeSelectedOutline: false,
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
  keyboard: {
    enabled: true,
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

lf.setTheme({ 
  arrow: {
    offset: 0, // 箭头垂线长度
    verticalLength: 0, // 箭头底线长度
  }
});

let enterNode = null;

lf.on('node:mouseenter', ({e}) => {
  enterNode = e.target;
  for (let index = 0; index < e.target.children.length; index++) {
    const element = e.target.children[index];
    if (element.className === 'node-add') {
      element.style.visibility = 'visible';
    }
  }
});

lf.on('node:mouseleave', (e) => {
  for (let index = 0; index < enterNode.children.length; index++) {
    const element = enterNode.children[index];
    if (element.className === 'node-add') {
      element.style.visibility = 'hidden';
    }
  }
});

const baseData =  {
  id: '1',
  type: 'html-card',
  properties: {
    type: 'centerTheme',
  },
  text: '中心主题',
  children: [
    {
      side: 'right',
      id: '2',
      type: 'html-card',
      properties: {
        type: 'branchTheme',
      },
      text: '分支主题1',
      children: [
        {
          side: 'right',
          id: '4',
          type: 'html-card',
          properties: {
            type: 'childTheme',
          },
          text: '子主题1',
        },
        {
          side: 'right',
          id: '5',
          type: 'html-card',
          properties: {
            type: 'childTheme',
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
      },
      text: '分支主题2',
    }
  ]
};

lf.on('custom:node-add', ({id, type, side}) => {
  addChildNode(baseData, id, type, side, baseData);
  renderData(baseData);
});

const addChildNode = (baseData, id, type, side, originBaseData) => {
  if (baseData.id === id) {
    baseData.children = baseData.children ? [
      ...baseData.children,
      {
        side,
        id: `${lf.graphModel.nodes.length + 1}`,
        type: 'html-card',
        properties: {
          type: childType[type],
        },
        text: `${type === 'centerTheme' ? `分支主题${baseData.children.length + 1}` :
         `子主题${lf.graphModel.nodes.length - originBaseData.children.length}`}`,
      }
    ] : [
      {
        side,
        id: `${lf.graphModel.nodes.length + 1}`,
        type: 'html-card',
        properties: {
          type: childType[type],
        },
        text: `${type === 'centerTheme' ? `分支主题${baseData.children.length + 1}` :
         `子主题${lf.graphModel.nodes.length - originBaseData.children.length}`}`,
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

const childType = {
  'centerTheme': 'branchTheme',
  'branchTheme': 'childTheme',
  'childTheme': 'childTheme',
}

// 节点平移
const moveX = 400;
const moveY = 300;

const renderData = (baseData) => {
  const miniMapData = window.Hierarchy.mindmap(baseData, {
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
  lf.render(graphData);
}

renderData(baseData);