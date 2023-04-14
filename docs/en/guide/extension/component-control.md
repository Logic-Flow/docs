# Control Panel

### Getting started

```ts
import LogicFlow from "@logicflow/core";
import { Control } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";

LogicFlow.use(Control);
```

After registering the `Control` component, LogicFlow will create a control panel at the top right of the canvas, as follows.

The control panel provides the usual ability to zoom in and out or adapt to the canvas, and also has built-in redo and undo functionality. If you don't like this UI or functionality, you can also define your own based on the [API](en/api/logicFlowApi) provided by `LogicFlow`.

### Add options

```js
lf.extension.control.addItem({
  iconClass: "custom-minimap",
  title: "",
  text: "Navigation",
  onMouseEnter: (lf, ev) => {
    const position = lf.getPointByClient(ev.x, ev.y);
    lf.extension.miniMap.showMiniMap.show(
      position.domOverlayPosition.x - 120,
      position.domOverlayPosition.y + 35
    );
  },
  onClick: (lf, ev) => {
    const position = lf.getPointByClient(ev.x, ev.y);
    lf.extension.miniMap.show(
      position.domOverlayPosition.x - 120,
      position.domOverlayPosition.y + 35
    );
  },
});
```

### Example

<a href="https://codesandbox.io/embed/intelligent-matsumoto-t1dc5?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>
