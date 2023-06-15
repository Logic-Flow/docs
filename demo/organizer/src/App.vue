<template>
  <div id="app">
    <div class="organizer-panel-wrapper">
      <el-container class="organizer-container">
        <logic-panel
          class="logic-panel-wrapper"
          :context="context"
          :info="info"
        ></logic-panel>
      </el-container>
    </div>
  </div>
</template>

<script>
import './index.less'
import Context from './context'
import mockDetail from './mock/mockLogicList';
import LogicPanel from "./components/LogicPanel.vue";


export default {
  name: "LogicSetter",
  data() {
    return {
      context: new Context({ logicList: [] }),
      // context: new Context(mockDetail),
      info: undefined,
    };
  },
  components: { LogicPanel }
};
</script>

<style>
@import "./assets/base.css";

#app {
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

.organizer-panel-wrapper {
  width: 100%;
  height: 100%;
  background: #eaecef;
  border: 1px solid #ccc;
}

.organizer-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
