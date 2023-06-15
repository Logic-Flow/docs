<template>
  <div class="action-item-wrap">
    <div class="header">
      {{ title }}
      <span class="delete" style="cursor: pointer" @click="handleDelete">
        <i class="el-icon-delete"></i>
        删除
      </span>
    </div>
    <el-row>
      <el-col :span="10">
        <div class="action-label">属性:</div>
        <el-select :value="propName" class="use-property" size="small" placeholder="请选择属性" @change="handlePropChange">
          <el-option v-for="item in propOptions" :key="item.value" :label="item.label" size="small" :value="item.value"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="14">
        <div class="action-label" style="margin-left: 30px">设置为:</div>
        <value-collector
          class="value-select"
          :value="val"
          :options="valueOptions"
          :context="context"
          :lf="lf"
          :types="types"
          @change="handleValueChange"
        ></value-collector>
      </el-col>
      <!-- <el-col :span="2" class="delete-button">
        <i 
          class="el-icon-delete" 
          style="cursor:pointer;"
          @click="handleDelete"
        >
        </i>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import valueCollector from '../valueCollector/index.vue'
export default {
  props: {
    lf: Object,
    context: Object,
    current: Object,
    value: [String, Number, Boolean, Object, Array],
    title: String
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      propName: '',
      val: {}
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(nv) {
        this.propName = nv.key
        this.val = nv.value
      }
    }
  },
  computed: {
    // 属性选项
    propOptions() {
      const logic = this.current.getLogic()
      const options = logic.props.map((item) => {
        return {
          label: item.description,
          value: item.name
        }
      })
      return options
    },
    // 值选项
    valueOptions() {
      const options =
        (this.currentProp &&
          this.currentProp.optionValue &&
          this.currentProp.optionValue.map((item) => {
            return {
              label: item.description,
              value: item.value,
              dataType: this.currentProp.propType
            }
          })) ||
        []
      return options
    },
    // 值的可能类型：内置选项，用户输入，页面组件值，数据源的值
    types() {
      return this.valueOptions.length
        ? ['option', 'input', 'component', 'componentProp', 'dataSource', 'dataConvert', 'urlParam', 'initParam']
        : ['input', 'component', 'componentProp', 'dataSource', 'dataConvert', 'urlParam', 'initParam']
    },
    currentProp() {
      const logic = this.current.getLogic()
      const propObj = logic.props.find((item) => item.name === this.propName)
      return propObj
    }
  },
  methods: {
    handlePropChange(e) {
      this.propName = e
      this.val = {}
      this.$emit('change', {
        key: this.currentProp.name,
        keyDefine: this.currentProp.description,
        keyType: this.currentProp.propType,
        value: '',
        valueDefine: ''
      })
    },
    handleValueChange(e) {
      this.val = e
      this.$emit('change', {
        key: this.currentProp.name,
        keyDefine: this.currentProp.description,
        keyType: this.currentProp.propType,
        value: e,
        valueDefine: ''
      })
    },
    handleDelete() {
      this.$emit('delete')
    }
  },
  components: {
    valueCollector
  }
}
</script>

<style scoped lang="less">
.action-item-wrap {
  background: #f3f6fa;
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #303a51;
  line-height: 16px;
  font-weight: 400;
  padding: 9px 12px;
}

.header {
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 8px;
  padding: 0 0 4px 0;
}

.delete {
  float: right;
  color: #a8adbd;
  font-weight: 400;
  &:hover {
    color: #2961ef;
  }
}
/deep/.el-col {
  display: flex;
}
/deep/.el-select {
  flex: 1;
}
.value-select {
  flex: 1;
}
.delete-button {
  height: 32px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.action-label {
  margin-right: 10px;
  height: 32px;
  line-height: 32px;
}
</style>
