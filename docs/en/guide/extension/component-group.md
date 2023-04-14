# Group

LogicFlow supports grouping. Grouping is a custom node built into LogicFlow, so developers can refer to custom nodes for further customization based on grouping.

## Default group

```js
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import { Group } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";

const lf = new LogicFlow({
  // ...
  plugins: [Group],
});
lf.render({
  nodes: [
    {
      type: "group",
      x: 300,
      y: 300,
    },
  ],
});
```

## Data format of group

`group` is a special kind of node for LogicFlow, so its data format is still basically the same as that of a node. However, the `group` node has an additional `children` attribute to store its child node Id.

```js
lf.render({
  nodes: [
    {
      type: "group",
      x: 400,
      y: 400,
      children: ["rect_2"],
    },
    {
      id: "rect_2",
      type: "circle",
      x: 400,
      y: 400,
    },
  ],
});
```

## custom grouping

In practice, we recommend that, as with custom nodes, developers customize the grouping based on their own business and then give the grouping a name that matches their business. For example, for a subgroup in bpmn, name it `subProcess` and then customize the style of the group node.

```js
import { GroupNode } from "@logicflow/extension";

class MyGroup extends GroupNode.view {}
class MyGroupModel extends GroupNode.model {
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = "#AEAFAE";
    style.strokeDasharray = "3 3";
    style.strokeWidth = 1;
    return style;
  }
}

lf.register({
  type: "my-group",
  model: MyGroupModel,
  view: MyGroup,
});
```

## properties and methods of groupModel

In addition to the attributes of the node itself, the grouping node also has some special attributes belonging to the grouping. We can control these attributes to achieve various effects of grouping when customizing. See [nodeModel](en/api/nodeModelApi) for the properties and methods of the node itself.

### Status Properties

| Name         | Type    | Description                                                                                 |
| :----------- | :------ | :------------------------------------------------------------------------------------------ |
| isRestrict   | boolean | Whether to restrict the group's children from being dragged out of the group, default false |
| resizable    | boolean | Whether the group supports manual resizing, default false                                   |
| foldable     | boolean | Whether or not to show the expand-collapse button for the group, default false              |
| width        | number  | Grouping width                                                                              |
| height       | number  | Grouping height                                                                             |
| foldedWidth  | number  | Width after folding grouping                                                                |
| foldedHeight | number  | Height after folding grouping                                                               |
| isFolded     | boolean | Read-only, indicating whether the group is collapsed                                        |
| isGroup      | boolean | Read-only, always true, used to identify `model` as `group`                                 |

The attributes of group are set in the same way as nodes, either in the `initNodeData` or `setAttributes` methods of `groupModel`.

```js
class MyGroupModel extends GroupNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.isRestrict = true;
    this.resizable = true;
    this.foldable = true;
    this.width = 500;
    this.height = 300;
    this.foldedWidth = 50;
    this.foldedHeight = 50;
  }
}
```

### addChild

Set a node as a child of a grouping. Note that this method only adds relationships and does not automatically move the node into the group.

```js
const groupModel = lf.getNodeModelById("group_id");
const node = lf.addNode({
  type: "rect",
  x: groupModel.x,
  y: groupModel.y,
});
groupModel.addChild(node.id);
```

### removeChild

Remove a child node from the group.

```js
const groupModel = lf.getNodeModelById("group_id");
groupModel.removeChild("node_id_1");
```

### foldGroup

Collapse the group. The parameter is `true` means to collapse the group, false means to expand the group.

```js
const groupModel = lf.getNodeModelById("group_id");
groupModel.foldGroup(true);
```

### isAllowAppendIn(nodeData)

Checks if incoming nodes are allowed to be added to this grouping, by default all nodes are allowed.

```js
class MyGroupModel extends GroupNode.model {
  isAllowAppendIn(nodeData) {
    // Set to allow only custom-rect nodes to be added to this group
    return nodeData.type === "custom-rect";
  }
}
```

!> **Tip** In case a node is not allowed to be added to a group, the node is still displayed where the user put it and the node is not part of the group. If you want the added node to be deleted, you can listen to the `group:not-allowed` event and then delete the node manually.

### getAddableOutlineStyle

Set the style of the group's highlighting effect when dragging nodes onto the group.

```js
class MyGroupModel extends GroupNode.model {
  getAddableOutlineStyle() {
    const style = super.getAddableOutlineStyle();
    style.stroke = "#AEAFAE";
    style.strokeDasharray = "3 3";
    return style;
  }
}
```

?> **How to prevent nodes from connecting to groups?** grouping is a special kind of node, so it is still possible to disallow direct connection between nodes and groupings by [customizing the connection rule](http://logic-flow.org/guide/basic/node.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BF%9E%E6%8E%A5%E8%A7%84%E5%88%99%E6%A0%A1%E9%AA%8C). However, please do not set the number of anchor points of the group to 0, because when the group is collapsed, the relationship between the internal nodes of the group and the external nodes will be indicated by the anchor points of the group being connected to the external nodes.

## Example

<a href="https://codesandbox.io/embed/bold-moore-vgvpf?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>

!> **About the swim lanes** The grouping feature is not a swim lane, the swim lane needs to be implemented by the developers themselves on the basis of grouping. The full functionality of Bpmn provided by LogicFlow will support BPMN swimlanes later. We also welcome those who have implemented it themselves to give us PR.
