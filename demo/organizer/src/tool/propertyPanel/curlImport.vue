<template>
<div class="curl-import">
  <el-button class="import-btn" type="text" @click="$_openDialog">从cURL语句导入</el-button>
  <el-dialog :visible.sync="dialogInfo.visible" destroy-on-close title="cURL语句导入" custom-class="ds-dialog__import" append-to-body>
    <div>
      <el-input type="textarea" v-model="dialogInfo.value" :autosize="{minRows: 8}"></el-input>
    </div>
    <div class="btns" slot="footer">
      <el-button size="small" @click="$_cancelImport">取消</el-button>
      <el-button size="small" type="primary" @click="$_confirmImport">导入</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: '',
  components: {},
  data () {
    return {
      dialogInfo: {
        visible: false,
        value: ''
      }
    }
  },
  methods: {
    $_openDialog() {
      this.dialogInfo = {
        visible: true,
        value: ''
      }
    },
    $_cancelImport() {
      this.dialogInfo.visible = false
    },
    $_confirmImport() {
      this.$emit('import', this.$_getRequestMsg(this.dialogInfo.value))
      this.dialogInfo.visible = false
    },
    $_getRequestMsg(str) { // cURL语句解析过程
      const res = {
        requestMethod: 'GET' // curl语句中不一定会明确指定请求方法， 默认get
      }
      const haveGetOption = str.match(/\s-G\s/) || str.match(/\s--get\s/);
      // 表示使用get方法发送-d数据
      if (haveGetOption) {
        res.requestMethod = 'GET';
      }
      const strArr = str.split(' \\');
      let queryParams = {};
      let bodyParams = {};
      strArr.forEach((item) => {
        const reg = /'[\s\S]*'/; // 获取单引号中的参数内容
        // curl开头的语句， 可以取到url
        if (item.match(/curl\s/)) {
          // 正则表达式判断URL地址合法性
          /* eslint-disable-next-line */
          const strUrl= /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+\b/;
          const urlMsg = item.match(strUrl);
          if (urlMsg) {
            const urlArray = urlMsg[0].split('?');
            // 获取url地址
            /* eslint-disable-next-line */
            res.requestUrl = urlArray[0];
            if (urlArray[1]) {
              // 在这里拿query参数
              queryParams = {
                ...queryParams,
                ...parseQueryString(`?${urlArray[1]}`),
              };
            }
          }
        }
        // 获取指定的请求方法
        if (item.match(/\s-X\s/) || item.match(/\s--request\s/)) {
          if (item.indexOf('POST') > -1) {
            res.requestMethod = 'POST';
          } else if (item.indexOf('GET') > -1) {
            res.requestMethod = 'GET';
          }
        }
        // 获取body参数
        // curl命令中发送body参数所使用的命令
        const bodyParamsOptions = [
          /\s-d\s/,
          /\s--data\s/,
          /\s--data-urlencode\s/,
          /\s--data-raw\s/,
          /\s--data-binary\s/,
          /\s--data-ascii\s/,
        ];
        if (bodyParamsOptions.some((option) => !!item.match(option))) {
          const params = item.match(reg);
          if (params) {
            const value = params[0].slice(1, -1);
            try {
              // 如果是json格式
              const json = JSON.parse(value);
              if (haveGetOption) {
                queryParams = {
                  ...queryParams,
                  ...json,
                };
              } else {
                res.requestMethod = 'POST'
                bodyParams = {
                  ...bodyParams,
                  ...json,
                };
              }
            } catch (error) {
              // 如果是表达式
              const regParam = new RegExp(/\S+=\S+/);
              if (regParam.test(value)) {
                const [key, val] = value.split('=');
                if (haveGetOption) {
                  queryParams = {
                    ...queryParams,
                    [key]: val,
                  };
                } else {
                  bodyParams = {
                    ...bodyParams,
                    [key]: val,
                  };
                }
              }
            }
          }
        }
      });
      res.queryParams = this.transJsonToTable(queryParams);
      res.bodyParams = this.transJsonToTable(bodyParams);
      return res;
    },
    parseQueryString(search){
      if (search.length <= 0) return {};
      const res = {};
      const queryParams = decodeURIComponent(search).slice(1).split('&');
      queryParams.forEach((query) => {
        const [key, value] = query.split('=');
        res[key] = value;
      });
      return res;
    },
    transJsonToTable(params) {
      const list = [];
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          const property = params[key];
          const { fieldType, fieldTypeName } = this.getPropertyType(property);
          const paramExample =
            fieldTypeName === 'json' || fieldTypeName === 'list' ? JSON.stringify(property) : property;
          list.push({
            key,
            keyType: 'custom',
            value: {
              type: 'input',
              keyType: 'custom',
              value: paramExample,
              dataType: fieldType
            },
            required: 0
          });
        }
      }
      return list;
    },
    // 识别参数类型
    getPropertyType(property) {
      let fieldTypeName = {}.toString.call(property).slice(8, -1).toLowerCase();
      return {
        fieldType: fieldTypeName
      };
    }
  }
}
</script>

<style lang="less" scoped>
.curl-import {
  .import-btn {
    font-size: 12px;
    padding: 0;
    border: 0;
    font-size: 12px;
  }
  /deep/ .ds-dialog__import {
    width: 800px;
    .el-dialog__body {

    }
    .btns {
      text-align: right;
    }
  }
}
</style>
