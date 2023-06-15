<template>
  <div class="value-selector-wrapper">
    <!-- <i class="el-icon-setting value-selector-icon"></i> -->
    <el-dropdown trigger="click" size="small" class="type-dropdown" placement="top" @command="handleCommand">
      <span class="value-selector-prefix">
        <i class="value-selector-icon" :class="['value-selector-icon', typeMap[type] && typeMap[type].icon]"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item in typeOptions"
          :key="item.value"
          :command="item.value"
          :icon="item.icon"
          :class="item.value === type && 'selected'"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="value-selector">
      <option-value v-show="type === 'option'" :value="val" @change="handleChange" :options="options"></option-value>
      <input-value v-show="type === 'input'" :value="val" @change="handleChange"></input-value>
      <component-value v-show="type === 'component'" :value="val" :context="context" @change="handleChange"></component-value>
      <component-prop-value v-show="type === 'componentProp'" :value="val" :context="context" @change="handleChange"></component-prop-value>
      <data-source-value v-show="type === 'dataSource'" :value="val" :context="context" :lf="lf" @change="handleChange"></data-source-value>
      <data-convert-value v-show="type === 'dataConvert'" :value="val" :context="context" :lf="lf" @change="handleChange"></data-convert-value>
      <url-param-value v-show="type === 'urlParam'" :value="val" @change="handleChange"></url-param-value>
      <init-param-value v-show="type === 'initParam'" :value="val" @change="handleChange"></init-param-value>
    </div>
  </div>
</template>

<script>
import optionValue from './optionValue.vue'
import inputValue from './inputValue.vue'
import componentValue from './componentValue.vue'
import dataSourceValue from './dataSourceValue.vue'
import dataConvertValue from './dataConvertValue.vue'
import componentPropValue from './componentPropValue.vue'
import urlParamValue from './urlParamValue.vue'
import initParamValue from './initParamValue.vue'

import { valueCollectorMap } from '../../util/typeMap'

export default {
  props: {
    context: Object,
    lf: Object,
    options: Array,
    types: Array,
    value: [String, Number, Boolean, Object, Array]
  },
  data() {
    return {
      type: '',
      typeMap: valueCollectorMap,
      val: null
    }
  },
  watch: {
    types: {
      deep: true,
      immediate: true,
      handler(nv) {
        this.type = (nv && nv[0]) || this.type
      }
    },
    value: {
      deep: true,
      immediate: true,
      handler(nv) {
        if (nv && nv.type) {
          this.type = nv.type || (this.types && this.types[0])
          this.val = JSON.parse(JSON.stringify(nv))
        }
      }
    }
  },
  computed: {
    typeOptions() {
      const options = this.types.map((type) => this.typeMap[type])
      return options
    }
  },
  methods: {
    /**
     * 向外抛出change事件发送数据格式
     * 1. 可选项选择
     * {
     *   type: 'option',
     *   value: '选择的值',
     *   dataType: 'boolean',
     * }
     * 2. 手动输入
     * {
     *   type: 'input',
     *   value: '输入的值',
     *   dataType: 'string',
     * }
     * 3. 页面组件的值
     * {
     *   type: 'component',
     *   componentId: '111', // 页面组件Id'
     *   field: 'id', // 如果组件的值是对象，则可以通过field获取对象的属性
     *   prop: 'name', // 预留: model.getProps('name') 拿属性, 现在是value，可以直接调用model的getValue方法
     * }
     * 4. 获取数据源的值
     * {
     *   type: 'dataSource',
     *   nodeId: 'b5i92n8ilkg0000', // 流程图上配置的数据节点的id
     *   apiId: 1, // 对应的数据源请求的id
     *   field: 'data.list', // 去拿该数据源返回值的哪个字段
     * }
     * 5. 页面组件的属性值
     * {
     *   type: 'componentProp',
     *   componentId: '111', // 页面组件Id'
     *   field: 'id', // 如果组件的属性值是对象，则可以通过field获取对象的字段
     *   prop: 'name', // 属性值，调用model的getProps('name')获取属性值
     * }
     */

    handleChange(e) {
      this.val = e
      this.$emit('change', e)
    },
    handleCommand(e) {
      this.type = e
      this.$emit('change', {
        type: e,
        dataType: 'string'
      })
    }
  },
  components: {
    optionValue,
    inputValue,
    componentValue,
    componentPropValue,
    dataSourceValue,
    dataConvertValue,
    urlParamValue,
    initParamValue
  }
}
</script>

<style scoped lang="less">
/deep/.el-tabs__item {
  font-size: 10px;
  padding: 0 10px;
  line-height: 30px;
  height: 30px;
}
/deep/.el-select {
  width: 100%;
}
/deep/.el-input__inner {
  border-radius: 0 4px 4px 0;
}

/deep/.el-dropdown-menu__item {
  &.selected {
    color: #2961ef;
  }
}
.type-dropdown {
  height: 100%;
}
.value-selector-wrapper {
  display: inline-flex;
  align-items: flex-start;
  width: 100%;
}
.value-selector {
  width: 100%;
}
.value-selector-prefix {
  display: inline-block;
  width: 32px;
  height: 32px;
  background: #efefee;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px 0 0 4px;
}
.value-selector-icon {
  display: inline-block;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    color: #2961ef;
  }
}
</style>
