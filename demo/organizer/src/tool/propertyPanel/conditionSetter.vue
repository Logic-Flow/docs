<template>
  <div class="setter-wrapper">
    <condition-item
      v-for="(item, index) in conditions"
      :title="`条件${index+1}（C${index+1}）`"
      :key="index"
      :value="item"
      :context="context"
      :current="current"
      :lf="lf"
      @change="handleConditionChange($event, index)"
      @delete="handleConditionDelete(index)"
      class="setter-item"
    ></condition-item>
    <el-link 
      type="primary" 
      :underline="false"
      class="add-button"
      @click="addCondition"
    >
      <i class="el-icon-circle-plus-outline"></i>
      添加条件
    </el-link>
    <el-row class="setter-footer">
      <el-radio-group v-model="combineType" size="small" v-if="conditions.length" @change="handleCombineTypeChange">
        <el-radio :label="1" size="small">满足所有条件</el-radio>
        <el-radio :label="2">满足任意条件</el-radio>
        <el-radio :label="3">自定义</el-radio>
        <el-input 
          class="input"
          v-model="combineRule" 
          placeholder="例如：C1&&(C2||C3)" 
          size="small"
          :disabled="combineType!==3"
          @change="handleCombineTypeChange"
        >
        </el-input>
      </el-radio-group>
    </el-row>
  </div>
</template>

<script>
import conditionItem from './conditionItem.vue'
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
      combineType: 1,
      combineRule: '',
      conditions: [],
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler (nv) {
        if (nv && nv.conditions && nv.conditions.length) {
          this.conditions = nv.conditions || []
          this.combineRule = nv.combineRule || ''
          this.combineType = nv.combineType || 1
          this.handleCombineType()
        } else {
          this.conditions = []
          this.combineRule = ''
          this.combineType = 1
        }
      }
    },
    combineType: {
      immediate: true,
      handler (nv) {
        this.handleCombineType()
      }
    }
  },
  methods: {
    handleConditionChange(e, index) {
      this.conditions[index] = e
      this.$emit('change', {
        combineRule: this.combineRule,
        conditions: this.conditions,
        combineType: this.combineType,
      })
    },
    handleConditionDelete(index) {
      this.conditions.splice(index, 1)
      this.$emit('change', {
        combineRule: this.combineRule,
        conditions: this.conditions,
        combineType: this.combineType,
      })
      this.handleCombineType()
    },
    handleCombineTypeChange() {
      this.handleCombineType()
      this.$emit('change', {
        combineRule: this.combineRule,
        conditions: this.conditions,
        combineType: this.combineType,
      })
    },
    handleCombineType() {
      switch (this.combineType) {
        case 1: 
          this.combineRule = this.conditions.map((item, index)=> {
            return `C${index+1}`
          }).join('&&')
          break
        case 2: 
          this.combineRule = this.conditions.map((item, index)=> {
            return `C${index+1}`
          }).join('||')
          break
      }
    },
    addCondition() {
      if (this.conditions.length >= 6) {
        this.$message.warning('一条线最多允许添加6个判断条件！')
        return
      }
      const tempCondition = {
        operator: '==', // 比较运算符
        key: {},
        value: {}
      }
      this.conditions.push(tempCondition)
      this.handleCombineType()
    }
  },
  components: {
    conditionItem
  }
}
</script>

<style scoped lang="less">
.setter-wrapper {
  width: 100%;
  font-size: 12px;
}

.setter-item {
  margin-bottom: 10px;
}

.setter-header {
  margin-bottom: 20px;
}
.setter-footer {
  margin-top: 20px;
}

/deep/.el-radio__label {
  font-size: 12px;
  padding-left: 4px;
}
/deep/.el-radio {
  &:not(:last-of-type){
    margin-right: 20px;
  }
  margin-right: 4px;
}
.input {
  margin-top: 10px;
}
</style>