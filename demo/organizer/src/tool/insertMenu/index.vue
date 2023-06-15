<template>
  <div class="node-menu-wrapper">
    <!-- 通用节点：1.请求数据, 2.页面跳转, 3.数据转换 -->
    <div class="node-add-title">通用节点:</div>
    <div style="text-align: right; margin: 0">
      <el-menu mode="vertical" class="node-menu" :open="true" @select="addCommonNode">
        <el-menu-item v-for="(item, index) in commonNodeMap" :index="item.value" :key="index">
          <span class="menu-item-inner">
            <img :src="item.logo" alt="" class="icon" />
            {{ item.label }}
          </span>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- <div class="split-line"></div> -->
    <!-- 组件节点：当前页面上已拖拽的节点 -->
    <!-- <div class="node-add-title">组件节点:</div>
    <div style="text-align: right; margin: 0">
      <el-menu mode="vertical" class="node-menu" :open="true" @select="addCompNode">
        <el-menu-item v-for="(item, index) in compOptions" :index="item.value" :key="index">
          <span @mouseenter.stop="handleCompEnter(item.value)" class="menu-item-inner">
            <img :src="item.logo" alt="" class="icon" />
            {{ item.label }}
          </span>
        </el-menu-item>
      </el-menu>
    </div> -->
    <div class="split-line" v-if="showConnectBlock && nodeOptions.length"></div>
    <!-- 连接至已有节点 -->
    <div class="node-add-title" v-if="showConnectBlock && nodeOptions.length">连接至已有节点:</div>
    <div style="text-align: right; margin: 0" v-if="showConnectBlock && nodeOptions.length">
      <el-menu mode="vertical" class="node-menu" :open="true" @select="connectToNode">
        <el-menu-item v-for="(item, index) in nodeOptions" :index="item.value" :key="index">
          <span @mouseenter.stop="handleNodeEnter(item.value)" class="menu-item-inner">
            <img :src="item.logo" alt="" class="icon" />
            {{ item.label }}
          </span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { commonNodeMap, defaultLogo } from '../../util/typeMap'
import { getNodeName } from '../../util/node'

export default {
  props: {
    lf: Object,
    show: Boolean,
    context: Object,
    graph: Object,
    position: Object,
    model: Object,
    showConnectBlock: Boolean
  },
  data() {
    return {
      key: 1,
      preNodeId: '',
      commonNodeMap
    }
  },
  computed: {
    // 页面组件选项
    compOptions() {
      const options = []
      return options
    },
    // 获取页面组件节点
    nodeOptions() {
      const data = this.lf.getGraphData()
      const { nodes } = data
      const options = []
      nodes.forEach((node) => {
        if (node.type === 'event-node') return // 不允许连接到事件节点
        const label = (node.properties && node.properties.name) || '未知'
        const logo = (node.properties && node.properties.logo) || defaultLogo
        options.push({
          value: node.id,
          label,
          logo
        })
      })
      return options
    }
  },
  methods: {
    hide() {
      const key = this.model.id
      setTimeout(() => {
        this.lf.graphModel.popover.hide(key)
      }, 50)
    },
    // 鼠标悬浮时高亮画布对应组件
    handleCompEnter(e) {
    },
    // 鼠标悬浮节点时时高亮画布对应组件
    handleNodeEnter(e) {
      const nodeModel = this.lf.getNodeModelById(e)
      this.lf.graphModel.eventCenter.emit('node:hover-node', nodeModel)
    },
    handleChange(e) {
      this.val = e
      const option = this.options.find((item) => item.value === e) || {}
      const data = {
        type: 'option',
        value: e,
        valueDesc: option.label
      }
      this.$emit('change', data)
    },
    // 目标节点后添加通用节点
    addCommonNode(e) {
      console.log('e', e)
      this.hide()
      const nodeData = {}
      if (e === 'pageInit') {
        nodeData.type = 'event-node'
        nodeData.properties = {
          componentId: 'page_init',
          name: commonNodeMap[e].label,
          componentName: e,
          logo: commonNodeMap[e].logo
        }
      } else {
        nodeData.type = 'common-node'
        nodeData.properties = {
          type: e,
          name: commonNodeMap[e].label,
          componentName: e,
          logo: commonNodeMap[e].logo
        }
      }
      if (this.model) {
        nodeData.model = this.model
        this.lf.graphModel.eventCenter.emit('node:add-node', nodeData)
      } else {
        this.addNodeInPosition(nodeData)
      }
    },
    // 目标节点后添加组件节点
    addCompNode(e) {
      this.hide()
      const model = this.modelList.find((item) => item.id === e)
      const logic = model.getLogic()
      const componentName = model.componentName
      const material = this.context.getMaterialByType(componentName)
      const logo = material.logo || defaultLogo
      const nodeData = {
        type: 'reaction-node',
        properties: {
          name: getNodeName(model),
          componentId: model.id,
          componentName: model.componentName,
          logo
        }
      }
      if (this.model) {
        nodeData.model = this.model
        this.lf.graphModel.eventCenter.emit(`node:add-node`, nodeData)
      }
    },
    // 连接至已有节点
    connectToNode(e) {
      this.hide()
      this.graph.connectToNode(e, this.model)
    }
  }
}
</script>

<style lang="less" scoped>
.node-menu-wrapper {
  width: 194px;
}
.node-menu {
  border: none;
  padding: 4px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 120px;
  background: #f3f6fa;
  border-radius: 4px;
  .el-menu-item {
    text-align: left;
    height: 25px;
    line-height: 25px;
    padding: 0 !important;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #1f3252;
    font-weight: 400;
    &.is-active {
      background: rgba(41, 97, 239, 0.08);
      border-radius: 2px;
    }
  }
  .menu-item-inner {
    display: flex;
    align-items: center;
    margin-left: 2px;
  }
  .icon {
    width: 14px;
    height: 14px;
    margin-right: 4px;
    filter: drop-shadow(#2961ef 100px 0);
    transform: translateX(-100px);
  }
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    background: transparent;
    border-radius: 5px;
    width: 4px;
    z-index: -1;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 4px;
    background: #dcdfe6;
    z-index: -1;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 4px;
    background: transparent;
  }

  &::-webkit-scrollbar-corner {
    /*滚动条交汇处*/
    border-radius: 4px;
    background: transparent;
  }
}

.node-add-title {
  height: 24px;
  line-height: 24px;
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #303a51;
  font-weight: 500;
}
.menu-item-inner {
  display: block;
  height: 100%;
  width: 100%;
}
.split-line {
  width: 100%;
  border-bottom: 1px solid #dcdfe6;
  margin: 8px 0;
}
</style>
