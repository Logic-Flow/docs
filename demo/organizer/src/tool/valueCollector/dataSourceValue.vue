<template>
  <div>
    <el-select v-model="nodeId" size="small" placeholder="请选择数据节点" filterable @change="handleChange">
      <el-option v-for="item in options" :key="item.value" :label="item.label" size="small" :value="item.value">
        <span style="float: left" @mouseenter.stop="handleMouseEnter(item.value)">
          {{ item.label }}
        </span>
      </el-option>
    </el-select>
    <div v-if="nodeId">
      <field-selector
        class="field-selector"
        v-if="apiId"
        :body="resBody"
        :value="field"
        @change="handleFiledChange"
      ></field-selector>
      <div class="custom-field" v-else>
        <el-input
          class="custom-input"
          size="small"
          v-model="field"
          placeholder="支持以.分割的多级属性"
          @change="handleCustomField"
        ></el-input>
        <!-- <el-select v-model="dataType" size="small" placeholder="请选择数据类型" filterable>
          <el-option v-for="item in TypeOptions" :key="item.value" :label="item.label" size="small" :value="item.value">
            <span style="float: left">
              {{ item.label }}
            </span>
          </el-option>
        </el-select> -->
      </div>
    </div>
  </div>
</template>

<script>
import { focusNode } from '../../util/node'
import fieldSelector from '../fieldSelector/index.vue'
import { TypeOptions } from '../../util/dataType'

export default {
  props: {
    context: Object,
    lf: Object,
    value: Object
  },
  data() {
    return {
      nodeId: '',
      resBody: {},
      field: '',
      dataType: 'string',
      TypeOptions
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(nv) {
        if (nv && nv.type === 'dataSource') {
          this.nodeId = nv.nodeId
          this.field = nv.field
        }
      }
    },
    apiId: {
      immediate: true,
      deep: true,
      async handler(nv) {
      }
    }
  },
  methods: {
    // 鼠标悬浮时高亮对应数据节点
    handleMouseEnter(e) {
      focusNode(this.lf.graphModel, e, 240)
      const nodeModel = this.lf.getNodeModelById(e)
      this.lf.graphModel.eventCenter.emit('node:hover-node', nodeModel)
    },
    handleChange(e) {
      const option = this.options.find((item) => item.value === this.nodeId)
      let apiLabel = ''
      if (option) {
        apiLabel = option.label
      }
      const data = {
        type: 'dataSource',
        field: this.field,
        apiId: this.apiId,
        apiLabel,
        nodeId: this.nodeId
      }
      this.$emit('change', data)
    },
    handleFiledChange(e, type) {
      console.log('this.field', this.field)
      const option = this.options.find((item) => item.value === this.nodeId)
      let apiLabel = ''
      if (option) {
        apiLabel = option.label
      }
      this.field = e.join('.')
      const data = {
        type: 'dataSource',
        field: this.field,
        apiId: this.apiId,
        nodeId: this.nodeId,
        apiLabel,
        dataType: type
      }
      this.$emit('change', data)
    },
    handleCustomField() {
      const option = this.options.find((item) => item.value === this.nodeId)
      let apiLabel = ''
      if (option) {
        apiLabel = option.label
      }
      const data = {
        type: 'dataSource',
        field: this.field,
        apiId: this.apiId,
        nodeId: this.nodeId,
        apiLabel,
        dataType: this.dataType
      }
      this.$emit('change', data)
    }
  },
  computed: {
    options() {
      const data = this.lf.getGraphData()
      const { nodes } = data
      const dsNodes = nodes.filter((item) => item.properties.componentName === 'dataSource' && item.properties.ds)
      const options = dsNodes.map((item) => {
        return {
          label: `${item.properties.name}_${item.properties.ds.name}`,
          value: item.id,
          apiId: item.properties.ds.fetchMode === 'redirect' ? item.properties.ds.resourceId : item.properties.ds.id,
          nodeId: item.id
        }
      })
      return options
    },
    apiId() {
      const currentNode = this.options.find((item) => item.value === this.nodeId)
      return currentNode && currentNode.apiId
    }
  },
  components: {
    fieldSelector
  }
}
</script>

<style scoped lang="less">
/deep/.el-select {
  width: 100%;
}
.field-selector {
  margin-top: 2px;
}
.custom-input {
  margin: 5px 0;
}
</style>
