<template>
  <div>
    <el-input 
      class="input"
      v-model="val" 
      placeholder="请输入值" 
      size="small"
      type="textarea"
      :rows="1"
      @change="handleChange"
    >
    </el-input>
    <el-select v-model="dataType" size="small" placeholder="请选择数据类型" filterable @change="handleTypeChange">
      <el-option v-for="item in TypeOptions" :key="item.value" :label="item.label" size="small" :value="item.value">
        <span style="float: left">
          {{ item.label }}
        </span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { TypeOptions } from '../../util/dataType'
export default {
  props: {
    context: Object,
    value: Object
  },
  data() {
    return {
      val: '',
      dataType: 'string',
      TypeOptions
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(nv) {
        if (nv && nv.type === 'input') {
          this.val = nv.value
          this.dataType = nv.dataType
        }
      }
    }
  },
  methods: {
    handleTypeChange(e) {
      this.dataType = e
      const data = {
        type: 'input',
        value: this.val,
        dataType: this.dataType || 'string' // 默认string类型
      }
      this.$emit('change', data)
    },
    handleChange(e) {
      this.val = e
      const data = {
        type: 'input',
        value: e,
        dataType: this.dataType || 'string' // 默认string类型
      }
      this.$emit('change', data)
    }
  }
}
</script>

<style scoped lang="less">
.input {
  margin-bottom: 2px;
}
</style>
