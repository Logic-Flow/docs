# LogicFlow

## 文档开发
在`docs`目录下添加新的文档

## 示例开发
在`examples`目录下的`examples`中开发示例
**初次启动项目请执行`yarn dev:screenshot`以启动项目并生成项目必要的截图**
1. 创建示例的集合目录，如场景案例（如果想要创建的集合已存在则跳过此步）
2. 创建具体的例子集目录，如业务场景、常有功能，并在该目录下修改或创建config.json，如
```json
{
  "name": "例子集-1-1",
  "key": "example-set-1-1",
  "examples": [
    {
      "name": "自定义带有图标的节点-1-1",
      "key": "custom-node-1-1"
    },
    {
      "name": "使用vue自定义html节点-1-1",
      "key": "vue-1-1"
    },
    {
      "name": "html卡片-1-1",
      "key": "html-card-1-1"
    }
  ]
}
```
3. 开发完示例之后，再次执行`yarn dev:screenshot`生成新的截图

**开发完成后在项目根目录下执行`sh deploy.sh`以部署项目到github pages**
