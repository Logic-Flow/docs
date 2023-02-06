# transformModel

Control the zoom in, zoom out, and pan of the canvas

```ts
type PointTuple = [number, number]
```

## zoom(zoomSize, point)

Zoom in and out of the canvas. The scale for zooming in and out is `transformModel.ZOOM_SIZE`

|Name|Type|Default|Description|
|-|-|-|-|
|isZoomIn|boolean|false| Zoom in/out value. Support passing in a number between 0 and n, less than 1 means zoom in, more than 1 means zoom out. It also supports passing true and false to zoom in and out according to the built-in scale. |
|point|PointTuple|-|Zoom in and out of the reference point, which can be understood as transform-origin|

```js
const { transformModel } = lf.graphModel;
transformModel.zoom(true)
```

## translate(x, y)

Move the canvas

|Name|Type|Default|Description|
|-|-|-|-|
|x|number|-|x-axis translation distance|
|y|number|-|y-axis translation distance|

```js
const { transformModel } = lf.graphModel;
transformModel.translate(100, 100);
```


## focusOn(targetX, targetY, width, height)

Move the target to the center of the canvas

|Name|Type|Default|Description|
|-|-|-|-|
|targetX|number|-|Current x coordinate of the target|
|targetY|number|-|Current y coordinate of the target|
|width|number|-|Canvas width|
|height|number|-|Canvas height|

```js
const { transformModel, width, height } = lf.graphModel;
transformModel.focusOn(100, 100, width, height);
```

## setZoomMiniSize(size)

Set the minimum value for scaling

|Name|Type|Default|Description|
|-|-|-|-|
|size|number|-|Reduction multiple, between 0-1|

```js
const { transformModel } = lf.graphModel;
transformModel.setZoomMiniSize(0.1);
```

## setZoomMaxSize(size)

Set the maximum value for scaling

|Name|Type|Default|Description|
|-|-|-|-|
|size|number|-|Magnification, greater than 1|

```js
const { transformModel } = lf.graphModel;
transformModel.setZoomMaxSize(10);
```
## HtmlPointToCanvasPoint

`Method`

Converts points on the toolOverlay layer to points on the canvasOverlay layer based on scaling.

Parameters

| Name | Type | Required | Default | Description |
| :- | :- | :- | :- | :- |
| point | PointTuple | true | - | coordinate |

Return value

PointTuple

```js
const { transformModel } = lf.graphModel;
const point = transformModel.HtmlPointToCanvasPoint([100, 100]);
// If the canvas x-axis is panned by +100, then the returned value is [0, 100]
```

## CanvasPointToHtmlPoint

`Method`

Converts points on the canvasOverlay layer to points on the toolOverlay layer based on scaling.

Parameters

| Name | Type | Required | Default | Description |
| :- | :- | :- | :- | :- |
| point | PointTuple | true | - | coordinate |

Return value

PointTuple

```js
const { transformModel } = lf.graphModel;
const point = transformModel.CanvasPointToHtmlPoint([100, 100]);
// If the canvas x-axis is panned by +100, then the returned value is [200, 100]
```