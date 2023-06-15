<template>
  <div class="pj-panel-wrapper">
    <div class="panel-item item-wrap">
      <div class="pj-label">页面跳转类型：</div>
      <el-radio-group
        v-model="params.jumpType"
        class="pj-radio-group"
        size="small"
        @change="(val) => handleParamChange('jumpType', val)"
      >
        <el-radio label="suda">配置页面</el-radio>
        <el-radio label="custom">自定义页面</el-radio>
      </el-radio-group>
    </div>

    <div class="panel-item item-wrap">
      <div class="pj-label">页面打开方式：</div>
      <el-radio-group
        v-model="params.target"
        class="pj-radio-group"
        size="small"
        @change="(val) => handleParamChange('target', val)"
      >
        <el-radio label="_self">当前页面</el-radio>
        <el-radio label="_blank">打开新 Tab</el-radio>
      </el-radio-group>
    </div>
    <div class="panel-item item-wrap" v-if="params.jumpType === 'custom'">
      <div class="pj-label">目标系统：</div>
      <el-radio-group
        v-model="params.system"
        class="pj-radio-group"
        size="small"
        @change="(val) => handleParamChange('system', val)"
      >
        <el-radio label="_current">宿主系统</el-radio>
        <el-radio label="_other">其他</el-radio>
      </el-radio-group>
    </div>

    <div v-if="params.jumpType === 'suda'">
      <div class="panel-item item-wrap">
        <div class="pj-label">目标页面：</div>
        <el-select
          v-model="params.formKey"
          class="pj-select"
          placeholder="请选择"
          size="small"
          @change="(val) => handleParamChange('formKey', val)"
        >
          <el-option
            v-for="item in sudaPageList"
            :key="item.formKey + item.version"
            :label="item.name"
            :value="item.formKey"
          ></el-option>
        </el-select>
      </div>
      <div class="panel-item item-wrap">
        <div class="pj-label">页面路由：</div>
        <el-input
          v-model="params.path"
          class="pj-input"
          placeholder="请输入系统路由，例如：'preview'"
          size="small"
          @change="(val) => handleParamChange('path', val)"
        ></el-input>
      </div>
    </div>
    <div class="panel-item item-wrap" v-else>
      <div class="pj-label">目标页面：</div>
      <el-input
        v-if="params.system === '_current'"
        type="url"
        v-model="params.customUrl"
        class="pj-input"
        placeholder="请输入目标页面系统路径，例如：'path1/path2/path3'"
        size="small"
        @change="(val) => handleParamChange('customUrl', val)"
      ></el-input>
      <el-input
        v-else
        type="url"
        v-model="params.customUrl"
        class="pj-input"
        placeholder="请输入目标页面，例如：'https://i.xiaojukeji.com?q=xxx&t=yyy'"
        size="small"
        @change="handleCustomUrlChange"
      ></el-input>
    </div>

    <div class="item-wrap">
      <div class="pj-label">路由参数：</div>
      <div class="param-wrapper" v-for="(route, idx) in params.routeParams" :key="idx">
        <div class="pj-label">KEY</div>
        <el-input
          v-model="route.key"
          class="pj-param-input"
          placeholder="请输入"
          size="small"
          @change="handleRouteParamKeyChange($event, idx)"
        ></el-input>
        <div class="pj-label">VALUE</div>
        <value-collector
          class="value-select"
          :value="route.value"
          :context="context"
          :types="types"
          :lf="lf"
          @change="handleRouteParamValueChange($event, idx)"
        ></value-collector>

        <el-link class="delete-button" type="danger" icon="el-icon-delete" @click="deleteParam(idx)"></el-link>
      </div>
      <el-link type="primary" class="add-button" icon="el-icon-circle-plus-outline" @click="addParam">
        添加参数
      </el-link>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import { mapKeys } from 'lodash-es'
import valueCollector from '../valueCollector/index.vue'

export default {
  components: {
    valueCollector
  },
  props: {
    lf: Object,
    context: Object,
    current: Object,
    value: {
      type: Object,
      default: () => {}
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      params: {
        jumpType: 'suda',
        target: '_self',
        system: '_current',
        formKey: undefined,
        path: '',
        customUrl: '',
        routeParams: []
      },
      types: ['input', 'dataSource', 'dataConvert', 'urlParam', 'initParam'],
      sudaPageList: []
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(nv) {
        if (nv) {
          this.params = {
            ...this.params,
            ...nv
          }
        }
      }
    }
  },
  async mounted() {
    this.sudaPageList = []
  },
  methods: {
    // 获取速搭配置页面列表
    addParam() {
      const tempParam = {
        key: '',
        value: undefined
      }
      this.params.routeParams.push(tempParam)
    },
    deleteParam(idx) {
      this.params.routeParams.splice(idx, 1)
    },
    handleParamChange(key, val) {
      this.params[key] = val
      this.$emit('change', this.params)

      // 切换类型时重置其他内容
      if (key === 'jumpType') {
        this.params.formKey = undefined
        this.params.path = ''
        this.params.customUrl = ''
        this.params.routeParams = []
      } else if (key === 'system') {
        this.params.customUrl = ''
      }
    },
    // 输入自定义路径时处理 query，1. 先判断输入是否有效的 url，2. 将当前 query 取出来并添加到下面参数中
    handleCustomUrlChange(url) {
      try {
        const formattedURL = new URL(url)
        const { hash, search } = formattedURL
        let params = {}
        if (hash.indexOf('?' > -1)) {
          const hashQueryStr = hash.split('?')[1]
          const hashQuery = qs.parse(hashQueryStr)
          params = {
            ...params,
            ...hashQuery
          }
        }

        if (search.indexOf('?' > -1)) {
          const searchQueryStr = search.split('?')[1]
          const searchQuery = qs.parse(searchQueryStr)
          params = {
            ...params,
            ...searchQuery
          }
        }

        // 遍历 params 得到 routerParams 字段
        const routerParams = []
        mapKeys(params, (value, key) => {
          routerParams.push({
            key,
            value: {
              dataType: 'string',
              type: 'input',
              value
            }
          })
        })

        this.params.routeParams = routerParams
        // 判断 query 的位置，根据不同情况进行截取
        const hashIdx = url.indexOf('#')
        const lastIdx = url.lastIndexOf('?')
        if (lastIdx > hashIdx && lastIdx > -1) {
          this.params.customUrl = url.slice(0, lastIdx)
        } else {
          this.params.customUrl = url
        }
      } catch (error) {
        this.$message.error('请输入正确的 URL')
        this.params.customUrl = ''
        this.params.routeParams = []
      }

      this.$emit('change', this.params)
    },
    handleRouteParamKeyChange(e, idx) {
      this.params.routeParams[idx].key = e

      this.$emit('change', this.params)
    },
    handleRouteParamValueChange(e, idx) {
      this.params.routeParams[idx].value = e
      const params = {}
      this.$emit('change', this.params)
    }
  }
}
</script>

<style lang="less" scoped>
.pj-panel-wrapper {
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
.pj-label {
  color: #333;
  line-height: 32px;
  height: 32px;
  margin-right: 8px;
}
.pj-radio-group {
  display: flex;
  align-items: center;
}
.pj-select {
  flex: 1;
}
.pj-input {
  flex: 1;
}
.pj-param-input {
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
</style>
