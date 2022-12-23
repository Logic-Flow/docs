import customNode from "./customNode.js";

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

lf.register(customNode);

const nodeData = {
  id: '1',
  x: 200,
  y: 200,
  type: 'custom-node',
  text: '自定义节点样式',
  properties: {},
};

const render = (node) => {
  lf.render({
    nodes: [
      node,
    ]
  });
}
render(nodeData);

window.handleColorChange = (type, color) => {
  switch (type) {
    case 'node':
      nodeData.properties = {
        ...nodeData.properties,
        color,
      };
      break;
    case 'stroke':
      nodeData.properties = {
        ...nodeData.properties,
        strokeColor: color,
      };
      break;
    case 'text':
      nodeData.properties = {
        ...nodeData.properties,
        textColor: color,
      };
      break;
    default:
      break;
  }
  render(nodeData);
}

window.handleStrokeWidth = (el) => {
  nodeData.properties = {
    ...nodeData.properties,
    strokeWidth: el.value,
  };
  render(nodeData);
}

window.handleNodeWidth = (el) => {
  nodeData.properties = {
    ...nodeData.properties,
    width: el.value,
  };
  render(nodeData);
}

window.handleNodeHeight = (el) => {
  nodeData.properties = {
    ...nodeData.properties,
    height: el.value,
  };
  render(nodeData);
}

window.handleFontSize = (el) => {
  nodeData.properties = {
    ...nodeData.properties,
    fontSize: Number(el.value),
  };
  render(nodeData);
}

window.handleHorizontalMove = (el) => {
  nodeData.properties = {
    ...nodeData.properties,
    textHorizontalMove: Number(el.value),
  };
  render(nodeData);
}

window.handleVerticalMove = (el) => {
  nodeData.properties = {
    ...nodeData.properties,
    textVerticalMove: Number(el.value),
  };
  render(nodeData);
}