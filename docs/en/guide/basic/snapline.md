# Snapline

The snapline can assist in position adjustment by comparing the position of the moving node with the position of other nodes in the canvas. The position comparison includes the following two aspects.

- The center position of the node
- The border of node

## Use snapline

The snapline is turned on by default in edit mode, and can be turned off by configuration.  
In [silent-mode](en/guide/basic/silent-mode), it is not possible to move nodes, so the snapline is turned off and cannot be turned on by configuration.

```ts
// Turn off the snapline
const lf = new LogicFlow({
  snapline: false,
});
```

## Set the style of the snapline

The style of the alignment line includes color and width, which can be modified by setting the theme.

```ts
// Default configuration
{
  stroke: '#1E90FF',
  strokeWidth: 1,
}
// Modify the snapline style
lf.setTheme({
  snapline: {
    stroke: '#1E90FF', // the color of snapline
    strokeWidth: 1, // the width of snapline
  },
})
```

<example :height="400" ></example>

See [theme](en/guide/basic/theme) for more style modifications
