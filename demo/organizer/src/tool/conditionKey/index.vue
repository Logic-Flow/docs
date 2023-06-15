<template>
  <div>
    <el-select 
      v-model="value" 
      class="use-property" 
      size="small" 
      placeholder="请选择页面组件"
      filterable
      @change="handleChange"
      >
      <el-option
        v-for="item in options"
        :key="item.value"
        size="small"
        :label="item.name"
        :value="item.value">
        <span 
          style="display: block"
          @mouseenter.stop="handleMouseEnter(item.modelId)"
        >
          <b>{{ item.name }}</b> 
        </span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    context: Object,
    defaultValue: [String, Number, Boolean, Object, Array],
  },
  data () {
    return {
      value: this.defaultValue,
    }
  },
  watch: {
    defaultValue(nv) {
      this.value = nv
    }
  },
  methods: {
    // 鼠标悬浮时高亮画布对应组件
    handleMouseEnter(e) { 
    },
    // 选择组件后获取组件值
    handleChange(e) { 
      const option = this.options.find(item => item.value === e)
      this.$emit('change', {
        ...option
      })
    },
  },
  computed: {
    // 页面组件选项
    options() {
      const options = []
      return options
    }
  }
}
</script>

<style scoped lang="less">
/deep/.el-select {
  width: 100%;
}
</style>