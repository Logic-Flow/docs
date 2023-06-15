<template>
  <div class="action-panel-wrapper">
    <action-item
      v-for="(item, index) in actions"
      :title="`行为${index+1}`"
      :key="index"
      :value="item"
      :context="context"
      :current="current"
      :lf="lf"
      @change="handleActionChange($event, index)"
      @delete="handleActionDelete(index)"
      class="action-item"
    ></action-item>
    <el-link 
      type="primary" 
      :underline="false"
      class="add-button"
      @click="addAction"
    >
      <i class="el-icon-circle-plus-outline"></i>
      添加行为
    </el-link>
  </div>
</template>

<script>
import actionItem from './actionItem.vue'
export default {
  props: {
    lf: Object,
    context: Object,
    current: Object,
    value: [String, Number, Boolean, Object, Array]
  },
  model: {
    prop: "value",
    event: "change"
  },
  data () {
    return {
      propName: '',
      actions: [],
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler (nv) {
        if (nv && nv.length) {
          this.actions = nv
        } else {
          this.actions = [
            {
              key: '',
              keyDefine: '',
              keyType: '',
              valueDefine: '',
              value: {},
            }
          ]
        }
      }
    }
  },
  methods: {
    handleActionChange(e, index) {
      this.actions[index] = e
      this.$emit('change', this.actions)
    },
    handleActionDelete(index) {
      this.actions.splice(index, 1)
    },
    addAction() {
      if (this.actions.length >= 6) {
        this.$message.warning('一个节点最多允许添加6个响应行为！')
        return
      }
      const tempAction = {
        key: '',
        keyDefine: '',
        keyType: '',
        valueDefine: '',
        value: {},
      }
      this.actions.push(tempAction)
    }
  },
  components: {
    actionItem
  }
}
</script>

<style scoped lang="less">
.action-panel-wrapper {
  width: 100%;
}
.action-item {
  margin-bottom: 10px;
}
</style>