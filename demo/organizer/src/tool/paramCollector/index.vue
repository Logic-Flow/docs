<template>
  <div>
    <el-table :data="paramList" :border="true" type="selection" style="width: 100%">
      <el-table-column prop="key" label="KEY" width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.keyType !== 'custom'">
            <span class="required">{{ scope.row.required ? '*' : '' }}</span>
            {{ scope.row.key }}
          </div>
          <el-input
            v-else
            v-model="scope.row.key"
            placeholder="请输入"
            size="small"
            @change="handleKeyChange($event, scope.row)"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="VALUE">
        <template slot-scope="scope">
          <value-collector
            class="value-select"
            :value="param[scope.row.key]"
            :name="scope"
            :context="context"
            :types="types"
            :defaultValue="defaultValue"
            :lf="lf"
            @change="handleValueChange($event, scope.row)"
          ></value-collector>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-delete"
            circle
            type="danger"
            size="mini"
            :disabled="!!scope.row.required"
            @click="removeParam(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-link type="primary" :underline="false" class="add-button" @click="addCustom">
      <i class="el-icon-circle-plus-outline"></i>
      添加自定义参数
    </el-link>
  </div>
</template>

<script>
import { findIndex } from 'lodash-es'
import valueCollector from '../valueCollector/index.vue'
export default {
  props: {
    context: Object,
    lf: Object,
    defaultValue: [String, Number, Boolean, Object, Array],
    paramList: Array,
    value: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(nv) {
        const param = this.convertParam(nv)
        this.param = param
      }
    }
  },
  data() {
    return {
      list: [],
      types: ['input', 'dataSource', 'dataConvert', 'urlParam', 'initParam'],
      param: {}
    }
  },
  methods: {
    /** 返回的param格式
     queryParams:
     [
       {
          key: 'page', // 参数名称
          paramType: 'int', // 参数类型
          value: { // 返回的是一个值收集器的内容
            type: 'component',
            componentId: '111', // 页面组件Id' 
            field: 'id', // 如果组件的属性值是对象，则可以通过field获取对象的字段
            prop: 'name', // 属性值，调用model的getProps('name')获取属性值
            dataType: '', // 该值的数据类型，由物料定义的该propType
          }
       }
     ]
    **/
    formatParam() {
      const keys = Object.keys(this.param)
      const data = keys.map((key) => {
        return {
          key: key,
          paramType: this.param[key].paramType,
          keyType: key ? this.param[key].keyType : 'custom',
          value: this.param[key]
        }
      })
      return data
    },
    convertParam(data) {
      const param = {}
      data.map((item) => {
        param[item.key] = item.value
      })
      return param
    },
    handleValueChange(e, row) {
      const key = row.key
      this.param[key] = e
      this.param[key].paramType = row.paramType
      this.param[key].keyType = row.keyType
      const param = this.formatParam()
      this.$emit('change', param)
    },
    handleKeyChange(e, row) {
      console.log('2', row)
      const key = row.key
      this.param[key] = row.value || {}
      this.param[key].keyType = row.keyType
      const param = this.formatParam()
      this.$emit('change', param)
    },
    removeParam(row) {
      const idx = findIndex(this.paramList, (o) => o.key === row.key)
      this.paramList.splice(idx, 1)
      delete this.param[row.key]
      const param = this.formatParam()
      this.$emit('change', param)
    },
    addCustom() {
      const item = {
        key: '',
        value: '',
        required: 0,
        keyType: 'custom'
      }
      this.paramList.push(item)
    }
  },
  components: {
    valueCollector
  }
}
</script>

<style scoped lang="less">
/deep/.el-select {
  width: 100%;
}
.required {
  color: #f56c6c;
  width: 6px;
  display: inline-block;
  text-align: right;
}
.add-button {
  margin-top: 10px;
}
</style>
