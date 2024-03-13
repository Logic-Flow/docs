# nodeModel

All nodes in LogicFlow will have a nodeModel corresponding to them. Due to the mechanism of data driven view, all operations on nodes are in fact operations on models. In most cases, we do not recommend assigning values to nodeModel properties directly, but rather calling the methods provided on model or [graphModel](en/api/graphModelApi).

?> **Note** In cases where you are not familiar with LogicFlow's internal source code, assigning values to the model's properties can cause a lot of unintended problems. For example, in the model `x`,`y` indicates the position of the node, if the node is moved by directly modifying `x`,`y`, it will appear that the node is moved, but the text and edges on the node are not moved. So the best way to move a node is to call the `moveNode` method on `graphModel`.

There are many node properties on nodeModel, which are categorized due to their different uses.

## DataAttributes

The data attribute of the node is the LogicFlow graph data, which is the data used to identify the node. Only the data attributes of the nodes are generally saved when the flowchart is saved.

| Name       | Type       | Required| Description               |
| :--------- | :--------- | :------- | :----------------- |
| id         | String     | ✅       | Node id            |
| type       | String     | ✅       | Node type          |
| x          | number     | ✅       | The x-axis coordinates of the node center  |
| y          | number     | ✅       | The y-axis coordinates of the node center  |
| text       | TextObject |          | Node text          |
| properties | Object     |          | Business customization properties for nodes |

**TextObject**

| Name      | Type    | Required | Description                                             |
| :-------- | :------ | :------- | :----------------------------------------------- |
| value     | String  |          | Node text                                         |
| x         | number  | ✅       | The x-axis coordinates of the node center                              |
| y         | number  | ✅       | The y-axis coordinates of the node center                                |
| draggable | boolean | ✅       | Whether the text is allowed to be dragged to adjust the position, this property will not be saved when saving |
| editable  | boolean | ✅       | Whether the text is allowed to be edited by double-clicking, this property will not be saved when saving    |

## StatusAttributes

Status attributes are generally used when customizing nodes for more fine-grained style display.

| Name         | Type    | Required | Description                  |
| :----------- | :------ | :------- | :-------------------- |
| isSelected   | boolean | ✅       | Whether the node is selected or not        |
| isHovered    | boolean | ✅       | Whether the node is in the hover state |
| isHitable    | boolean | ✅       | Whether the node is clickable        |
| draggable    | boolean | ✅       | Whether the node is draggable        |
| isShowAnchor | boolean | ✅       | Whether to show anchor points          |
| visible      | boolean | ✅       | Show or not, added in `1.1.0` |

## Shape attributes :id=ShapeAttributes

The shape attributes of LogicFlow mainly controls the main appearance of the base node. Shape attributes can be set by `setAttributes` or `initNodeData`. See [Custom node shape properties](en/guide/basic/node#custom-shape-properties) for details on how to set them.

| Name   | Type              | Required | Description                                                                       |
| :----- | :---------------- | :------- | :------------------------------------------------------------------------- |
| width  | number            | ✅       | Width of nodes                                                                 |
| height | number            | ✅       | Height of nodes                                                                 |
| radius | number            |          | Special attributes of rectangular nodes, rounded corners of nodes                                                   |
| r      | number            |          | Special attributes of circle nodes，the radius of the circle。For circular nodes, the height and width of the node are automatically calculated based on the radius |
| rx     | number            |          | Special attributes of ellipse nodes and diamond nodes，Radius of horizontal rounded corners. The width of the node is automatically calculated based on the radius     |
| ry     | number            |          | Special attributes of ellipse nodes and diamond nodes，Radius of vertical rounded corners. The width of the node is automatically calculated based on the radius     |
| points | [number,number][] |          | Special attributes of polygon nodes，the vertices of a polygon. The width and height of the nodes are automatically calculated based on the vertices           |

## Other attributes

LogicFlow also maintains some properties on `model` that developers can use to get some information. For example, you can get `graphModel`, the base `model` type of the node, etc.

| Name        | Type    | Required | Description                                                                                                                                                                       |
| :---------- | :------ | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| graphModel  | object  | ✅       | The model corresponding to the entire canvas. For details, see [graphModelApi](en/api/graphModelApi#width)                                                                                                                                                     |
| zIndex      | number  | ✅       | The height of the node on the z-axis. When elements overlap, the higher zIndex is on top, default is 1                                                                                                                                                     |
| state       | number  | ✅       | Element state. Different states correspond to the display effect of the element. DEFAULT = 1 means the default display effect; TEXT_EDIT = 2 means the element is being edited; ALLOW_CONNECT = 4, means the element is allowed to be the target node of the current edge; NOT_ALLOW_CONNECT = 5 means the element is not allowed to be the target node of the current edge |
| BaseType    | string  | ✅       | The base type of the current model, which is fixed to `node` for nodes. It is mainly used to identify whether this `model` is a node or an edge when nodes and edges are mixed.                                                                                                 |
| modelType   | string  | ✅       | The type of the current model, the values are `node`, `rect-node`, `circle-node`, `polygon-node`, `ellipse-node`, `diamond-node`, `html-node`, `text-node`.                                                                             |
| moveRules   | array   |          | Verification rules before the node is moved                                                                                                                                                                                      |
| sourceRules | array   |          | Verification rules when nodes connect to other nodes                                                                                                                                                                                   |
| targetRules | array   |          | Verification rules when a node is connected by other nodes                                                                                                                                                                                 |
| autoToFront | boolean | ✅       | Control whether the node is automatically topped when it is selected, the default is true.                                                                                                                                                                       |
| incoming    | object  | ✅       | All edges and nodes connected to the current node, `v1.1.4`                                                                                                                                                                           |
| outgoing    | object  | ✅       | All edges and nodes leaving the current node, `v1.1.4`                                                                                                                                                                           |
| virtual     | boolean | -        | Whether it is a virtual node, the default is false. Export data will not include this node when the value is true. `v1.1.24`                                                                                                                                     |

!> **What is the difference between modelType and type?** When customizing a node, `type` can be any value that the developer defines. But inside LogicFlow, when it comes to the computation of this node, we need to sense the specific shape of this node, which cannot be determined by `type`, but by `modelType`.

## Style attributes :id=StyleAttributes 

All nodes of LogicFlow are eventually rendered as SVG DOM. But except for the shape attributes, all other properties belonging to svg do not exist directly in `nodeModel`. When developers want to add more [svg attributes](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute) to the SVG DOM, they can do so by overriding the method on `nodeModel` that gets the node style attributes.

## getNodeStyle

Supports overriding this method to customize node style attributes. Default is [theme baseNode](en/api/themeApi#basenode)

```js
class UserTaskModel extends RectNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = "blue";
    style.strokeDasharray = "3 3";
    return style;
  }
}
```

## getTextStyle

Support overriding this method to customize node text style attributes, default is [theme nodeText](en/api/themeApi#nodetext)

```js
class UserTaskModel extends RectNodeModel {
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    return style;
  }
}
```

## getAnchorStyle

Support overriding this method to customize the node anchor style attribute, default is [theme anchor](en/api/themeApi#anchor)

```js
class UserTaskModel extends RectNodeModel {
  getAnchorStyle(anchorInfo) {
    const style = super.getAnchorStyle(anchorInfo);
    style.stroke = "rgb(24, 125, 255)";
    style.r = 3;
    style.hover.r = 8;
    style.hover.fill = "rgb(24, 125, 255)";
    style.hover.stroke = "rgb(24, 125, 255)";
    return style;
  }
}
```

## getAnchorLineStyle

Support overriding this method to customize the style attributes of the dashed line generated when the node anchor is dragged by the mouse, defaulting to [theme anchorline](en/api/themeApi#anchorline)

```js
class UserTaskModel extends RectNodeModel {
  getAnchorLineStyle(anchorInfo) {
    const style = super.getAnchorLineStyle();
    style.stroke = "rgb(24, 125, 255)";
    return style;
  }
}
```

## getOutlineStyle

Support overriding this method to customize the style attribute of the node outline box, default is [theme outline](en/api/themeApi#outline)

```js
class UserTaskModel extends RectNodeModel {
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = "red";
    style.hover.stroke = "red";
    return style;
  }
}
```

## initNodeData

Support overriding this method to initialize the node data and convert the incoming graph data to node attributes, so you need to call `super.initNodeData` to trigger the conversion method.

- The graph data can be processed before `super.initNodeData`.
- After `super.initNodeData`, you can modify the node properties.

```js
class UserTaskModel extends RectResize.model {
  initNodeData(data) {
    // You can force the node text position to be uncentered and below the node before super.initNodeData
    if (!data.text || typeof data.text === "string") {
      data.text = {
        value: data.text || "",
        x: data.x,
        y: data.y + 40,
      };
    }
    super.initNodeData(data);
    this.width = 100;
    this.height = 80;
  }
}
```

!> **Tip** Both initNodeData and setAttributes can assign values to the attributes of a nodeModel, but the difference between the two is that:

- `initNodeData` is called only when the node is initialized and is used to initialize the node's properties.
- `setAttributes` is not only called when the node is initialized, but also when properties change.

Take the above code as an example. As the node scales, it will update the width and height in properties, which will also trigger `setAttributes`. If the width and height of the node are defined in `setAttributes`, the node will not be scaled.

## setAttributes

Set the shape properties of the model, which will be triggered every time the properties change.

```js
class UserTaskModel extends RectNodeModel {
  setAttributes() {
    const size = this.properties.scale || 1;
    this.width = 100 * size;
    this.height = 80 * size;
  }
}
```

## createId

It is supported to override this method to customize the generation rules of node id.

?> **Note** 1. Please ensure the uniqueness of the id returned by this method. 2. This method is synchronous, if you want to modify the node id asynchronously, please refer to [#272](https://github.com/didi/LogicFlow/issues/272)

```js
import { v4 as uuidv4 } from "uuid";

class UserTaskModel extends RectNodeModel {
  createId() {
    return uuidv4();
  }
}
```

## getData

Get the data returned when saved. LogicFlow has a fixed node data format. If you expect to add more data to the saved data, please add it to properties.

This method is not allowed to be overridden.

```js
const nodeModel = lf.getNodeModelById("node_1");
const nodeData = nodeModel.getData();
```

## getProperties

Get the properties of a node.

This method is not allowed to be overridden.

```js
const nodeModel = lf.getNodeModelById("node_1");
const properties = nodeModel.getProperties();
```

## getDefaultAnchor

Reset the default anchor point. You can add custom attributes such as id to the anchor point for validation of the anchor point.

```ts
class cNode extend RectNodeModel {
  // Define nodes with only two anchor points, left and right. The anchor point position is calculated by the center point and width.
  getDefaultAnchor() {
    const { width, height, x, y, id } = this;
    return [
      {
        x: x - width / 2,
        y,
        name: 'left',
        id: `${id}_0`
      },
      {
        x: x + width / 2,
        y,
        name: 'right',
        id: `${id}_1`,
        edgeAddable: false
      },
    ]
  }
}
```

Anchor Attributes

| Name       | Type    | Required | Description                                    |
| :---------- | :------ | :------- | :-------------------------------------- |
| x           | number  | ✅       | The x-coordinate of the anchor point                             |
| y           | number  | ✅       | The y-coordinate of the anchor point                             |
| id          | string  | ✅       | Anchor id                                 |
| edgeAddable | boolean | ✅       | Whether to allow manual creation of edges based on this anchor point, default is true |

## getConnectedSourceRules

Get the rule when the current node is the starting node of an edge.

Overriding this method is supported. When overriding, additional rules can be added. If any of the rules are not satisfied in all the rules, the connection is prohibited.

```ts
class EndNodeModel extends CircleNodeModel {
  getConnectedSourceRules(): ConnectRule[] {
    const rules = super.getConnectedSourceRules();
    const geteWayOnlyAsTarget = {
      message: "End nodes can only be connected in, not out!",
      validate: (
        source: BaseNodeModel,
        target: BaseNodeModel,
        sourceAnchor,
        targetAnchor
      ) => {
        let isValid = true;
        if (source) {
          isValid = false;
        }
        return isValid;
      },
    };
    rules.push(geteWayOnlyAsTarget);
    return rules;
  }
}
```

## getConnectedTargetRules

Get the rule when the current node is the target node of an edge.

Overriding this method is supported. When overriding, additional rules can be added. If any of the rules are not satisfied in all the rules, the connection is prohibited.

```js
class StartEventModel extends CircleNodeModel {
  getConnectedTargetRules() {
    const rules = super.getConnectedTargetRules();
    const notAsTarget = {
      message: "The start node cannot be the end of an edge",
      validate: () => false,
    };
    rules.push(notAsTarget);
    return rules;
  }
}
```

## updateText

Modify the text content of a node

Parameters

| Name  | Type   | Required | Default | Description   |
| :---- | :----- | :--- | :----- | :----- |
| value | string | true | none     | Text value |

```js
const nodeModel = lf.getNodeModelById("node_1");
nodeModel.updateText("hello world");
```

## setZIndex

Set the zIndex of the node

```js
const nodeModel = lf.getNodeModelById("node_1");
nodeModel.setZIndex(999);
```

## setProperties

Set the properties of the node

```js
lf.on("node:click", ({ data }) => {
  lf.getNodeModelById(data.id).setProperties({
    disabled: !data.properties.disabled,
    scale: 2,
  });
});
```

## deleteProperty

Delete a property of a node

```js
lf.on("node:click", ({ data }) => {
  lf.getNodeModelById(data.id).deleteProperty("disabled");
  lf.getNodeModelById(data.id).deleteProperty("scale");
});
```
