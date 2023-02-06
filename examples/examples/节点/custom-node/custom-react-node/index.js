import reactNode from "./reactNode.js";

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

lf.register(reactNode);

lf.on('custom:add-one', (model) => {
  lf.setProperties(model.id, {
    name: 'reactComponent',
    body: model.getProperties().body + 1,
  });
});

lf.on('custom:delete-one', (model) => {
  lf.setProperties(model.id, {
    name: 'reactComponent',
    body: model.getProperties().body - 1,
  });
});

const nodeData = {
  id: "1",
  type: "react-node",
  x: 300,
  y: 250,
  properties: {
    name: "hello",
    body: Math.random(),
  }
};

const render = (node) => {
  lf.render({
    nodes: [
      node,
    ]
  });
}
render(nodeData);