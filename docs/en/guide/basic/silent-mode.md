# Set the editing method of flowchart

LogicFlow provides a lot of configurations on how to edit flowcharts, see [editConfigModel](en/api/editConfigModelApi)。

## Initialization

LogicFlow supports passing in the configuration for flowchart editing at initialization time.

```js
const lf = new LogicFlow({
  stopZoomGraph: true, // No scaling
  stopScrollGraph: true, // Disallow moving the canvas by mouse scrolling
});
```

## Update the flowchart editing method

```js
lf.updateEditConfig({
  stopZoomGraph: false,
  stopScrollGraph: false,
});
```

## Silent mode

The silent mode of the canvas can be simply understood as a "read-only" mode. In this mode, the nodes and edges in the canvas cannot be moved, have no anchors, and their text cannot be modified.

> **Tip**  
> Silent mode is a shortcut to control how flowcharts are edited.

```ts
// Turn on silent mode
const lf = new LogicFlow({
  isSilentMode: true,
});
```

<a href="https://codesandbox.io/embed/pedantic-microservice-db76o?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>
