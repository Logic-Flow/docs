# Getting started

## What is LogicFlow

LogicFlow is a flowchart editing framework that provides a series of functions necessary for flowchart interaction and editing, as well as flexible node customization, plug-ins and other expansion mechanisms. LogicFlow supports front-end R&D to develop various logic orchestration scenarios, such as flowcharts, ER diagrams, BPMN processes, etc. It has good applications in work approval configuration, robot logic orchestration, and process configuration in no code platform.

For more information, see [the LogicFlow article series](en/article/article01)

## Quick start

### Import directly with `<script>`

LogicFlow is divided into the `core` package and the `extension` package. Since LogicFlow has some preset styles, you need to import css files in addition to js files.

```html
<!--the css file of the LogicFlow core package-->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@logicflow/core/dist/style/index.css"
/>
<!--the css file of the LogicFlow extension package-->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@logicflow/extension/lib/style/index.css"
/>
<!--the js file of the LogicFlow core package-->
<script src="https://cdn.jsdelivr.net/npm/@logicflow/core/dist/logic-flow.js"></script>
<!--LogicFlow's plug-ins support individual imports, here is an example of a menu plug-in-->
<script src="https://cdn.jsdelivr.net/npm/@logicflow/extension/lib/Menu.js"></script>
```

All plugins of LogicFlow are located at：[https://cdn.jsdelivr.net/npm/@logicflow/extension/lib/](https://cdn.jsdelivr.net/npm/@logicflow/extension/lib/)

### Import using npm

```shell
npm install @logicflow/core
npm install @logicflow/extension
```

## Draw a simple flowchart

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
      text: "node1",
    },
    {
      id: "2",
      type: "circle",
      x: 300,
      y: 200,
      text: "node2",
    },
  ],
  edges: [
    {
      sourceNodeId: "1",
      targetNodeId: "2",
      type: "polyline",
      text: "polyline",
    },
  ],
});
```

<a href="https://codesandbox.io/embed/logicflow-base1-forked-zy3o85?fontsize=14&hidenavigation=1&theme=dark" target="_blank"> Demo in CodeSandBox</a>

### Use logicflow in front-end frameworks such as vue or react

LogicFlow is packaged as a JS file via umd, so it can be used in either vue or react. Note that when initializing a LogicFlow instance, the parameter container must exist on the dom, otherwise it will report an error `Check if the container parameter is valid`.

?> **Note** LogicFlow will use the container's width and height by default if no container width and height parameter is provided during initialization. Please make sure that the container already has a width and height when you initialize LogicFlow.

[View vue examples in Sandbox](https://codesandbox.io/s/github/towersxu/logicflow-vue-base/tree/main/?fontsize=14&hidenavigation=1&theme=dark)

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

[View react examples in Sandbox](https://codesandbox.io/s/empty-waterfall-2x7eql)

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
