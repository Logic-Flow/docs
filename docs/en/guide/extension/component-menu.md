# Menu

> Menu refers to the right-click menu

## Getting started

Importing components to enabling the default menu.

```ts
import LogicFlow from "@logicflow/core";
import { Menu } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";

LogicFlow.use(Menu);
```

The menus supported by the `Menu` component include right-click menus for nodes, edges, and graphs. By default, `Menu` has the following functions built into each menu:

- nodeMenu： Delete, copy, and edit text
- edgeMenu：Delete and edit text
- graphMenu：none

## Configuration items of the menu

Each function in the menu can be represented by a single configuration. The specific fields are as follows:

| Fields    | Type     | function                                    | Required | Description                                                                                                                                                                                                                                          |
| :-------- | :------- | :------------------------------------------ | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| text      | string   | menu text                                   |          | text for menu items                                                                                                                                                                                                                                  |
| className | string   | class name                                  |          | The default class is lf-menu-item. Setting this field will add a new className to the default class.                                                                                                                                                 |
| icon      | boolean  | Whether to create the span tag for the icon |          | If the simple text is not enough to represent the menu, you can set icon to true, and then the corresponding menu item will add the span with class lf-menu-icon. you can enrich the content of the menu by setting the background for lf-menu-icon. |
| callback  | Function | Callback functions executed after a click   | ✅       | In the three menu callbacks, node data/edge data/event information can be obtained respectively.                                                                                                                                                     |

The delete function of the node right-click menu, example is:

```ts
{
  text: 'Delete',
  callback(node) {
    // node is the data of the node
    lf.deleteNode(node.id);
  },
},
```

## Adding menu options

The `lf.extension.menu.addMenuConfig` method allows you to append new options to the original menu.

```ts
import LogicFlow from "@logicflow/core";
import { Menu } from "@logicflow/extension";

// Instantiating LogicFlow
const lf = new LogicFlow({
  container: document.getElementById("app"),
  // register component
  plugins: [Menu],
});
// Append new options to the menu (must be set before lf.render())
lf.extension.menu.addMenuConfig({
  nodeMenu: [
    {
      text: "Share",
      callback() {
        alert("Share successfully!");
      },
    },
    {
      text: "Properties",
      callback(node: any) {
        alert(`
          Node id：${node.id}
          Node type：${node.type}
          Node coordinates：(x: ${node.x}, y: ${node.y})`);
      },
    },
  ],
  edgeMenu: [
    {
      text: "Properties",
      callback(edge: any) {
        alert(`
          Edge id：${edge.id}
          Edge type：${edge.type}
          Edge coordinates：(x: ${edge.x}, y: ${edge.y})
          Source node id：${edge.sourceNodeId}
          Target node id：${edge.targetNodeId}`);
      },
    },
  ],
  graphMenu: [
    {
      text: "Share",
      callback() {
        alert("Share successfully!");
      },
    },
  ],
});
lf.render();
```

## Customized Menu

If there are unwanted options in the default menu, you can reset the menu by `lf.setMenuConfig` and replace it with a custom menu.

```ts
lf.extension.menu.setMenuConfig({
  nodeMenu: [
    {
      text: "Delete",
      callback(node) {
        lf.deleteNode(node.id);
      },
    },
  ], // Override the default node right-click menu
  edgeMenu: false, // Remove the default edge right click menu
  graphMenu: [], // Override the default graph right-click menu, same effect as false
});
```

## Configure the menu for the specified type of element

Use `lf.setMenuByType` to define a menu for a specific type of node or edge.

```ts
lf.extension.menu.setMenuByType({
  type: "bpmn:startEvent",
  menu: [
    {
      text: "Share111",
      callback() {
        console.log("Share successfully222!");
      },
    },
  ],
});
```

## Set the menu for the selection component

After using the selection plug-in, the selection component will also have a menu. You can hide the menu by setting the menu item to empty.

```ts
lf.extension.menu.setMenuByType({
  type: "lf:defaultSelectionMenu",
  menu: [],
});
```

## Set the menu for a specific business state

In addition to setting menus for certain types of elements, you can also set menus for nodes in different business states.

- You can set a custom menu for a node by setting its menu property.
- Since the custom model may not be able to get the lf instance directly, you can get the graphModel through `this.graphModel`. The graphModel is described in [API/graphModel](http://logic-flow.org/api/graphModelApi.html)。
- If you want to perform business processing after clicking the menu, you can send a custom event through the `eventCenter` of `graphModel`, and then listen to this event on the `lf` instance yourself.
- Priority: Set the menu for a specific business state > Set the menu for the specified type of element > General menu configuration > Default menu.

```ts
// customNode.ts
import { RectNode, RectNodeModel } from "@logicflow/core";

class CustomeModel extends RectNodeModel {
  setAttributes() {
    this.stroke = "#1E90FF";
    this.fill = "#F0F8FF";
    this.radius = 10;
    const {
      properties: { isDisabledNode },
    } = this;
    if (!isDisabledNode) {
      // Set menus individually for non-disabled elements.
      this.menu = [
        {
          className: "lf-menu-delete",
          icon: true,
          callback: (node) => {
            this.graphModel.deleteNode(node.id);
            this.graphModel.eventCenter.emit("custom:event", node);
          },
        },
        {
          text: "edit",
          className: "lf-menu-item",
          callback: (node) => {
            this.graphModel.setElementStateById(node.id, 2);
          },
        },
        {
          text: "copy",
          className: "lf-menu-item",
          callback: (node) => {
            this.graphModel.cloneNode(node.id);
          },
        },
      ];
    }
  }
}
// index.js
import { RectNode, CustomeModel } from "./custom.ts";

lf.register({
  type: "custome_node",
  view: RectNode,
  model: CustomeModel,
});

lf.on("custom:event", (r) => {
  console.log(r);
});
```

- Set custom menus for edges

```ts
// custom.ts
import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";
class CustomModel extends PolylineEdgeModel {
  setAttributes() {
    // Right click menu
    this.menu = [
      {
        className: "lf-menu-delete",
        icon: true,
        callback(edge) {
          const comfirm = window.confirm("Sure to delete?");
          comfirm && this.graphModel.deleteEdgeById(edge.id);
        },
      },
    ];
  }
}
// index.ts
lf.register({
  type: "custome_edge",
  view: PolylineEdge,
  model: CustomeModel,
});
//  Set the default type of the edge to custome_edge
lf.setDefaultEdgeType("custome_edge");
```

```css
// Set css
.lf-menu-delete .lf-menu-item-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url("./delete.png") no-repeat;
  background-size: 20px;
}
```

### menu style

Overwrite the original style according to the class in the menu structure, and set the style in line with the host style.

- Menu：lf-menu
- Menu items：lf-menu-item、User-defined className
- Menu Items - text：lf-menu-item-text
- Menu Items - icon：lf-menu-item-icon, The icon configuration needs to be set to true.

By setting these classes, you can override the default style and then achieve effects such as beautifying font colors and setting menu item icons.

Note that the menu configuration described above must be called before `lf.render()`.

### Example

<a href="https://codesandbox.io/embed/dazzling-hypatia-en8s9?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>
