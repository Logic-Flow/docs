# Grid

A grid is the smallest unit for rendering/moving nodes. The main purpose of the grid is to ensure that the position of the center point of each node is on the grid when moving the nodes. This is better for node alignment. Generally speaking, the larger the interval of the grid, the easier it is for the nodes to align when editing the flowchart; the smaller the interval of the grid, the smoother the feeling of dragging the nodes.

The grid is off by default and the minimum unit of rendering/movement is 1px. If grid is turned on, the default grid size is 20px. When rendering a node, it means aligning to the grid with a minimum unit of 20 px, and when moving a node, it means that the minimum distance of each movement is 20 px.

?> **Note** When setting the node coordinates, the coordinates are converted according to the size of the grid, e.g. the actual position of the node rendered to the canvas after setting the center position `{ x: 124, y: 138 }` is `{ x: 120, y: 140 }`. So when you use LogicFlow to replace the old process designer in your project, you need to work with the coordinates of the historical data.

!> **Tip** In actual development, if it is expected that the nodes can be center-aligned or aligned on both sides, then the width and height of the custom nodes need to be an even multiple of the grid. Assuming a grid of 20, all node widths should preferably be 20, 40, 80, 120.

## Open Grid

Set the grid properties by configuring `grid` when creating the canvas.

Turn on the grid and apply the default properties.

```js
const lf = new LogicFlow({
  grid: true,
});

// Equivalent to the default properties as follows
const lf = new LogicFlow({
  grid: {
    size: 20,
    visible: true,
    type: "dot",
    config: {
      color: "#ababab",
      thickness: 1,
    },
  },
});
```

## Set grid properties

Support setting properties such as grid size, type, grid line color and width.

```js
export type GridOptions = {
  size?: number  // Grid size
  visible?: boolean,  // Visible or not, if set to false, the grid lines are not displayed but the grid effect is still retained
  type?: 'dot' | 'mesh', // Grid type, currently supports dot and mesh
  config?: {
    color: string,  // Grid color
    thickness?: number,  // Width of grid lines
  }
};
```

## Example

<a href="https://codesandbox.io/embed/logicflow-base8-hxtqr?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>
