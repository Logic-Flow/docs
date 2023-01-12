# Introduction

> The initial goal of LogicFlow was to develop a extensible flowchart drawing tool that could be used to meet a variety of business needs. In order to make LogicFlow extensible enough, LogicFlow develops all non-core functionality using plugins, which are then placed in the `@logicflow/extension` package.

### Install global plug-ins

Using from npm
```js
import { BpmnElement } from '@logicflow/extension';
LogicFlow.use(BpmnElement);
```

Using from cdn

```html
<!--the css file of the LogicFlow core package-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@logicflow/core/dist/style/index.css" />
<!--the css file of the LogicFlow extension package-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@logicflow/extension/lib/style/index.css" />
<!--the js file of the LogicFlow core package-->
<script src="https://cdn.jsdelivr.net/npm/@logicflow/core/dist/logic-flow.js"></script>
<!--LogicFlow's plug-ins support individual imports, here is an example of a menu plug-in-->
<script src="https://cdn.jsdelivr.net/npm/@logicflow/extension/lib/Menu.js"></script>
<script>
  LogicFlow.use(Menu);
</script>
```

### Install the plugin on the instance

Added in `v1.0.7`

When multiple pages using LogicFlow exist for a single-page application, the plug-ins used may be different for different pages. When LogicFlow is initialized, the plug-in is passed as a parameter to the constructor, at which point the plug-in overrides the global plug-in.

```js
import LogicFlow from "@logicflow/core";
import { DndPanel, SelectionSelect } from "@logicflow/extension";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";

const lf = new LogicFlow({
  container: document.querySelector("#app"),
  grid: true,
  plugins: [DndPanel, SelectionSelect]
});
```

