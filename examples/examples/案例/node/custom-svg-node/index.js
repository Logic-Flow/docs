import svgNode from "./svgNode.js";

// logicflow流程图配置
export const LFConfig = {
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
  container,
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

