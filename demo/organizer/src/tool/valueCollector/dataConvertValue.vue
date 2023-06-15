<template>
  <div>
    <el-select v-model="nodeId" size="small" placeholder="请选择数据节点" filterable @change="handleChange">
      <el-option v-for="item in options" :key="item.value" :label="item.label" size="small" :value="item.value">
        <span style="float: left" @mouseenter.stop="handleMouseEnter(item.value)">
          {{ item.label }}
        </span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { focusNode } from '../../util/node'

export default {
  props: {
    context: Object,
    lf: Object,
    value: Object
  },
  data() {
    return {
      nodeId: '',
      field: '',
      dataType: 'string'
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(nv) {
        console.log('nv --->>>', nv)
        if (nv && nv.type === 'dataConvert') {
          this.nodeId = nv.nodeId
          this.field = nv.field
        }
      }
    }
  },
  methods: {
    // 鼠标悬浮是显示对应数据节点
    handleMouseEnter(e) {
      focusNode(this.lf.graphModel, e, 240)
      const nodeModel = this.lf.getNodeModelById(e)
      this.lf.graphModel.eventCenter.emit('node:hover-node', nodeModel)
    },
    handleChange(e) {
      const option = this.options.find((item) => item.value === this.nodeId)

      const data = {
        type: 'dataConvert',
        nodeId: this.nodeId
      }
      this.$emit('change', data)
    },
    handleFieldChange(e, type) {}
  },
  computed: {
    options() {
      const data = this.lf.getGraphData()
      console.log('data --->>>', data)
      const { nodes } = data
      const dcNodes = nodes.filter((node) => node.properties.componentName === 'dataConvert' && node.properties.dc)

      const options = dcNodes.map((node) => {
        return {
          label: `${node.properties.name}`,
          value: node.id,
          nodeId: node.id
        }
      })

      console.log('options ===>>>', options)
      return options
    }
  }
}
</script>
