# editConfigModel

editConfigModel是控制页面编辑状态。详细用法见[设置图编辑方式](zh/guide/basic/silent-mode)


## 属性说明

| 属性名                  | 类型    | 默认值 | 说明                                                                   |
| ----------------------- | ------- | ------ | ---------------------------------------------------------------------- |
| isSilentMode           | boolean | false  | 是否为静默模式                                                           |
| stopZoomGraph           | boolean | false  | 禁止缩放画布                                                           |
| stopScrollGraph         | boolean | false  | 禁止鼠标滚动移动画布                                                   |
| stopMoveGraph           | boolean | false  | 禁止拖动画布                                                           |
| adjustEdge              | boolean | true   | 允许调整边                                                           |
| adjustEdgeMiddle        | boolean | false  | 只对折线生效，只允许调整边的中间线段，不允许调整与起点终点相连的线段 |
| adjustEdgeStartAndEnd   | boolean | false  | 允许调整边起点/终点                                                  |
| adjustNodePosition      | boolean | true   | 允许拖动节点                                                           |
| hideAnchors             | boolean | false  | 隐藏节点所有锚点                                                       |
| hoverOutline            | boolean | true  | 显示节点悬浮时的外框                                                       |
| nodeTextEdit            | boolean | true   | 允许节点文本可以编辑                                                   |
| edgeTextEdit            | boolean | true   | 允许边文本可以编辑                                                   |
| nodeTextDraggable       | boolean | false  | 允许节点文本可以拖拽                                                   |
| edgeTextDraggable       | boolean | false  | 允许边文本可以拖拽                                                   |
| metaKeyMultipleSelected | boolean | false  | 允许按照 meta 键多选元素                                               |
| autoExpand              | boolean | true  | 节点/边超出画布后自动扩展画布                                               |


## updateEditConfig

`方法`

修改流程表编辑状态

入参:
|名称|类型|默认值|说明|
|-|-|-|-|
|config|object|无| 页面编辑状态配置 |

```ts
const { editConfigModel } = lf.graphModel;
editConfigModel.updateEditConfig({
  stopZoomGraph: true,
});
```

## getConfig

`方法`

获得当前页面编辑状态

```ts
const { editConfigModel } = lf.graphModel;
editConfigModel.getConfig();
```
