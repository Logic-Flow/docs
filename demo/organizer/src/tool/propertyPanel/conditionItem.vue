<template>
  <div class="action-item-wrap">
    <div class="header">
      {{ title }}
      <span class="delete" style="cursor: pointer" @click="handleDelete">
        <i class="el-icon-delete"></i>
        删除
      </span>
    </div>
    <el-row :gutter="8">
      <el-col :span="10">
        <value-collector
          :context="context"
          :lf="lf"
          :types="keyTypes"
          :value="condition.key"
          @change="handleKeyChange"
        ></value-collector>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="condition.operator"
          class="use-property"
          size="small"
          placeholder="请选择"
          @change="handleOperatorChange"
        >
          <el-option v-for="(item, index) in comparisonOperators" :key="index" :label="item.value" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <value-collector
          :options="valueOptions"
          :context="context"
          :lf="lf"
          :types="valueTypes"
          :value="condition.value"
          @change="handleValueChange"
        ></value-collector>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import valueCollector from '../valueCollector/index.vue'
import { comparisonOperators } from '../../util/expression'

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
      comparisonOperators,
      condition: {},
      val: {},
      valueOptions: [],
      keyTypes: ['component', 'componentProp', 'dataSource', 'dataConvert', 'urlParam', 'initParam'],
      valueTypes: ['option', 'input', 'component', 'componentProp', 'dataSource', 'dataConvert', 'urlParam', 'initParam']
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(nv) {
        this.condition = nv
      }
    },
    condition: {
      deep: true,
      immediate: true,
      handler(nv) {
        this.valueTypes = ['input', 'component', 'componentProp', 'dataSource']
        this.valueOptions = []
      }
    }
  },
  methods: {
    handleKeyChange(e) {
      this.condition.key = e
      this.$emit('change', this.condition)
    },
    handleValueChange(e) {
      this.condition.value = e
      this.$emit('change', this.condition)
    },
    handleOperatorChange() {
      this.$emit('change', this.condition)
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
