<template>
  <div>
    <el-select 
      v-model="val" 
      size="small" 
      placeholder="请选择页面组件"
      filterable
      @change="handleChange"
      >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        size="small"
        :value="item.value"
        @mouseenter.native="handleMouseEnter(item.value)"
        >
        <span 
          style="float: left"
        >
          <b>{{ item.name }}</b>的{{ item.desc }}
        </span>
      </el-option>
    </el-select>
    <el-input 
      v-show="showFieldInput"
      v-model="fieldName"
      placeholder="请输入字段名" 
      size="small"
      class="field-input"
      @change="handleFieldChange"
    >
    </el-input>
  </div>
</template>

<script>
import { EDITOR_EVENT } from '../../util/constant'
import { getNodeName } from '../../util/node'
export default {
  props: {
    context: Object,
    value: Object,
  },
  data () {
    return {
      val: '',
      fieldName: '',
      showFieldInput: false
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (nv) {
        if (nv && nv.type === 'component') {
          this.val = nv.componentId
          this.fieldName = nv.field
        }
      }
    },
    val: {
      immediate: true,
      handler (nv) {
        const modelList = this.getInputModelList()
        const selectModel = modelList.find(item => item.id === nv)
        if ( selectModel && selectModel.getLogic) {
          const logic = selectModel.getLogic()
          const valueProp = logic.props && logic.props.length && logic.props.find(prop => prop.name === 'value')
          this.showFieldInput = valueProp && valueProp.propType === 'object'
        }
      }
    }
  },
  methods: {
    // 鼠标悬浮时高亮画布对应组件
    handleMouseEnter(e) { 
      const target = modelList.find(item => item.id === e)
      this.context.eventCenter.emit(EDITOR_EVENT.LOGIC_NODE_HOVER, target) 
    },
    // 选择组件后获取组件值
    handleChange(e) { 
      this.val = e
      const data = {
        type: 'component',
        prop: 'value',
        field: this.fieldName,
        componentId: this.val,
        componentName: this.selectModel && this.selectModel.getModelName(),
        propName: '值',
        dataType: this.valueProp.propType
      }
      this.$emit('change', data)
    },
    // 输入字段名后抛出事件
    handleFieldChange() {
      const data = {
        type: 'component',
        prop: 'value',
        field: this.fieldName,
        componentId: this.val,
        componentName: this.selectModel && this.selectModel.getModelName(),
        propName: '值',
        dataType: this.valueProp.propType
      }
      this.$emit('change', data)
    },
    getInputModelList() {
      // 获取所有输入型组件
      return []
    }
  },
  computed: {
    // 页面组件选项
    options() {
      let modelList = this.getInputModelList()
      const options = modelList.map(item => {
        const logic = item.getLogic()
        const valueProp = logic.props && logic.props.length && logic.props.find(prop => prop.name === 'value')
        return {
          id: item.id,
          name: getNodeName(item),
          value: item.id,
          desc: valueProp.description,
          label: `${getNodeName(item)}的${valueProp.description}`,
        }
      })
      return options
    },
    valueProp () {
      if ( this.selectModel && this.selectModel.getLogic) {
        const logic = this.selectModel.getLogic()
        const valueProp = logic.props && logic.props.length && logic.props.find(prop => prop.name === 'value')
        return valueProp
      }
      return {}
    },
    selectModel () {
      const modelList = this.getInputModelList()
      const selectModel = modelList.find(item => item.id === this.val)
      return selectModel
    }
  }
}
</script>

<style scoped lang="less">
/deep/.el-select {
  width: 100%;
}
.field-input {
  margin-top: 2px;
}
</style>