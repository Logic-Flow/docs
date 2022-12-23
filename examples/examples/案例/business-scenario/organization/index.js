import organizationNode from "./htmlCard.js";
import organizationEdge from './htmlEdge.js';

// logicflow流程图配置
const LFConfig = {
  edgeTextDraggable: true,
  adjustEdgeMiddle: true,
  hoverOutline: false,
  nodeSelectedOutline: false,
  hideAnchors: true,
  nodeTextEdit: false,
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

lf.register(organizationNode);
lf.register(organizationEdge);

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
    if (element.className === 'staff-options') {
      element.style.visibility = 'visible';
    }
  }
});

lf.on('node:mouseleave', (e) => {
  for (let index = 0; index < enterNode.children.length; index++) {
    const element = enterNode.children[index];
    if (element.className === 'staff-options') {
      element.style.visibility = 'hidden';
    }
  }
});

const baseData =  {
  id: '1',
  x: 100,
  y: 100,
  type: 'html-card',
  gender: 'male',
  name: 'Employee 1',
  position: 'position',
  department: 'department',
  children: [
    {
      id: '2',
      type: 'html-card',
      gender: 'female',
      name: 'Employee 2',
      position: 'position',
      department: 'department',
      children: [
        {
          id: '4',
          type: 'html-card',
          gender: 'male',
          name: 'Employee 4',
          position: 'position',
          department: 'department',
        },
        {
          id: '5',
          type: 'html-card',
          gender: 'female',
          name: 'Employee 5',
          position: 'position',
          department: 'department',
        }
      ]
    },
    {
      id: '3',
      type: 'html-card',
      gender: 'male',
      name: 'Employee 3',
      position: 'position',
      department: 'department',
      children: [
        {
          id: '6',
          type: 'html-card',
          gender: 'male',
          name: 'Employee 6',
          position: 'position',
          department: 'department',
        },
      ],
    }
  ]
};

lf.on('custom:node-update', ({id, type}) => {
  if (type === 'add') {
    addNode(baseData, id);
  } else {
    deleteNode(baseData, id);
  }
  renderData(baseData);
});

const addNode = (baseData, id) => {
  if (baseData.id === id) {
    baseData.children = baseData.children ? [
      ...baseData.children,
      {
        id: `${Math.round(Math.random() * 10000)}`,
        type: 'html-card',
        gender: Math.round(Math.random() * 10) % 2 === 0 ? 'male' : 'female',
        name: 'New Employee',
        position: 'position',
        department: 'department',
      }
    ] : [
      {
        id: `${lf.graphModel.nodes.length + 1}`,
        type: 'html-card',
        gender: Math.round(Math.random() * 10) % 2 === 0 ? 'male' : 'female',
        name: 'New Employee',
        position: 'position',
        department: 'department'
      }
    ];
    return;
  }
  if (baseData.children && baseData.children.length) {
    baseData.children.forEach((node) => {
      addNode(node, id);
    });
  }
};

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

// 节点平移
const moveX = 600;
const moveY = 200;

const renderData = (baseData) => {
  const rootNode = window.Hierarchy.compactBox(baseData, {
    direction: 'TB',
    getId(d) {
      return d.id;
    },
    getHGap() {
      return 120;
    },
    getVGap() {
      return 40;
    },
  });

  const tansferNodes = (node, parent) => {
    const nodes = [];
    const edges = [];
    const curNode = {
      id: `node_${node.data.id}`,
      x: node.x + moveX,
      y: node.y + moveY,
      type: 'organization-node',
      properties: {
        ...node.data,
      },
    };
    nodes.push(curNode);
    if (parent) {
      edges.push({
        id: `edge_${node.data.id}_${parent.properties.id}`,
        sourceNodeId: parent.id,
        targetNodeId: curNode.id,
        type: 'organization-edge',
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

  const graphData = tansferNodes(rootNode);
  console.log(graphData);
  lf.render(graphData);
}

renderData(baseData);
// lf.focusOn({
//   id: lf.graphModel.nodes[0].id,
// });
