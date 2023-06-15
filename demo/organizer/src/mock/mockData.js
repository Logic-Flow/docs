export default {
  components: [
    {
      id: 'widget1',
      type: 'radio',
      desc: '单选框',
      props: [
        {
          key: 'condition',
          desc: '是否显示',
          optionValue: [
            {
              value: true,
              desc: '展示'
            },
            {
              value: false,
              desc: '隐藏'
            }
          ]
        },
        {
          key: 'value',
          desc: '值',
          value: '1',
          optionValue: [
            {
              value: '1',
              desc: '运动'
            },
            {
              value: '2',
              desc: '音乐'
            }
          ]
        },
        {
          key: 'title',
          desc: '标题',
          value: '选择爱好'
        }
      ]
    },
    {
      id: 'widget2',
      type: 'select',
      desc: '下拉框',
      props: [
        {
          key: 'value',
          desc: '值',
          optionValue: [
            {
              key: '1',
              desc: '古典'
            },
            {
              key: '2',
              desc: '流行'
            },
            {
              key: '3',
              desc: '摇滚'
            }
          ]
        },
        {
          key: 'title',
          desc: '标题',
          value: '选择音乐'
        }
      ]
    },
    {
      id: 'widget3',
      type: 'input',
      desc: '输入框',
      props: [
        {
          key: 'value',
          desc: '值'
        },
        {
          key: 'title',
          desc: '标题',
          value: '运动'
        },
        {
          key: 'placeholder',
          desc: '提示语',
          value: '请输入你的爱好'
        }
      ]
    }
  ]
}