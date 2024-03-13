# Dnd

> In the flowchart editing scenario, in addition to configuring the registration nodes by code, we may also need to create flowcharts through GUI operations, which can be achieved by dragging and dropping.

Dragging needs to be implemented in combination with a graphical panel, steps: create panel → drag initialization → listen to drop event and create node

Example:

```js
lf.dnd.startDrag({
  type,
  text: `${type}node`,
});
```

<a href="https://codesandbox.io/embed/logicflow-base18-odj3g?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>

As can be seen from the above code, the node is drawn into the panel through the `div` tag + `css` style, and the `onMouseDown` event is bound to it. When dragging the graphics, the `lf.dnd.startDrag` function will be triggered, which means that the dragging will start. The input parameters of `startDrag`:

```js
lf.dnd.startDrag(nodeConfig: NodeConfig):void

type NodeConfig = {
  id?: string; // It is not recommended to pass id directly, the id of logicflow is not allowed to be repeated
  type: string;
  text?: TextConfig;
  properties?: Record<string, unknown>;
};
```

When the mouse is released at the end of the drag, the current mouse position is converted to coordinates on the canvas and used as the node's center point coordinates `x`, `y`, and then the coordinates are merged with the `nodeConfig` passed in by the dragged node. Call the `lf.addNode` method to create the node after listening to the drop event.

!> **Note**  
If you are using an image as a node added in the configuration panel, you need to set it to be non-draggable. For details, please refer to [#267](https://github.com/didi/LogicFlow/issues/267)

**Using the Drag and Drop Panel Plugin**

LogicFlow has a built-in **Drag and Drop Panel Plugin** in the extension package. If you don't want to customize the graphics panel, you can use this plug-in for a quick implementation. See [dnd-panel](en/guide/extension/component-dnd-panel)。
