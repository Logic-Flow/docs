# Theme

Themes allow you to uniformly set the appearance of LogicFlow base graphics. Its properties are consistent with [svg attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute).
In most cases, we only need to set a few common properties.

## Common Attributes

- The [stroke](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke) attribute is a presentation attribute defining the color used to paint the outline of the shape.
- The [stroke-dasharray](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray) attribute is a presentation attribute defining the pattern of dashes and gaps used to paint the outline of the shape.
- The [stroke-width](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width) attribute is a presentation attribute defining the width of the stroke to be applied to the shape.
- The [fill](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill) attribute is a presentation attribute that defines the color used to paint the element.
- The [fill-opacity](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-opacity) attribute is a presentation attribute defining the opacity of the paint server (color, gradient, pattern, etc.) applied to a shape.
- The [font-size](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-size) attribute defines the text font size.
- The [color](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color) attribute defines the text color.

Since LogicFlow recommends full customization of node appearance and style in actual business, LogicFlow's own built-in theme styles contain only a very few required styles. You can redefine and extend it based on your own business scenarios.

## Shape Attributes

LogicFlow calls the attributes `width`, `height`, and `r` that affect the size of nodes `shape attributes`. The `shape attributes` affect the anchor position and the related calculation when the nodes are connected. So it is not supported to be configured in the theme, but only when customizing the node. See [NodeModel Shape Attributes](en/api/nodeModelApi#ShapeAttributes) for details.

## baseNode

All nodes built into LogicFlow are white filled with a black border of width 2.

```js
lf.setTheme({
  baseNode: {
    fill: "#FFFFFF",
    stroke: "#000000",
    strokeWidth: 2,
  },
});
```

## rect

LogicFlow's built-in `rect` nodes are all white filled with a black border of width 2.

```js
lf.setTheme({
  rect: {
    fill: "#FFFFFF",
    stroke: "#000000",
    strokeWidth: 2,
  },
});
```

## circle

LogicFlow's built-in `circle` nodes are all white filled with a black border of width 2.

```js
lf.setTheme({
  circle: {
    fill: "#FFFFFF",
    stroke: "#000000",
    strokeWidth: 2,
  },
});
```

## diamond

LogicFlow's built-in `diamond` nodes are all white filled with a black border of width 2.

```js
lf.setTheme({
  diamond: {
    fill: "#FFFFFF",
    stroke: "#000000",
    strokeWidth: 2,
  },
});
```

## ellipse

LogicFlow's built-in `ellipse` nodes are all white filled with a black border of width 2.

```js
lf.setTheme({
  ellipse: {
    fill: "#FFFFFF",
    stroke: "#000000",
    strokeWidth: 2,
  },
});
```

## polygon

LogicFlow's built-in `polygon` nodes are all white filled with a black border of width 2.

```js
lf.setTheme({
  polygon: {
    fill: "#FFFFFF",
    stroke: "#000000",
    strokeWidth: 2,
  },
});
```

## text

LogicFlow's built-in `text` node has a font size of 12 and a black color.

```js
lf.setTheme({
  text: {
    color: "#000000",
    fontSize: 12,
    background: {
      fill: "transparent",
    },
  },
});
```

## anchor

LogicFlow's built-in anchor point is a circle with a radius of 4. In the hover state, a circle of radius 10 is displayed.

```js
lf.setTheme({
  anchor: {
    stroke: "#000000",
    fill: "#FFFFFF",
    r: 4,
    hover: {
      fill: "#949494",
      fillOpacity: 0.5,
      stroke: "#949494",
      r: 10,
    },
  },
});
```

## nodeText

LogicFlow's built-in node text

- `overflowMode`: Controls the display of node text when it exceeds the node:
  - `default`: No processing after exceeding.
  - `autoWrap`: Wrap automatically after exceeding.
  - `ellipsis`: Hide excess and show ellipsis.

```js
lf.setTheme({
  nodeText: {
    color: "#000000",
    overflowMode: "default",
    lineHeight: 1.2,
    fontSize: 12,
  },
});
```

## baseEdge

All edges of LogicFlow built-in are black and have a width of 2.

```js
lf.setTheme({
  baseEdge: {
    stroke: "#000000",
    strokeWidth: 2,
  },
});
```

## line

All `line` of LogicFlow built-in are black and have a width of 2.

```js
lf.setTheme({
  line: {
    stroke: "#000000",
    strokeWidth: 2,
  },
});
```

## polyline

All `polyline` of LogicFlow built-in are black and have a width of 2.

```js
lf.setTheme({
  polyline: {
    stroke: "#000000",
    strokeWidth: 2,
  },
});
```

## bezier

All `bezier` of LogicFlow built-in are black and have a width of 2.

- `adjustLine`: The style of the handle when adjusting the bezier.
- `adjustAnchor`: The style of the anchor points when adjusting the bezier.

```js
lf.setTheme({
  bezier: {
    fill: "none",
    stroke: "#000000",
    strokeWidth: 2,
    adjustLine: {
      stroke: "#949494",
    },
    adjustAnchor: {
      r: 4,
      fill: "#949494",
      stroke: "#949494",
      fillOpacity: 1,
    },
  },
});
```

## edgeText

LogicFlow's built-in edge text

- `textWidth`: Control the maximum width of the edge text.
- `overflowMode`: Control how the edge text is displayed when it exceeds the node.
  - `default`: No processing after exceeding.
  - `autoWrap`: Wrap automatically after exceeding.
  - `ellipsis`: Hide excess and show ellipsis.
- `background`: Control the background of the edge text.

```js
lf.setTheme({
  edgeText: {
    textWidth: 100,
    overflowMode: "default",
    fontSize: 12,
    background: {
      fill: "#FFFFFF",
    },
  },
});
```

## arrow

Style of arrows

- `offset`: Length of the arrow
- `verticalLength`: Vertical width of the arrow

```js
lf.setTheme({
  arrow: {
    offset: 10,
    verticalLength: 5,
  },
});
```

## anchorLine

Style of the straight line dragged from an anchor point when manually connecting nodes.

```js
lf.setTheme({
  anchorLine: {
    stroke: "#000000",
    strokeWidth: 2,
    strokeDasharray: "3,2",
  },
});
```

## snapline

Style of the snapline

```js
lf.setTheme({
  snapline: {
    stroke: "#949494",
    strokeWidth: 1,
  },
});
```

## edgeAdjust

The style of the adjustment points at both ends of the edge, when the setting allows adjusting the start and end points of the edge.

```js
lf.setTheme({
  edgeAdjust: {
    r: 4,
    fill: "#FFFFFF",
    stroke: "#949494",
    strokeWidth: 2,
  },
});
```

## outline

Style of the status box in the selected or hover state for nodes and edges.

```js
lf.setTheme({
  outline: {
    fill: "transparent",
    stroke: "#949494",
    strokeDasharray: "3,3",
    hover: {
      stroke: "#949494",
    },
  },
});
```
