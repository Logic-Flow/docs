# 值选择器的定义

## 1.可选项选择

```js
value = {
  type: 'option',
  value: '男',
  dataType: 'string',
}
```


## 2.手动输入

```js
value = {
  type: 'input',
  value: '您好啊',
  dataType: 'string',
}
```


## 3.页面组件的值

```js
value = {
  type: 'component',
  componentId: '111', // 页面组件Id' 
  field: 'id', // 如果组件的值是对象，则可以通过field获取对象的属性
  prop: 'name', // 预留: model.getProps('name') 拿属性, 现在是value，可以直接调用model的getValue方法
}
```

## 4. 获取数据源的值

```js
value = {
  type: 'dataSource',
  nodeId: 'b5i92n8ilkg0000', // 流程图上配置的数据节点的id
  apiId: 1, // 对应的数据源请求的id
  field: 'data.list', // 去拿该数据源返回值的哪个字段
}
```

## 5. 页面组件的属性值

```js
value = {
  type: 'componentProp',
  componentId: '111', // 页面组件Id' 
  field: 'id', // 如果组件的属性值是对象，则可以通过field获取对象的字段
  prop: 'name', // 属性值，调用model的getProps('name')获取属性值
}
```

## 6. 路由参数属性值
```js
value = {
  type: 'urlParam',
  value: '您好啊',
  dataType: 'string',
}
```

## 7. 宿主系统参数属性值
```js
value = {
  type: 'initParam',
  value: '您好啊',
  dataType: 'string',
}
```
