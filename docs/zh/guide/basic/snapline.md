# 对齐线 Snapline

对齐线能够在节点移动过程中，将移动节点的位置与画布中其他节点位置进行对比，辅助位置调整。位置对比有如下两个方面。

- 节点中心位置
- 节点的边框

## 对齐线使用

普通编辑模式下，默认开启对齐线，也可通过配置进行关闭。  
在[静默模式](zh/guide/basic/silent-mode)下，无法移动节点，所以关闭了对齐线功能，无法通过配置开启。

```ts
// 关闭对齐线功能
const lf = new LogicFlow({
  snapline: false,
});
```

## 对齐线样式设置

对齐线的样式包括颜色和宽度，可以通过设置主题的方式进行修改。

```ts
// 默认配置
{
  stroke: '#1E90FF',
  strokeWidth: 1,
}
// 修改对齐线样式
lf.setTheme({
  snapline: {
    stroke: '#1E90FF', // 对齐线颜色
    strokeWidth: 1, // 对齐线宽度
  },
})
```

<example :height="400" ></example>

更多样式修改参见[主题](zh/guide/basic/theme)
