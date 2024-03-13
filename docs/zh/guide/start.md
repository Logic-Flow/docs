# 介绍

## LogicFlow 是什么

LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和灵活的节点自定义、插件等拓展机制。LogicFlow 支持前端研发自定义开发各种逻辑编排场景，如流程图、ER 图、BPMN 流程等。在工作审批配置、机器人逻辑编排、无代码平台流程配置都有较好的应用。

更多资料请查看[LogicFlow 系列文章](zh/article/article01)

## 安装

### 直接用`<script>`引入

LogicFlow 分为`core`包和`extension`包。由于 LogicFlow 本身会有一些预置样式，所以除了需要引入 js, 还需要引入 css。

```html
<!--LogicFlow core包css-->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@logicflow/core/dist/style/index.css"
/>
<!--LogicFlow extension包css-->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@logicflow/extension/lib/style/index.css"
/>
<!--LogicFlow core包js-->
<script src="https://cdn.jsdelivr.net/npm/@logicflow/core/dist/logic-flow.js"></script>
<!--LogicFlow的插件支持单个引入，这里以菜单插件为例-->
<script src="https://cdn.jsdelivr.net/npm/@logicflow/extension/lib/Menu.js"></script>
```

LogicFlow 所有的插件地址：[https://cdn.jsdelivr.net/npm/@logicflow/extension/lib/](https://cdn.jsdelivr.net/npm/@logicflow/extension/lib/)

### 使用 npm 引入

```shell
npm install @logicflow/core
npm install @logicflow/extension
```

## 绘制一个简单的流程图

```js
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";

const lf = new LogicFlow({
  container: document.querySelector("#app"),
  grid: true,
});

lf.render({
  nodes: [
    {
      id: "1",
      type: "rect",
      x: 100,
      y: 100,
      text: "节点1",
    },
    {
      id: "2",
      type: "circle",
      x: 300,
      y: 200,
      text: "节点2",
    },
  ],
  edges: [
    {
      sourceNodeId: "1",
      targetNodeId: "2",
      type: "polyline",
      text: "连线",
    },
  ],
});
```
[去 CodeSandbox 查看示例](https://codesandbox.io/s/logicflow-example-1-zy3o85)

### 在 vue 或者 react 等前端框架中使用 logicflow

LogicFlow 本身是以 umd 打包为纯 JS 的包，所以不论是 vue 还是 react 中都可以使用。这里需要注意一个点，那就是初始化 LogicFlow 实例的时候，传入的参数 container,必须要 dom 上存在这个节点，不然会报错`请检查 container 参数是否有效`。

?> **注意**LogicFlow 支持初始化不传容器宽高参数，这个时候默认会使用 container 的宽高。请保证初始化 LogicFlow 的时候，container 已经存在宽高了。

[去 CodeSandbox 查看 vue 示例](https://codesandbox.io/s/small-resonance-h4u0fx)

```vue
<template>
  <div class="container" ref="container"></div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";

export default {
  mounted() {
    this.lf = new LogicFlow({
      container: this.$refs.container,
      grid: true,
    });
    this.lf.render();
  },
};
</script>

<style scoped>
.container {
  width: 1000px;
  height: 500px;
}
</style>
```

[去 CodeSandbox 查看 react 示例](https://codesandbox.io/s/empty-waterfall-2x7eql)

```js
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import { useEffect, useRef } from "react";

export default function App() {
  const refContainer = useRef();
  useEffect(() => {
    const logicflow = new LogicFlow({
      container: refContainer.current,
      grid: true,
      width: 1000,
      height: 500,
    });
    logicflow.render();
  }, []);
  return <div className="App" ref={refContainer}></div>;
}
```
