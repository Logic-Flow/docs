<template>
  <div >
    <el-cascader
      ref="fieldSelector"
      v-model="val"
      size="small"
      placeholder="请选择字段"
      :options="options"
      :props="{ expandTrigger: 'click', checkStrictly: true }"
      @change="handleChange"
      >
    </el-cascader>
  </div>
</template>

<script>
export default {
  props: {
    body: Object,
    value: String,
  },
  data () {
    return {
      val: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (nv) {
        this.val = this.value && this.value.split('.')  || []
      }
    },
  },
  computed: {
    options() {
      const tree = []
      const genTree = (body, list) => {
        if (body.properties) {
          for(let prop in body.properties) {
            const node = {
              label: prop,
              value: prop,
              dataType: body.properties[prop].type
            }
            list.push(node)
            if (body.properties[prop].properties) {
              node.children = []
              genTree(body.properties[prop], node.children)
            }
          }
        }
      }
      genTree(this.body, tree)
      return tree
    }
  },
  methods: {
    // 选择组件后获取组件值
    handleChange(e) {
      const checkedNodes =  this.$refs['fieldSelector'].getCheckedNodes();
      const data = checkedNodes[0].data || {} 
      this.$emit('change', e, data.dataType)
    }
  }
}
</script>

<style scoped lang="less">
/deep/.el-cascader {
  width: 100%;
}
</style>