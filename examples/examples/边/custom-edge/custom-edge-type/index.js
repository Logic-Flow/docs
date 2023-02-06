import { customLine, customPolyline, customBezier } from "./customEdge.js";

// logicflow流程图配置
const LFConfig = {
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
  // 默认边
  edgeType: 'bezier',
  // 自定义节点之间边的类型
  // 移动已有边时会有 currentEdge 信息, 否则为空
  edgeGenerator: (sourceNode, targetNode, currentEdge) => {
    // 起始节点类型 rect 时使用 自定义的边 custom-line-edge
    if (sourceNode.type === 'rect') return 'line';
    if (sourceNode.type === 'circle') return 'polyline';
    if (sourceNode.type === 'ellipse') return 'custom-line-edge';
    if (sourceNode.type === 'polygon') return 'custom-polyline-edge';
    if (sourceNode.type === 'diamond') return 'custom-bezier-edge';
    if (sourceNode.type === 'circle' && targetNode === 'diamond') return 'custom-line-edge';
    if (sourceNode.type === 'ellipse' && targetNode === 'rect') return 'custom-line-edge';
  }
});

lf.register(customLine);
lf.register(customPolyline);
lf.register(customBezier);

const nodeData = [
  {
    id: "1",
    type: "rect",
    x: 100,
    y: 100,
    text: "矩形"
  },
  {
    id: "2",
    type: "circle",
    x: 300,
    y: 100,
    text: "圆形"
  },
  {
    id: "3",
    type: "ellipse",
    x: 500,
    y: 100,
    text: "椭圆"
  },
  {
    id: "4",
    type: "polygon",
    x: 100,
    y: 250,
    text: "多边形"
  },
  {
    id: "5",
    type: "diamond",
    x: 300,
    y: 250,
    text: "菱形"
  },
];

lf.render({
  nodes: nodeData,
});