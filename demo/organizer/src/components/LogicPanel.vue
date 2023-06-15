<template>
  <div
    class="logic-panel"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 1)"
  >
    <div ref="container" class="logic-container"></div>
    <toolbar :lf="lf" :graph="graph"></toolbar>
    <property-panel
      v-if="lf"
      :lf="lf"
      :context="context"
      @submit="handleSubmit"
    ></property-panel>
  </div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import { Dagre } from "@logicflow/layout";
import { MiniMap, SelectionSelect, Menu } from "@logicflow/extension";

import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";

import propertyPanel from "../tool/propertyPanel/index.vue";
import insertMenu from "../tool/insertMenu/index.vue";
import toolbar from "../tool/toolbar/index.vue";

import logicLine from "../node/logicLine";
import reaction from "../node/reaction";
import common from "../node/common";
import event from "../node/event";
import { defaultLogo } from "../util/typeMap";

import { waitTime } from "../util/index";
import Graph from "../util/graph";
import { genStartPos, genId } from "../util/calculate";
import { NODE_SPACE_X, NODE_SPACE_Y, EDITOR_EVENT } from "../util/constant";
import { getNodeName } from "../util/node";
import Popover from "../tool/popover/popover";

export default {
  name: 'LogicPanel',
  props: {
    context: Object,
    info: Object,
  },
  data() {
    return {
      lf: null,
      graph: null,
      isShowMenu: false,
      menuPosition: {
        x: 0,
        y: 0,
      },
      currentModel: null,
      tipText: "",
      loading: true,
    };
  },
  async mounted() {
    this.loading = true;
    await waitTime(100);

    this.initCanvas();
    this.initEvents();
    this.initPopover();
    this.info && this.createDefaultLogic();
    this.loading = false;
  },
  methods: {
    // 节点拖拽到画布时的操作
    onDrop(e) {
      const target = this.context.Dnd.getDragObject();
      this.graph.addNodeByDrop(target, e);
    },
    onDragOver(e) {
      e.preventDefault();
    },

    // 初始化画布
    initCanvas() {
      const graphData = this.getGraphDataFromContext();
      this.lf = new LogicFlow({
        container: this.$refs.container,
        autoExpand: false,
        hoverOutline: false,
        edgeSelectedOutline: false,
        // adjustEdge: false,
        plugins: [MiniMap, SelectionSelect, Menu, Dagre, Popover],
        keyboard: {
          enabled: true,
          shortcuts: [
            {
              keys: "backspace",
              callback: () => {
                const { edges } = this.lf.getSelectElements();
                // 默认只支持删除选中连线
                if (edges && edges.length === 1) {
                  this.lf.deleteEdge(edges[0].id);
                }
              },
            },
          ],
        },
        grid: {
          size: 10,
          visible: false,
        },
      });
      this.lf.batchRegister([logicLine, reaction, common, event]);
      this.lf.render(graphData);
      this.lf.setDefaultEdgeType(logicLine.type);
      this.lf.setTheme({
        arrow: {
          offset: 4,
          verticalLength: 3,
        },
        snapline: {
          stroke: "#2961EF", // 对齐线颜色
          strokeWidth: 1, // 对齐线宽度
        },
        bezier: {
          stroke: "#afafaf",
          strokeWidth: 2,
        },
      });
      this.graph = new Graph({
        lf: this.lf,
        context: this.context,
      });
      if (!graphData || graphData.nodes.length === 0)
        this.initNode = this.graph.addInitNode();
      this.graph.initView();

      // REMIND: 临时将 lf 挂到 window 方便调试
      window.lf = this.lf;
    },

    // 初始化事件
    initEvents() {
      // Context 事件监听
      // 点击组件时高亮对应节点
      this.context.eventCenter.on(
        EDITOR_EVENT.CANVAS_MODEL_CLICKED,
        (model) => {
          this.graph.selectNodesByModel(model);
        }
      );
      this.context.eventCenter.on(
        EDITOR_EVENT.CANVAS_MODEL_DELETED,
        (model) => {
          console.log("EDITOR_EVENT.CANVAS_MODEL_DELETE", model);
          // this.checkRelatedComponent();
        }
      );

      // LF事件注册
      // 点击处理
      this.lf.on("node:select-click", (model) => {
        this.graph.selectNode(model);
        this.currentModel = model;
      });

      // 属性面板鼠标悬浮到某选项时高亮对应节点
      this.lf.on("node:hover-node", (model) => {
        this.graph.hoverNode(model);
      });

      // 鼠标移出节点后取消画布组件高亮
      this.lf.on("node:mouseleave", () => {
        this.context.eventCenter.emit(EDITOR_EVENT.LOGIC_NODE_HOVER, null);
      });

      // 监听node点击
      this.lf.on("node:click", ({ data }) => {
        const model = this.lf.getNodeModelById(data.id);
        this.currentModel = model;
      });
      this.lf.on("history:change", () => {
        this.setGraphDataToContext();
      });
      this.lf.on("node:add-node", ({ model, type, properties }) => {
        this.graph.insertNode(model, type, properties);
      });
      this.lf.on("node:delete-node", (model) => {
        this.graph.deleteNode(model);
        const data = model.getData();
        if (
          data.type === "common-node" &&
          data.properties &&
          data.properties.ds
        ) {
          this.checkRelatedNode();
        }
      });
      this.lf.on("node:copy-node", (model) => {
        this.graph.copyNode(model);
      });

      // 如果画布上一个节点都没有了，添加一个引导节点
      this.lf.on("node:delete", ({ data }) => {
        const { nodes } = this.lf.getGraphData();
        if (nodes.length === 0) {
          // 如果当前页面节点都被删除，就自动创建一个页面初始化节点
          this.initNode = this.graph.addInitNode();
        } else if (
          data.properties &&
          data.properties.componentName === "pageInit"
        ) {
          const hasInit = nodes.find(
            (item) =>
              item.properties && item.properties.componentName === "pageInit"
          );
          if (!hasInit) {
            // 如果当前页面没有页面初始化节点了，就自动创建一个
            this.initNode = this.graph.addInitNode();
          }
        }
      });

      // 点击节点添加按钮后，显示添加菜单
      this.lf.on("node:add-click", ({ model, event }) => {
        this.currentModel = model;
        const x = event.clientX;
        const y = event.clientY;
        this.menuPosition = {
          x: x - 10,
          y: y - 10,
        };
        this.isShowMenu = true;
      });
      this.lf.on("edge:update-model", (model) => {
        this.currentModel = model;
      });
      this.lf.on("node:update-model", (model) => {
        this.currentModel = model;
        this.graph.selectNode(model);
      });
      this.lf.on("blank:click", () => {
        this.currentModel = null;
        this.graph.clearNodesStatus();
        this.context.eventCenter.emit(
          EDITOR_EVENT.CANVAS_MODEL_ACTIVATED,
          null
        );
      });
      this.lf.on("blank:contextmenu", ({ e, position }) => {
        const x = e.clientX;
        const y = e.clientY;
        this.menuPosition = {
          x: x - 10,
          y: y - 10,
        };
        this.isShowMenu = true;
      });
    },
    // 初始化弹出框
    initPopover() {
      const { popover } = this.lf.extension;
      popover.registerPopover("tip1", {
        // TODO: 后续支持传递属性
        render: (rootEl, data) => {
          const vm = new Vue({
            render: (h) =>
              h(insertMenu, {
                props: {
                  lf: this.lf,
                  context: this.context,
                  graph: this.graph,
                  model: this.currentModel,
                  showConnectBlock: data.props.showConnectBlock,
                },
              }),
          });
          vm.$mount(rootEl);
        },
      });
    },

    /**
     * 从context中获取graphData
     */
    getGraphDataFromContext() {
      const { logicList } = this.context;
      if (logicList.length === 1 && logicList[0].nodes !== undefined) {
        // 表示新版数据，目前虽然是一张图，但是以后大概率用多张图来表示逻辑控制，所以先预留数组的形式。
        const graphData = logicList[0];
        graphData.nodes.forEach((node) => {
          const { properties } = node;
          if (properties) {
            node.properties.logo = defaultLogo;
          }
        });
        return graphData;
      }
      return {
        nodes: [],
        edges: [],
      };
    },
    setGraphDataToContext() {
      const graphData = this.lf.getGraphData();
      graphData.nodes.forEach((node) => {
        if (node.properties) {
          delete node.properties.logo;
          delete node.properties.status;
          delete node.properties.warnings;
        }
      });
      this.context.logicList = [graphData];
    },
    /**
     * 获取节点的outgoing
     * outgoing: [
     *  {
     *    id: 'edgeId',
     *    condition: 'nodeId_1.eventType === "click"',
     *    text: '点击',
     *    target: 'nodeId_2',
     *    pointsList: [] // 连线的坐标
     *  }
     * ]
     */
    getNodeOutgoing(nodeId) {
      const edges = this.lf.getNodeOutgoingEdge(nodeId);
      return edges.map((edgeModel) => {
        const edgeData = edgeModel.getData();
        return {
          id: edgeData.id,
          condition: edgeData.properties.condition,
          text: edgeData.text ? edgeData.text.value : "",
          target: edgeData.targetNodeId,
          pointsList: edgeData.pointsList,
        };
      });
    },
    handleSubmit(type) {
      if (type === "ds") {
        this.checkRelatedDs();
      }
      this.graph.addHistory();
    },

    /**
     * 根据传入的model创建行为节点、引导
     */
    createDefaultNode(startPos) {
      const { dynamicKey, model } = this.info;
      const logic = model.getLogic();
      const props = logic.props || [];
      const currentProp = props.find((item) => item.name === dynamicKey) || {};
      const actNode = {
        id: genId(10),
        type: reaction.type,
        x: startPos.x + NODE_SPACE_X * 2,
        y: startPos.y,
        properties: {
          componentId: model.id,
          componentName: model.componentName,
          name: getNodeName(model),
          reactions: [
            {
              key: dynamicKey,
              keyDefine: currentProp.description,
              valueDefine: "",
              value: {
                type: "dataSource",
              },
            },
          ],
          item: {
            prop: true,
          },
        },
      };
      return actNode;
    },
    /**
     * 在setter点击动态数据设置后，跳转到逻辑编排并自动创建一条逻辑
     */
    createDefaultLogic() {
      const startPos = genStartPos(this.lf);
      const startNode = {
        id: genId(10),
        type: event.type,
        x: startPos.x,
        y: startPos.y,
        properties: {
          componentId: "page_init",
          componentName: "pageInit",
          name: "页面初始化",
        },
      };
      const reqNode = {
        id: genId(10),
        type: common.type,
        x: startPos.x + NODE_SPACE_X,
        y: startPos.y,
        properties: {
          type: "dataSource",
          componentName: "dataSource",
          name: "数据请求",
        },
      };
      const actNode = this.createDefaultNode(startPos);
      const graphData = {
        nodes: [startNode, reqNode, actNode],
        edges: [
          {
            id: genId(10),
            type: logicLine.type,
            sourceNodeId: startNode.id,
            targetNodeId: reqNode.id,
          },
          {
            id: genId(10),
            type: logicLine.type,
            sourceNodeId: reqNode.id,
            targetNodeId: actNode.id,
          },
        ],
      };
      this.lf.addElements(graphData);
      this.lf.translate(0, -NODE_SPACE_Y);
    },
  },
  components: {
    propertyPanel,
    toolbar,
  },
};
</script>

<style scoped lang="less">
.system-warning {
  position: absolute;
  right: 0;
  bottom: 0;
  color: orange;
  background: #fff;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgb(31 50 82 / 18%);
  border-radius: 2px;
  padding: 12px;
  font-size: 14px;
}
.logic-panel,
.logic-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.logic-palette {
  position: absolute;
  left: 0;
  top: 0;
}

/*自定义锚点样式*/
.logic-panel {
  /deep/ .custom-anchor {
    stroke: #2961ef;
    stroke-width: 1;
    fill: #fff;
    cursor: crosshair;
    rx: 3;
    ry: 3;
  }
  /deep/ .custom-anchor:hover {
    stroke: #2961ef;
    stroke-width: 1;
    fill: #fff;
  }
  /deep/ .lf-node-not-allow .custom-anchor:hover {
    stroke: #999;
    fill: #d9d9d9;
    cursor: not-allowed;
  }
  /deep/ .incomming-anchor {
    stroke: #2961ef;
    cursor: default;
  }
  /deep/ .outgoing-anchor {
    stroke: #2961ef;
  }
  /deep/ .lf-node-not-allow .basic-node {
    cursor: not-allowed;
  }
  /deep/ .lf-control-item i {
    font-size: 20px;
    font-weight: 600;
  }
  /deep/ .lf-multiple-select {
    background: rgba(224, 80, 10, 0.2);
  }
  /deep/ .lf-grid > svg {
    background-image: url("../assets/img/grid.svg");
    background-size: 50px 50px;
    background-repeat: repeat;
  }
}
</style>
