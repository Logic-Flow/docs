<template>
  <div class="node-wrap" :class="[properties.status, 'base', getClassName(), properties.executeStatus]">
    <div class="node-title" @mousedown="handleMousedown" @mouseup="handleMouseup">
      <span class="node-icon">
        <img :src="getLogo()" alt="" />
      </span>
      <span class="node-name">{{ getName() }}</span>
    </div>
    <div
      class="node-warning"
      v-show="properties.warnings && properties.warnings.length"
    >
      <el-popover class="item" placement="right" width="auto" :offset="-10" trigger="click" popper-class="logic-pop">
        <abstract-content
          :title="'配置异常'"
          :content="properties.warnings"
          :showButton="false"
        ></abstract-content>
        <div class="warning-tip">请及时调整，以免运行错误！</div>
        <span class="icon" slot="reference" @mousedown.stop>
          <i class="el-icon-warning"></i>
        </span>
      </el-popover>
    </div>
    <div
      class="node-option"
      v-show="(properties.status === 'selected' || properties.status === 'hovered') && !disabled"
      @mousedown.capture="selectNode"
    >
      <el-tooltip class="item" effect="dark" content="复制节点" placement="top" popper-class="logic-tooltip-pop">
        <span class="option-icon" @click="copyNode" @mousedown.stop>
          <img src="https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/node_copy.png" />
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="信息概览" placement="top" popper-class="logic-tooltip-pop">
        <el-popover placement="right" width="188" :offset="-10" trigger="click" popper-class="logic-pop">
          <abstract-content
            :title="getAbstract().title"
            :content="getAbstract().content"
            :showButton="getAbstract().showButton"
            @config="goConfig()"
          ></abstract-content>
          <span class="option-icon" slot="reference" @mousedown.stop>
            <img src="https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/node_abstract.png" />
          </span>
        </el-popover>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="删除节点" placement="top" popper-class="logic-tooltip-pop">
        <el-popconfirm
          hide-icon
          class="item"
          title="确认删除该节点吗？"
          placement="top"
          width="180"
          cancel-button-type=""
          @confirm="deleteNode"
          popper-class="logic-pop"
        >
          <span class="option-icon" slot="reference" @mousedown.stop>
            <img src="https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/node_delete.png" />
          </span>
        </el-popconfirm>
      </el-tooltip>
    </div>
    <div class="node-next">
      <span v-show="properties.status === 'selected' || properties.status === 'hovered'" @mousedown.stop="handleNext">
        <i class="el-icon-circle-plus next-icon"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { defaultLogo } from '../util/typeMap'
import abstractContent from '../tool/abstractContent/index.vue'

export default {
  props: {
    model: Object,
    graphModel: Object,
    isSelected: Boolean,
    isHovered: Boolean,
    disabled: Boolean,
    properties: Object
  },
  data() {
    return {
      showAddPop: false,
    }
  },
  watch: {
    isHovered(nv) {
      console.log('nv --->>>', nv);
      if (nv) {
        this.enterNode()
      } else {
        this.leaveNode()
      }
    }
  },
  methods: {
    getAbstract() {
      return (this.model.getNodeAbstract && this.model.getNodeAbstract()) || {}
    },
    getName() {
      return (this.model.getNodeName && this.model.getNodeName()) || '未知'
    },
    getLogo() {
      return (this.model.getNodeLogo && this.model.getNodeLogo()) || defaultLogo
    },
    getClassName() {
      return (this.model.getNodeClassName && this.model.getNodeClassName()) || ''
    },
    getWarning() {
      return (this.model.getNodeWarning && this.model.getNodeWarning()) || {}
    },
    handleNext() {
      console.log('this.graphModel --->>>', this.graphModel)
      const nodeX = this.model.x
      const nodeY = this.model.y
      const x = nodeX + this.model.width / 2
      const y = nodeY
      this.popoverItemKey = this.graphModel.popover.show({
        type: 'tip1',
        key: this.model.id,
        delay: 100,
        placement: 'right',
        trigger: 'click',
        width: 16,
        height: 16,
        x,
        y,
        props: {
          showConnectBlock: true
        }
      })
      this.selectNode()
    },
    handleMousedown() {
      this.mouseStartTime = new Date().getTime()
    },
    handleMouseup() {
      const mousedownDuration = new Date().getTime() - this.mouseStartTime
      // 非拖拽才显示抽屉
      if (mousedownDuration < 1000) {
        setTimeout(() => {
          this.graphModel.eventCenter.emit(`node:select-click`, this.model)
        }, 100)
      }
    },
    selectNode() {
      this.graphModel.eventCenter.emit(`node:update-model`, this.model)
    },
    enterNode() {
      console.log('this.model --->>', this.model)
      console.log('this.properties --->>', this.properties)
      if (this.model.properties && this.model.properties.status === 'selected') return
      this.model.setProperties({
        status: 'hovered'
      })
    },
    leaveNode() {
      if (this.model.properties && this.model.properties.status === 'selected') return
      this.model.setProperties({
        status: 'normal'
      })
    },
    copyNode() {
      this.graphModel.eventCenter.emit(`node:copy-node`, this.model)
    },
    deleteNode() {
      this.graphModel.eventCenter.emit(`node:delete-node`, this.model)
    },
    goConfig() {
      this.graphModel.eventCenter.emit(`node:select-click`, this.model)
    }
  },
  components: {
    abstractContent
  }
}
</script>

<style scoped lang="less">
.base {
  --node-primary-color: #2961ef;
}
.event {
  --node-primary-color: #683ced;
}
.common {
  --node-primary-color: #26c9f2;
}
.node-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  cursor: move;
  user-select: none;
  // transition: 0.3 all ease;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #1f3252;
  line-height: 16px;
  font-weight: 400;
  // overflow: hidden;
  &.hovered {
    .node-title {
      background: rgba(41, 97, 239, 0.08);
      border: 1px solid var(--node-primary-color);
    }
  }
  &.selected {
    .node-title {
      border: 2px solid var(--node-primary-color);
      box-shadow: 0 0 6px 0 rgba(41, 97, 239, 0.5);
    }
  }
  &.execute-failed {
    .node-title {
      border: 2px solid rgba(255, 77, 79, 0.7);
      box-shadow: 0 0 6px 0 rgba(255, 77, 79, 0.5);
      background: rgba(255, 77, 79, 0.5);
    }
  }
}

.node-title {
  width: 100px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  width: 100%;
  border: 1px solid #bac1d0;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
  .node-icon {
    display: inline-block;
    width: 26px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--node-primary-color);
  }
  img {
    width: 14px;
    height: 14px;
    filter: drop-shadow(#fff 100px 0);
    transform: translateX(-100px);
  }
}
.executed {
  .node-title {
    background: rgb(79 235 151 / 80%);
  }
}

.node-name {
  width: 90px;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 8px;
}

.option-icon {
  display: inline-block;
  margin-left: 4px;
  width: 14px;
  height: 14px;
  overflow: hidden;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
  &:hover,
  &:focus {
    img {
      filter: drop-shadow(var(--node-primary-color) 100px 0);
      transform: translateX(-100px);
    }
  }
}

.next-icon {
  color: #33dd89;
  font-size: 16px;
  cursor: pointer;
}

.node-option {
  display: flex;
  position: absolute;
  right: 0;
  top: calc(50% - 14px);
  transform: translateY(-100%);
  .item {
    cursor: pointer;
    height: 14px;
  }
}

.node-warning {
  display: flex;
  position: absolute;
  left: 0;
  top: calc(50% - 14px);
  transform: translateY(-100%);
  .item {
    cursor: pointer;
    height: 14px;
    color: orange;
    font-weight: bold;
    font-size: 12px;
  }
}

.warning-tip {
  font-size: 12px;
  color: #f00;
  margin-left: 4px;
}

.node-next {
  display: flex;
  position: absolute;
  left: 90px;
  top: 13px;
  width: 24px;
  height: 28px;
  align-items: center;
  span {
    width: 16px;
    height: 16px;
    background: #fff;
    margin-left: 13px;
    margin-right: 2px;
    display: flex;
    align-items: center;
  }
  .next-icon {
    width: 16px;
    height: 16px;
  }
}
</style>
