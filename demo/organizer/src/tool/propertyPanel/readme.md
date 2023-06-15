# 属性面板的定义

## 数据请求属性
**schema**
```js
  ds: {
    id: 571,
    key: "test",
    name: "test",
    queryParams: [ //query请求参数
      {
        key: 'page', // 参数名
        paramType: 'int', // 参数要求的数据类型
        value: { // 返回的是一个值收集器的内容
          type: 'componentProp',
          componentId: '111', // 页面组件Id' 
          field: 'id', // 如果组件的属性值是对象，则可以通过field获取对象的字段
          prop: 'name', // 属性值，调用model的getProps('name')获取属性值
          dataType: 'string', // 该值的数据类型，由物料定义的该propType
        }
      }
    ],
    bodyParams: [ //body请求参数
      {
        key: 'page', // 参数名
        paramType: 'int', // 参数要求的数据类型
        value: { // 返回的是一个值收集器的内容
          type: 'componentProp',
          componentId: '111', // 页面组件Id' 
          field: 'id', // 如果组件的属性值是对象，则可以通过field获取对象的字段
          prop: 'name', // 属性值，调用model的getProps('name')获取属性值
          dataType: '', // 该值的数据类型，由物料定义的该propType
        }
      }
    ],
    headerParams: []
  }
```
## 页面跳转属性-todo
**schema**
```js
  pageJump: {
    
  }
```

## 事件属性
**schema**
```js
  event: {
    key: "click",    // 该事件的key值
    keyDefine: "点击" // 该事件的描述
  }
```

## 行为属性
**schema**
```js
  reactions: [ // 行为列表
    {
      key: "condition", // 该行为对应的prop key
      keyDefine: "是否展示", // 该行为的prop描述
      keyType: "boolean", // 该行为的prop数据类型
      value: { // 该行为的prop需要设置的值，为一个值收集器返回的值（定义见valueCollector readme）
        dataType: "boolean"
        type: "option"
        value: true
        valueDesc: "显示"
      },
      valueDefine: "" // 值的描述
    }
  ]
```

## 条件属性
**schema**
```js
condition: {
  conditions: [ // 条件规则列表
    {
      operator: '==', // 比较运算符
      key: { //  比较运算符前的值，为一个值收集器返回的值（定义见valueCollector readme）
        type: 'component',
        componentId: '111', // 页面组件Id' 
        dataType: "string",
        valueDesc: '输入框的值'
      },
      value: { // 比较运算符后判断的的值，为一个值收集器返回的值（定义见valueCollector readme）
        dataType: "boolean",
        type: "option",
        value: true,
        valueDesc: "显示",
      },
    },
    {
      operator: '==', // 比较运算符
      key: {
        type: 'componentProp',
        componentId: '111', // 页面组件Id' 
        field: 'id', // 如果组件的属性值是对象，则可以通过field获取对象的字段
        prop: 'name', // 属性值，调用model的getProps('name')获取属性值
        valueDesc: '表格选中行的id'
      },
      value: { 
        dataType: "boolean",
        type: "option",
        value: true,
        valueDesc: "显示",
      },
    },
    {
      operator: '==', // 比较运算符
      key: {
        type: 'dataSource',
        nodeId: 'b5i92n8ilkg0000', // 流程图上配置的数据节点的id
        apiId: 1, // 对应的数据源请求的id
        field: 'data.list', // 去拿该数据源返回值的哪个字段
      },
      value: { 
        dataType: "boolean",
        type: "option",
        value: true,
        valueDesc: "显示",
      },
    }
  ],
  combineRule: 'C1&&(C2||C3)'  // 几个条件之间的逻辑运算关系
}
```