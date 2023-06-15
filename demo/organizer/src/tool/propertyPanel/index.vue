<template>
  <el-drawer
    :modal="false"
    :append-to-body="false"
    :wrapperClosable="true"
    :destroy-on-close="true"
    style="position: absolute"
    direction="rtl"
    class="properties-panel"
    width="100%"
    :size="500"
    @closeDrawer="closeDrawer"
    :visible.sync="showDrawer"
  >
    <div v-if="panelType !== 'condition'">
      <div class="setter-title">设置名称</div>
      <name-setter v-model="name" @change="handelNameChange"> </name-setter>
    </div>
    <div v-if="panelType === 'action'">
      <div class="setter-title">设置行为</div>
      <action-setter
        v-model="actions"
        :context="context"
        :current="currentModel"
        :lf="lf"
      />
    </div>
    <div v-if="panelType === 'condition'">
      <div class="setter-title">设置条件</div>
      <condition-setter
        v-model="condition"
        :context="context"
        ref="edgeProperties"
        :lf="lf"
      />
    </div>
    <div v-if="panelType === 'event'">
      <div class="setter-title">设置事件</div>
      <event-setter
        v-model="event"
        :context="context"
        :current="currentModel"
        :lf="lf"
      />
    </div>
    <div v-if="panelType === 'ds'">
      <div class="setter-title">设置请求</div>
      <ds-setter
        v-model="ds"
        :context="context"
        :current="currentModel"
        :lf="lf"
      />
    </div>
    <div v-if="panelType === 'pageJump'">
      <div class="setter-title">设置跳转</div>
      <page-jump-setter
        v-model="pageJump"
        :lf="lf"
        :context="context"
        :current="currentModel"
      />
    </div>
    <div v-if="panelType === 'dc'">
      <div class="setter-title">数据转换</div>
      <dc-setter
        v-model="dc"
        :lf="lf"
        :context="context"
        :current="currentModel"
      />
    </div>
    <!-- <el-button
      type="primary"
      size="small"
      @click="handleSubmit"
      class="properties-button"
      >确认</el-button
    >
    <el-button size="small" @click="handleCancel" class="properties-button"
      >取消</el-button
    > -->
  </el-drawer>
</template>

<script>
import { map, filter } from "lodash-es";
import { validateCode } from "../../util/validate";
import actionSetter from "./actionSetter.vue";
import conditionSetter from "./conditionSetter.vue";
import eventSetter from "./eventSetter.vue";
import dsSetter from "./dsSetter.vue"; // DataSource
import nameSetter from "./nameSetter.vue";
import pageJumpSetter from "./pageJumpSetter.vue";
import dcSetter from "./dcSetter.vue"; // DataConvert

export default {
  props: {
    lf: Object,
    context: Object,
  },
  data() {
    return {
      panelType: "",
      showDrawer: false,
      currentModel: {},
      currentNode: {},
      currentEdge: {},
      actions: [],
      condition: {},
      event: {},
      ds: {}, // DataSource
      pageJump: {},
      dc: {}, // DataConvert
      name: "",
    };
  },
  mounted() {
    this.lf.on("node:click", ({ data }) => {
      console.log("data", data);
    });
    this.lf.on("blank:click", () => {
      this.showDrawer = false;
      this.panelType = "";
      this.currentEdge = null;
    });
    // 点击边处理
    this.lf.on("edge:option-click", (model) => {
      this.currentEdge = model;
      const properties = model.getProperties();
      this.condition = properties.condition || {};
      this.showDrawer = true;
      this.panelType = "condition";
    });
    // 点击节点处理
    this.lf.on("node:select-click", (model) => {
      console.log("model ===>>>", model);
      this.currentNode = model;
      const properties = model.getProperties();
      this.name = properties.name;
      switch (model.type) {
        case "event-node":
          this.event = (properties && properties.event) || {};
          this.panelType = "event";
          if (
            model.properties &&
            model.properties.componentName !== "pageInit"
          ) {
            this.showDrawer = true;
          }
          break;
        case "reaction-node":
          this.actions = (properties && properties.reactions) || [];
          this.panelType = "action";
          this.showDrawer = true;
          break;
        case "common-node":
          if (properties && properties.componentName === "dataSource") {
            // 打开数据源设置器
            this.ds = (properties && properties.ds) || {};
            this.panelType = "ds";
            this.showDrawer = true;
          } else if (properties && properties.componentName === "pageJump") {
            // 打开页面跳转设置器
            this.pageJump = (properties && properties.pageJump) || {};
            this.panelType = "pageJump";
            this.showDrawer = true;
          } else if (properties && properties.componentName === "dataConvert") {
            // 打开数据转换设置器
            this.dc = (properties && properties.dc) || {};
            this.panelType = "dc";
            this.showDrawer = true;
          }
          break;
      }
    });
  },
  methods: {
    handleChange(data, type) {
      this[type] = data;
    },
    handelNameChange(val) {
      this.name = val;
    },
    handleSubmit() {
      const currentNode = this.currentNode;
      this.lf.setProperties(currentNode.id, {
        name: this.name,
      });
      console.log("this.panelType ...???", this.panelType);
      switch (this.panelType) {
        case "action":
          this.lf.setProperties(currentNode.id, {
            reactions: this.actions,
          });
          break;
        case "condition":
          if (this.currentEdge) {
            this.lf.setProperties(this.currentEdge.id, {
              condition: this.condition,
            });
          }
          break;
        case "event":
          this.lf.setProperties(currentNode.id, {
            event: this.event,
          });
          break;
        case "ds": // DataSource
          this.lf.setProperties(currentNode.id, {
            ds: this.ds,
          });
          break;
        case "pageJump":
          this.lf.setProperties(currentNode.id, {
            pageJump: this.pageJump,
          });
          break;
        case "dc": {
          // DataConvert
          // DONE1: 做请求数据的必填校验（?），是否需要
          const { convertList = [], convertCode } = this.dc;
          // DONE2: 做输入代码段校验，并提示
          // 1. 校验js语法是否正确
          // 2. 检测代码中是否有动态插入的 script 标签
          // 3. 是否需要关注 SQL 注入的危险
          // 4. HTTP 请求是否应该屏蔽

          if (!convertCode) {
            this.$message.error("数据转换函数不能为空");
            return false;
          }

          // 生成预期的函数体，用如下方法包裹用户输入的函数体。
          // function main(arg1, arg2, ...) {}
          try {
            const keyList = filter(
              map(convertList, (item) => item.key),
              (key) => key
            );
            const funcParams = keyList.join(", ");
            const fullFunc = `function main(${funcParams}) {
              ${convertCode}
            }`;

            const valid = validateCode(fullFunc);
            if (!valid) {
              throw new Error("代码校验未通过，请确认代码是否合规");
            }
          } catch (error) {
            console.error("ops, something error --->>>", error);
            this.$message.error(error?.message);
            return;
          }

          this.lf.setProperties(currentNode.id, {
            dc: this.dc,
          });
          break;
        }
      }
      this.showDrawer = false;
      this.$emit("submit", this.panelType);
    },
    handleCancel() {
      this.showDrawer = false;
    },
    closeDrawer() {
      this.currentEdge = null;
    },
  },
  components: {
    conditionSetter,
    actionSetter,
    eventSetter,
    dsSetter,
    nameSetter,
    pageJumpSetter,
    dcSetter,
  },
};
</script>

<style scoped lang="less">
/deep/.el-drawer {
  padding: 12px 12px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    background: transparent;
    border-radius: 5px;
    width: 4px;
    z-index: -1;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 4px;
    background: #dcdfe6;
    z-index: -1;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 4px;
    background: transparent;
  }

  &::-webkit-scrollbar-corner {
    /*滚动条交汇处*/
    border-radius: 4px;
    background: transparent;
  }
}
/deep/.el-drawer__header {
  margin: 0;
  height: 0;
}

.setter-title {
  font-size: 16px;
  font-weight: bold;
  font-size: 16px;
  color: #303133;
  // background: #f2f3f7;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.properties-button {
  float: right;
  margin-top: 20px;
  margin-left: 10px;
}
</style>
