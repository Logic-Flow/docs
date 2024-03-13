# Box selection

```ts
import LogicFlow from "@logicflow/core";
import { SelectionSelect } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";

LogicFlow.use(SelectionSelect);
```

### Getting started

```ts
lf.openSelectionSelect();

// New usage in version 1.1.0
lf.extension.selectionSelect.openSelectionSelect();
```

### Close

```ts
lf.closeSelectionSelect();
// New usage in version 1.1.0
lf.extension.selectionSelect.closeSelectionSelect();
```

<!-- <example href="/examples/#/extension/components/selection" :height="300" ></example> -->

### Default State

Whether box selection is enabled by default is affected by whether the canvas is allowed to be dragged. The canvas can be dragged and the box selection cannot exist at the same time.

```js
const lf = new LogicFlow({
  container: document.querySelector("#app"),
  stopMoveGraph: true,
});
```

If `stopMoveGraph` is true, which means that dragging the canvas is not allowed, then box selection is allowed by default.

If `stopMoveGraph` is not true, which means that dragging the canvas is allowed, then box selection is not allowed by default.

In most cases, we expect to allow dragging of the canvas and open the box selection only when the user clicks on the drag and drop panel. Please refer to [the dnd panel plugin](zh/guide/extension/component-dnd-panel).

### Set the sensitivity of the selected area

- By default you need to box the entire node to select it.
- By default, you need to box the start and end of the edge to select it.

You can call the method `setSelectionSense` in the plugin to reset the rules

| Parameters  | Default Value | Description                                                                                                                             |
| ----------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| isWholeEdge | true          | When the value is true, the start and end points of the edge are all within the range of the selection area, which means it is selected |
| isWholeNode | true          | When the value is true, all points of the node are in the range of the selection area, which means it is selected                       |

usage:

```js
lf.extension.selectionSelect.setSelectionSense(false, true);
```

### Example

<a href="https://codesandbox.io/embed/trusting-archimedes-m0bn4r?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>
