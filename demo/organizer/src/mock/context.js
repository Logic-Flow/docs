const activeNode =  {
  id: 'widget1',
  componentName: 'Radio',
  title: '单选框',
  props: [
    {
      name: 'condition',
      propType: 'string',
      description: '显示隐藏',
      optionValue: [
        {
          value: true,
          description: '显示'
        },
        {
          value: false,
          description: '隐藏'
        }
      ]
    },
    {
      name: 'value',
      propType: 'string',
      description: '值',
      value: '1',
      optionValue: [
        {
          value: '1',
          description: '运动'
        },
        {
          value: '2',
          description: '音乐'
        }
      ]
    },
    {
      name: 'title',
      description: '标题',
      value: '选择爱好'
    }
  ],
  events: [
    {
      name: 'onChange',
      propType: 'func',
      description: '值改变时',
    },
  ],
  getLogic() {
    return {
      props: this.props,
      events: this.events
    }
  },
  getValue() {
    return 1
  }
}

export default {
  dataSource: [],
  eventCenter: {
    on() {}
  },
  pageModel: {
    activeNode: activeNode,
    draggingNode: null,
    nodeList: [
      activeNode,
      {
        id: 'widget2',
        componentName: 'select',
        title: '下拉框',
        props: [
          {
            name: 'value',
            description: '值',
            optionValue: [
              {
                value: '1',
                description: '古典'
              },
              {
                value: '2',
                description: '流行'
              },
              {
                value: '3',
                description: '摇滚'
              }
            ]
          },
          {
            name: 'title',
            description: '标题',
            value: '选择音乐'
          }
        ],
        events: [
          {
            name: 'onChange',
            propType: 'func',
            description: '值改变时',
          },
        ],
        getLogic() {
          return {
            props: this.props,
            events: this.events
          }
        },
        getValue() {
          return '1'
        }
      },
      {
        id: 'widget3',
        componentName: 'select',
        title: '输入框',
        props: [
          {
            name: 'value',
            value: '北京',
            description: '值'
          },
          {
            name: 'title',
            description: '标题',
            value: '运动'
          },
          {
            name: 'placeholder',
            description: '提示语',
            value: '请输入你的爱好'
          }
        ],
        events: [
          {
            name: 'onChange',
            propType: 'func',
            description: '值改变时',
          },
        ],
        getLogic() {
          return {
            props: this.props,
            events: this.events
          }
        },
        getValue() {
          return '北京'
        }
      }
    ]
  },
}