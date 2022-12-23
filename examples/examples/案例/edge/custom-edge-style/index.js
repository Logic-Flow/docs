import { customLine, customPolyline, customBezier } from "./customEdge.js";

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

lf.register(customLine);
lf.register(customPolyline);
lf.register(customBezier);

const nodeData = [
  {
    id: "node_id_1",
    type: "circle",
    x: 100,
    y: 100,
    text: { x: 100, y: 100, value: "节点1" }
  },
  {
    id: "node_id_2",
    type: "circle",
    x: 200,
    y: 300,
    text: { x: 200, y: 300, value: "节点2" },
    properties: {}
  }
];

const edgeData = [
  {
    id: "edge_id",
    type: "custom-polyline-edge",
    sourceNodeId: "node_id_1",
    targetNodeId: "node_id_2",
    text: { x: 139, y: 200, value: "连线" },
    startPoint: { x: 100, y: 140 },
    endPoint: { x: 200, y: 250 },
    pointsList: [
      { x: 100, y: 140 },
      { x: 100, y: 200 },
      { x: 200, y: 200 },
      { x: 200, y: 250 }
    ],
    properties: {}
  }
];

const render = (nodes, edges) => {
  lf.render({
    nodes,
    edges,
  });
}
render(nodeData, edgeData);

window.handleColorChange = (type, color) => {
  switch (type) {
    case 'stroke':
      edgeData[0].properties = {
        ...edgeData[0].properties,
        strokeColor: color,
      };
      break;
    case 'text':
      edgeData[0].properties = {
        ...edgeData[0].properties,
        textColor: color,
      };
      break;
    default:
      break;
  }
  render(nodeData, edgeData);
}

window.handleStrokeWidth = (el) => {
  edgeData[0].properties = {
    ...edgeData[0].properties,
    strokeWidth: Number(el.value),
  };
  render(nodeData, edgeData);
}

window.handleFontSize = (el) => {
  edgeData[0].properties = {
    ...edgeData[0].properties,
    fontSize: Number(el.value),
  };
  render(nodeData, edgeData);
}

window.handleHorizontalMove = (el) => {
  edgeData[0].properties = {
    ...edgeData[0].properties,
    textHorizontalMove: Number(el.value),
  };
  render(nodeData, edgeData);
}

window.handleVerticalMove = (el) => {
  edgeData[0].properties = {
    ...edgeData[0].properties,
    textVerticalMove: Number(el.value),
  };
  render(nodeData, edgeData);
}

window.handleTypeChange = (el) => {
  edgeData[0].type = el.value;
  render(nodeData, edgeData);
}

window.handleAnimationChange = (el) => {
  const isOpenAnimation = el.value === 'open';
  edgeData[0].properties = {
    ...edgeData[0].properties,
    isAnimation: isOpenAnimation,
  };
  render(nodeData, edgeData);
}