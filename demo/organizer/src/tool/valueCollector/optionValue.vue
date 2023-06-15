<template>
  <div>
    <el-select 
      filterable
      v-model="val" 
      class="use-property" 
      size="small" 
      placeholder="请选择"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        size="small"
        :value="item.value"
        >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    context: Object,
    options: {
      type: Array,
      default: () => []
    },
    value: Object,
  },
  data () {
    return {
      val: '',
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (nv) {
        if (nv && nv.type === 'option') {
          this.val = nv.value
        }
      }
    }
  },
  methods: {
    handleChange(e) { 
      this.val = e
      const option = this.options.find(item => item.value === e) || {}
      const data = {
        type: 'option',  
        value: e,
        dataType: option.dataType,
        valueDesc: option.label
      }
      this.$emit('change', data)
    },
  }
}
</script>

<!-- <style scoped lang="less">
/deep/.el-select {
  width: 100%;
}
/deep/.el-input__inner {
 border-radius: 0 4px 4px 0;
}
</style> -->