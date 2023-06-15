<template>
  <div class="ds-panel-wrapper" v-loading="isFetching">
    <div class="panel-item item-wrap">
      <div class="ds-label">请求来源：</div>
      <el-radio-group
        class="ds-type-radio"
        size="small"
        v-model="fetchMode"
        @change="handleDsTypeChange"
      >
        <!-- 直连模式 -->
        <el-radio label="direct">宿主系统</el-radio>
        <!-- 转发模式 -->
        <el-radio label="redirect">资源引擎</el-radio>
        <!-- 自定义接口 -->
        <el-radio label="custom">自定义</el-radio>
      </el-radio-group>
    </div>
    <div class="panel-item item-wrap" v-if="fetchMode !== 'custom'">
      <div class="ds-label">请求接口：</div>
      <el-select
        filterable
        v-model="apiId"
        class="ds-select"
        size="small"
        placeholder="请选择"
        v-if="fetchMode === 'direct'"
        @change="handleDsChange"
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

      <el-select
        filterable
        v-model="apiId"
        class="ds-select"
        size="small"
        placeholder="请选择"
        v-else-if="fetchMode === 'redirect'"
        @change="handleDsChange"
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
    <!-- curl语句导入 -->
    <div class="panel-item item-wrap" v-if="fetchMode === 'custom'">
      <CurlImport @import="$_importData"></CurlImport>
    </div>
    <div class="panel-item item-wrap" v-if="fetchMode === 'custom'">
      <div class="ds-label">请求接口名称：</div>
      <el-input
        v-model="requestName"
        placeholder="请输入"
        size="small"
        @change="handleDsChange"
      >
      </el-input>
    </div>
    <div class="panel-item item-wrap" v-if="fetchMode === 'custom'">
      <div class="ds-label">请求接口地址：</div>
      <el-input
        v-model="requestUrl"
        placeholder="请输入"
        size="small"
        @change="handleDsChange"
      >
      </el-input>
    </div>
    <div class="panel-item item-wrap" v-if="fetchMode === 'custom'">
      <div class="ds-label">请求方法：</div>
      <el-select
        filterable
        v-model="requestMethod"
        class="ds-select"
        size="small"
        placeholder="请选择"
        @change="handleDsChange"
      >
        <el-option
          v-for="item in requestMethodMap"
          :key="item.value"
          :label="item.label"
          size="small"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="item-wrap">
      <div class="ds-label">请求参数配置：</div>
      <el-tabs v-model="activeType">
        <el-tab-pane label="Query" name="query">
          <param-collector
            v-model="queryParams"
            :lf="lf"
            :paramList="queryParamList"
            :context="context"
            @change="handleQueryParamsChange"
          ></param-collector>
        </el-tab-pane>
        <el-tab-pane label="Body" name="body">
          <param-collector
            v-model="bodyParams"
            :lf="lf"
            :paramList="bodyParamList"
            :context="context"
            @change="handleBodyParamsChange"
          ></param-collector>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="item-wrap" v-if="fetchMode === 'direct'">
      <div class="ds-label">请求失败配置：</div>
      <div>
        当请求失败时，是否继续执行后续逻辑：
        <el-switch
          v-model="continueOnError"
          @change="handleErrorChange"
          active-text="是"
          inactive-text="否"
          size="mini"
        ></el-switch>
      </div>
    </div>
  </div>
</template>

<script>
import paramCollector from "../paramCollector/index.vue";
import { requestMethodMap } from "../../util/typeMap";
import CurlImport from "./curlImport.vue";

export default {
  props: {
    lf: Object,
    context: Object,
    current: Object,
    value: {
      type: Object,
      default: () => {},
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      requestMethodMap,
      requestName: "", // 自定义接口名称
      requestUrl: "", // 自定义接口地址
      requestMethod: "GET", // 自定义接口请求方法
      fetchMode: "direct",
      apiId: "",
      activeType: "query",
      continueOnError: false,
      apiList: [],
      options: [],
      queryParamList: [],
      bodyParamList: [],
      queryParams: [],
      bodyParams: [],
      headerParams: [],
      isFetching: false,
    };
  },
  watch: {
    "value.fetchMode": {
      immediate: true,
      async handler(nv) {
        this.fetchMode = nv || "direct";
      },
    },
    "value.id": {
      immediate: true,
      async handler(nv) {
        if (this.value.fetchMode === "custom") return;
        this.apiId = nv;
        if (!nv) return;
        if (!(this.options && this.options.length)) {
          await this.getApiOptions();
        }
        this.getParamList();
      },
    },
    value: {
      immediate: true,
      deep: true,
      async handler(nv) {
        this.queryParams = (nv && nv.queryParams) || [];
        this.bodyParams = (nv && nv.bodyParams) || [];
        this.headerParams = (nv && nv.headerParams) || [];
        this.continueOnError = nv.continueOnError;
        if (this.value.fetchMode === "custom") {
          this.requestName = nv && nv.name;
          this.requestUrl = nv && nv.url;
          this.requestMethod = nv && nv.method;
          this.queryParamList = this.queryParams;
          this.bodyParamList = this.bodyParams;
        }
      },
    },
  },
  created() {
    this.getApiOptions();
  },
  computed: {
    api() {
      return this.apiList.find((item) => item.id === this.apiId) || {};
    },
  },
  methods: {
    async getApiOptions() {
      this.options = [];
    },
    getParamList() {
      const resourceId =
        this.fetchMode === "direct" ? this.api.id : this.api.resourceId;
      if (!resourceId) return;
    },
    handleDsTypeChange(e) {
      this.reset();
      this.apiId = undefined;
      this.getApiOptions();
    },
    handleDsChange(e) {
      this.reset();
      this.apiId = e;
      this.handleChange();
    },
    handleQueryParamsChange(e) {
      this.queryParams = e;
      this.handleChange();
    },
    handleBodyParamsChange(e) {
      this.bodyParams = e;
      this.handleChange();
    },
    handleErrorChange() {
      this.handleChange();
    },
    handleChange() {
      let ds;
      if (this.fetchMode === "custom") {
        // 如果是自定义接口
        ds = {
          name: this.requestName,
          url: this.requestUrl,
          method: this.requestMethod,
          fetchMode: "custom",
          queryParams: this.queryParams,
          bodyParams: this.bodyParams,
          headerParams: this.headerParams,
        };
      } else {
        // 如果是数据源接口
        ds = {
          id: this.api.id,
          name: this.api.name,
          key:
            this.fetchMode === "direct"
              ? this.api.resourceKey
              : this.api.apiKey,
          url: this.api.httpApiResourceVO.url,
          method: this.api.httpApiResourceVO.requestType,
          contentType: this.api.httpApiResourceVO.contentType,
          fetchMode: this.api.fetchMode,
          resourceId: this.api.resourceId,
          tenant: this.api.tenant,
          extJson: this.api.extJson,
          queryParams: this.queryParams,
          bodyParams: this.bodyParams,
          headerParams: this.headerParams,
          continueOnError: this.continueOnError,
        };
      }
      this.$emit("change", ds);
    },
    reset() {
      this.queryParamList = [];
      this.bodyParamList = [];
      this.queryParams = [];
      this.bodyParams = [];
      this.headerParams = [];
    },
    $_importData({ requestMethod, requestUrl, queryParams, bodyParams }) {
      // 导入数据
      this.requestMethod = requestMethod;
      this.requestUrl = requestUrl;
      this.queryParams = bodyParams;
      this.bodyParams = bodyParams;
      this.handleChange();
    },
  },
  components: {
    paramCollector,
    CurlImport,
  },
};
</script>

<style scoped lang="less">
.ds-panel-wrapper {
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
.ds-label {
  color: #333;
  line-height: 32px;
  height: 32px;
  margin-right: 8px;
  min-width: 90px;
}
.ds-type-radio {
  display: flex;
  align-items: center;
}
.ds-select {
  flex: 1;
}
</style>
