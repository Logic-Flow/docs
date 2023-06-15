# 节点的定义

## 事件节点

事件节点是指引起流程执行的节点，目前限制要放在流程中作为路径的起始节点。

**schema**

```js
const eventNode = {
  id: '',
  type: 'EventNode',
  x: 100,
  y: 100,
  properties: {
    componentId: 'Button_tk2sa3', // 事件节点对应的物料组件Id
    componentName: 'Button', // 事件节点对应的物料组件名称
    name: '按钮点击',
    event: 'click', // 物料触发的事件、目前一个事件节点只允许绑定一个事件
  }
}
```

## 反应节点

反应节点是指在流程执行过程中，表示对物料组件需要做出指定反应的节点。目前组件的反应是通过控制修改组件的属性来实现的。

**schema**

```js
const reactionNode = {
  id: '',
  type: 'ReactionNode',
  x: 100,
  y: 100,
  properties: {
    componentId: 'Input_tk2sa3', // 事件节点对应的物料组件Id
    componentName: 'Input', // 反应节点对应的物料组件名称
    name: '修改用户名',
    reactions: [ // 组件反应列表，每一项表示一个属性的变化
      {
        key: 'value', // 需要修改组件的属性key
        keyDefine: '值',
        keyType: 'string',
        value: { // 设置属性的具体值，详细请查看后面的value类型
          type: 'option',
          value: '男',
          dataType: 'string',
        }
      }
    ]
  }
}
```

## 通用节点

通用节点包括数据请求节点、页面跳转节点以及数据转换节点。

**schema**

```js
const commonNode = {
  id: '',
  type: "CommonNode",
  x: 100,
  y: 100,
  properties: {
    type: 'dataSource', // or pageJump
    name: '获取用户列表',
    ds: {}, // 数据源详细内容
    pj: {}, // 页面跳转详细内容
  }
}
```

## 连线

连线表示着流程从一个节点执行到另一个节点的路径。同时连线上可以存在条件，条件表示只有满足条件后才允许执行到下一个节点。

**schema**

```js
const edgeData = {
  id: '',
  type: 'logicPolyline',
  properties: {
    conditions: [
      // {
      //   expression: '==',
      //   key: '',
      //   val: {
      //     type: 'option',
      //     value: '',
      //   },
      //   types: VALUE_TYPES,
      //   type: 'value',
      //   valueOptions: []
      // }
    ]
  }
}
```


## value类型

**1.可选项选择**

```js
value = {
  type: 'option',
  dataType: 'string',
  value: '男',
  valueDesc: '隐藏',
}
```


**2.手动输入**

```js
value = {
  type: 'input',
  value: '您好啊',
  dataType: 'string',
}
```


**3.页面组件的值**

```js
value = {
  type: 'component',
  componentId: '111', // 页面组件Id' 
  componentName: '输入框',
  field: 'id', // 如果组件的值是对象，则可以通过field获取对象的属性
  prop: 'name', // 预留: model.getProps('name') 拿属性, 现在是value，可以直接调用model的getValue方法
}
```

**4. 获取数据源的值**

```js
value = {
  type: 'dataSource',
  nodeId: 'b5i92n8ilkg0000', // 流程图上配置的数据节点的id
  apiId: 1, // 对应的数据源请求的id
  field: 'data.list', // 去拿该数据源返回值的哪个字段
}
```

**5. 页面组件的属性值**

```js
value = {
  type: 'componentProp',
  componentId: '111', // 页面组件Id' 
  field: 'id', // 如果组件的属性值是对象，则可以通过field获取对象的字段
  prop: 'name', // 属性值，调用model的getProps('name')获取属性值
}
```


