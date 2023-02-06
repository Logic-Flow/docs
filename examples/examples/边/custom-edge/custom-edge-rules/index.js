import { customRectNode, customCircleNode, customEllipseNode, customPolygonNode} from "./customNode.js";

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
  edgeType: 'polyline',
});

lf.batchRegister([customRectNode, customCircleNode, customEllipseNode, customPolygonNode]);

// 连接规则校验失败事件
lf.on('connection:not-allowed', ({msg}) => {
  alert(msg);
});

const nodeData = [
  {
    id: "1",
    type: "customRectNode",
    x: 200,
    y: 250,
    text: "矩形"
  },
  {
    id: "2",
    type: "customCircleNode",
    x: 400,
    y: 100,
    text: "圆形"
  },
  {
    id: "3",
    type: "customEllipseNode",
    x: 400,
    y: 250,
    text: "椭圆"
  },
  {
    id: "4",
    type: "customPolygonNode",
    x: 400,
    y: 400,
    text: "多边形"
  },
];

lf.render({
  nodes: nodeData,
});