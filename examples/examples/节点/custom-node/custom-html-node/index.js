import htmlNode from "./htmlNode.js";

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

lf.register(htmlNode);

lf.on("custom:button-click", (model) => {
  lf.setProperties(model.id, {
    body: "LogicFlow"
  });
});

const nodeData = {
  id: "1",
  type: "html-node",
  x: 300,
  y: 250,
  properties: {
    name: "hello",
    body: "world"
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