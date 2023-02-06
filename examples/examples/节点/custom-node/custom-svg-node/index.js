import svgNode from "./svgNode.js";

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
});

lf.register(svgNode);

const nodeData = {
  id: '1',
  x: 200,
  y: 200,
  type: 'svg-node',
  text: {
    x: 200,
    y: 200,
    value: '自定义svg节点',
  },
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

