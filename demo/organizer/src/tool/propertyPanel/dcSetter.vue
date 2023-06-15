<template>
  <div class="dc-panel-wrapper">
    <div class="item-wrap">
      <div class="dc-label">变量：</div>
      <div class="param-wrapper" v-for="(source, idx) in params.convertList" :key="idx">
        <div class="dc-label">KEY: </div>
        <el-input
          v-model="source.key"
          class="dc-param-input"
          placeholder="请输入"
          size="small"
          @change="handleResourceKeyChange($event, idx)"
        ></el-input>
        <div class="dc-label"><span>=</span>VALUE:</div>
        <value-collector
          class="value-select"
          :value="source.value"
          :context="context"
          :types="types"
          :lf="lf"
          @change="handleResourceValueChange($event, idx)"
        ></value-collector>

        <el-link class="delete-button" type="danger" icon="el-icon-delete" @click="deleteParam(idx)"></el-link>
      </div>
      <el-link type="primary" class="add-button" icon="el-icon-circle-plus-outline" @click="addParam">
        添加变量
      </el-link>
    </div>

    <div class="item-wrap">
      <div class="dc-label">转换函数体：</div>
      <el-alert title="如上配置的转换源数据 key 可直接作为变量名在下面函数体中使用" type="warning"> </el-alert>
      <div id="my-editor"></div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
// import CodeFlask from 'codeflask'
import valueCollector from '../valueCollector/index.vue'

export default {
  components: {
    valueCollector
  },
  props: {
    context: Object,
    lf: Object,
    value: {
      type: Object,
      default: () => {}
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(nv) {
        this.params = {
          ...this.params,
          ...nv
        }
      }
    }
  },
  data() {
    return {
      flask: undefined,
      params: {
        convertList: [],
        convertCode: ''
      },
      types: ['dataSource', 'dataConvert', 'urlParam', 'initParam']
    }
  },
  async mounted() {
    console.log('mounted --->>>')
    // const flask = new CodeFlask('#my-editor', { language: 'js' })
    // this.flask = flask
    // // flask.updateCode('const my_new_code_here = "Blabla"')
    // if (this.params.convertCode) {
    //   flask.updateCode(this.params.convertCode)
    // }

    // flask.onUpdate((code) => {
    //   this.params.convertCode = code
    //   this.$emit('change', this.params)
    // })

    // TODO: 如果没有已存在代码，则添加实例代码到编辑框中
    // flask.onUpdate(
    //   // do something with code here.
    //   // this will trigger whenever the code
    //   // in the editor changes.
  },
  methods: {
    addParam() {
      const tempParam = {
        key: '',
        value: undefined
      }
      this.params.convertList.push(tempParam)
    },
    deleteParam(idx) {
      this.params.convertList.splice(idx, 1)
    },
    handleResourceKeyChange(e, idx) {
      this.params.convertList[idx].key = e
      this.$emit('change', this.params)
    },
    handleResourceValueChange(e, idx) {
      this.params.convertList[idx].value = e
      this.$emit('change', this.params)
    }
  }
}
</script>

<style scoped lang="less">
.convert-panel-wrapper {
  width: 100%;
}
.panel-item {
  width: 100%;
  display: inline-flex;
}
.item-wrap {
  background: #f3f6fa;
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #303a51;
  line-height: 16px;
  font-weight: 400;
  padding: 9px 12px;
}
.dc-label {
  color: #333;
  line-height: 32px;
  height: 32px;
  margin-right: 8px;
  display: flex;
  & > span {
    margin-right: 8px;
  }
}
.dc-radio-group {
  display: flex;
  align-items: center;
}
.dc-select {
  flex: 1;
}
.dc-input {
  flex: 1;
}
.dc-param-input {
  margin-right: 10px;
  width: 180px;
}

.param-wrapper {
  display: flex;
  // align-items: center;
  margin-bottom: 10px;
}
.delete-button {
  margin-left: 8px;
}
.add-button {
  margin-top: 10px;
}

#my-editor {
  position: relative;
  height: 240px;
}
</style>
