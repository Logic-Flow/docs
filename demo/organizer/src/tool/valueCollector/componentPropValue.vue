<template>
  <div>
    <el-select
      v-model="val"
      size="small"
      placeholder="请选择页面组件"
      filterable
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        size="small"
        :value="item.value"
        @mouseenter.native="handleMouseEnter(item.value)"
      >
        <span style="float: left">
          <b>{{ item.name }}</b>
        </span>
      </el-option>
    </el-select>
    <el-select
      v-show="showPropSelet"
      v-model="propName"
      class="prop-select"
      size="small"
      placeholder="请选择属性"
      @change="handlePropChange"
    >
      <el-option
        v-for="item in propOptions"
        :key="item.value"
        :label="item.label"
        size="small"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-input
      v-show="showFieldInput"
      v-model="fieldName"
      placeholder="请输入字段名"
      size="small"
      class="field-input"
      @change="handleFieldChange"
    >
    </el-input>
  </div>
</template>

<script>
import { getNodeName } from "../../util/node";
export default {
  props: {
    context: Object,
    value: Object,
  },
  data() {
    return {
      val: "",
      propName: "",
      fieldName: "",
      // showFieldInput: false
    };
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(nv) {
        if (nv && nv.type === "componentProp") {
          this.val = nv.componentId;
          this.propName = nv.prop;
          this.fieldName = nv.field;
        }
      },
    },
  },
  methods: {
    // 鼠标悬浮时高亮画布对应组件
    handleMouseEnter(e) {},
    // 选择组件后获取组件值
    handleChange(e) {
      this.val = e;
      const data = {
        type: "componentProp",
        prop: this.propName,
        field: this.fieldName,
        componentId: this.val,
        componentName: this.selectModel && this.selectModel.getModelName(),
        propName: this.selectedProp && this.selectedProp.label,
      };
      this.$emit("change", data);
    },
    // 选择属性后抛出事件
    handlePropChange() {
      const data = {
        type: "componentProp",
        prop: this.propName,
        field: this.fieldName,
        componentId: this.val,
        dataType: this.selectedProp.dataType,
        componentName: this.selectModel && this.selectModel.getModelName(),
        propName: this.selectedProp && this.selectedProp.label,
      };
      this.$emit("change", data);
    },
    // 输入字段名后抛出事件
    handleFieldChange() {
      const data = {
        type: "componentProp",
        prop: this.propName,
        field: this.fieldName,
        componentId: this.val,
        dataType: this.selectedProp.dataType,
        componentName: this.selectModel && this.selectModel.getModelName(),
        propName: this.selectedProp && this.selectedProp.label,
      };
      this.$emit("change", data);
    },
    getLogicModelList() {
      return [];
    },
  },
  computed: {
    // 页面组件选项
    options() {
      let modelList = this.getLogicModelList();
      const options = modelList.map((item) => {
        return {
          id: item.id,
          value: item.id,
          name: getNodeName(item),
          label: `${getNodeName(item)}`,
        };
      });
      return options;
    },
    // 属性选项
    propOptions() {
      const modelList = this.getLogicModelList();
      const selectModel = modelList.find((item) => item.id === this.val);
      let options = [];
      if (selectModel && selectModel.getLogic) {
        const logic = selectModel.getLogic();
        const props = logic.props;
        options = props.map((item) => {
          return {
            label: item.description,
            value: item.name,
            dataType: item.propType,
          };
        });
      }
      return options;
    },
    showPropSelet() {
      return this.val ? true : false;
    },
    // 是否展示属性输入框
    showFieldInput() {
      let showFieldInput = false;
      if (this.selectModel && this.selectModel.getLogic) {
        const logic = this.selectModel.getLogic();
        const props = logic.props || [];
        const selectProp = props.find((item) => item.name === this.propName);
        if (selectProp && selectProp.propType === "object")
          showFieldInput = true;
      }
      return showFieldInput;
    },
    selectedProp() {
      return this.propOptions.find((item) => item.value === this.propName);
    },
    selectModel() {
      const modelList = this.getLogicModelList();
      const selectModel = modelList.find((item) => item.id === this.val);
      return selectModel;
    },
  },
};
</script>

<style scoped lang="less">
/deep/.el-select {
  width: 100%;
}
.prop-select {
  margin-top: 2px;
}

.field-input {
  margin-top: 2px;
}
</style>
