<template>
  <div class="toolbar-wrap">
    <span class="text" v-show="mode === 'edit'">{{ text }}</span>
    <div class="toolbar">
      <el-tooltip 
        v-for="(item, index) in toolList" 
        :key="index" 
        effect="dark" 
        :content="item.desc" 
        placement="bottom" 
        popper-class="logic-tooltip-pop"
      >
        <span 
          class="tool-item"
          :class="[currentTool===item.name && 'selected', item.disabled && 'disabled']" 
          @click.stop="handleClick(item, $event)" 
        >
          <img :src="item.icon">
        </span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { toolMap } from '../../util/typeMap'
import { EDITOR_EVENT } from '../../util/constant'
export default {
  props: {
    lf: Object,
    graph: Object,
    mode: {
      type: String,
      default: 'edit'
    }
  },
  data () {
    return {
      text: '根据需求配置执行流程图',
      currentTool: '',
      undoAble: false,
      redoAble: false
    }
  },
  computed: {
    toolList () {
      return Object.values(toolMap).map(tool => {
        switch(tool.name) {
          case 'undo':
            tool.disabled = !this.undoAble
            break
          case 'redo':
            tool.disabled = !this.redoAble
            break
          case 'beautify':
            tool.disabled = false
            break
          case 'selection':
            tool.disabled = this.mode === 'preview'
            break
          case 'navigation':
            tool.disabled = this.mode === 'preview'
            break
          default:
            tool.disabled = false
            break
        }
        return tool
      })
    }
  },
  mounted () {
    document.addEventListener('click', (e) => {
      if (e.target.className === 'lf-mini-map-close') {
        this.currentTool = ''
      }
    }, true)
  },
  watch: {
    lf() {
      this.lf && this.lf.on('selection:selected', () => {
        this.currentTool = ''
        this.lf.extension.selectionSelect.closeSelectionSelect()
      })
    },
    graph() {
      this.graph && this.graph.context.eventCenter.on(EDITOR_EVENT.LOGIC_HISTORY_CHANGE, ({canUndo, canRedo}) => {
        this.undoAble = canUndo
        this.redoAble = canRedo
      })
    }
  },
  methods: {
    handleClick (item, e) {
      this.currentTool = ''
      if (item.disabled) return
      const type = item.name
      switch (type) {
        case 'beautify':
          this.lf.extension.dagre && this.lf.extension.dagre.layout({
            nodesep: 2,
            ranksep: 20,
            begin: [100, 100],
          });
          break;
        case 'redo':
          this.graph &&this.graph.redo()
          break;
        case 'undo':
          this.graph &&this.graph.undo()
          break;
        case 'zoomIn':
          this.lf.zoom(true);
          break;
        case 'zoomOut':
          this.lf.zoom(false);
          break;
        case 'fitView':
          this.lf.fitView(100, 100);
          break; 
        case 'selection':
          this.currentTool = type
          this.lf.extension.selectionSelect.openSelectionSelect()
          break
        case 'navigation':
          this.currentTool = type
          const position = this.lf.getPointByClient(e.x, e.y)
          this.lf.extension.miniMap.show(position.domOverlayPosition.x - 120, 40)
          break;   
      }
    }
  }
}
</script>

<style lang="less" scoped>
 .toolbar-wrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 36px;
    background: #FFFFFF;
    border-bottom: 1px solid #e4e7ed;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #C1C3C8;
    font-weight: 500;
  }
  .text {
    display: inline-flex;
    height: 100%;
    align-items: center;
    margin-left: 16px;
    max-width: 450px;
    text-overflow: ellipsis;
    overflow: hidden;
    position: absolute;
    left: 0;
  }
  .toolbar {
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    background: #fff;
  }
  .tool-item {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    margin-right: 16px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    img {
      width: 20px;
      height: 20px;
      filter: drop-shadow(#303A51 100px 0);
      transform: translateX(-100px);
    }
    &:hover, &.selected {
      background: #2961ef;
      img {
        filter: drop-shadow(#fff 100px 0);
        transform: translateX(-100px);
      }
    }
    &.disabled {
      background: #fff;
      img {
        filter: drop-shadow(#C1C3C8 100px 0);
        transform: translateX(-100px);
      }
    }
  }
</style>