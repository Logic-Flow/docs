export default {
  logicList: [
    {
      nodes: [
        {
          id: "init_1azos4vjtni8000",
          type: "event-node",
          x: 100,
          y: 80,
          properties: {
            componentId: "page_init",
            componentName: "pageInit",
            name: "页面初始化",
          },
        },
        {
          id: "logic_98ujn64fwy00000",
          type: "common-node",
          x: 260,
          y: 80,
          properties: {
            type: "dataSource",
            name: "请求数据",
            componentName: "dataSource",
          },
        },
        {
          id: "logic_d5nttghd60o0000",
          type: "common-node",
          x: 420,
          y: 80,
          properties: {
            type: "pageJump",
            name: "页面跳转",
            componentName: "pageJump",
          },
        },
        {
          id: "logic_fsygrbs67t40000",
          type: "common-node",
          x: 420,
          y: 140,
          properties: {
            type: "dataConvert",
            name: "数据转换1",
            componentName: "dataConvert",
            dc: {
              convertList: [
                {
                  key: "key1",
                  value: {
                    type: "dataConvert",
                    nodeId: "logic_9v5h5c4ium80000",
                  },
                },
                { key: "key2" },
                { key: "key3" },
              ],
              convertCode: "return [1, 2, 3]",
            },
          },
        },
        {
          id: "logic_9v5h5c4ium80000",
          type: "common-node",
          x: 580,
          y: 140,
          properties: {
            type: "dataConvert",
            name: "数据转换2",
            componentName: "dataConvert",
            dc: { convertList: [], convertCode: "return [3, 4, 5]" },
          },
        },
        {
          id: "logic_73gus8kpsgk0000",
          type: "common-node",
          x: 260,
          y: 140,
          properties: {
            type: "dataConvert",
            name: "数据转换",
            componentName: "dataConvert",
            dc: {
              convertList: [
                {
                  key: "key1",
                  value: {
                    type: "componentProp",
                    prop: "value",
                    field: "",
                    componentId: "InputNumber_azsj",
                    dataType: "number",
                    componentName: "数字输入框",
                    propName: "当前值",
                  },
                },
                {
                  key: "key2",
                  value: {
                    type: "componentProp",
                    prop: "value",
                    field: "",
                    componentId: "TimePicker_sxpq",
                    dataType: "number",
                    componentName: "时间选择器",
                    propName: "值",
                  },
                },
                {
                  key: "",
                  value: { type: "dataConvert", dataType: "string" },
                },
              ],
              convertCode:
                "const my_new_code_here = \"Blabla\"\n\nconsole.log('this.12123')\n\nreturn my_new_code_here",
            },
          },
        },
      ],
      edges: [
        {
          id: "logic_582qup4obxg0000",
          type: "logic-line",
          sourceNodeId: "logic_fsygrbs67t40000",
          targetNodeId: "logic_9v5h5c4ium80000",
          startPoint: { x: 470, y: 140 },
          endPoint: { x: 530, y: 140 },
          properties: {},
          pointsList: [
            { x: 470, y: 140 },
            { x: 530, y: 140 },
          ],
        },
        {
          id: "logic_3s6nbc92cx00000",
          type: "logic-line",
          sourceNodeId: "logic_98ujn64fwy00000",
          targetNodeId: "logic_d5nttghd60o0000",
          startPoint: { x: 310, y: 80 },
          endPoint: { x: 370, y: 80 },
          properties: {},
          pointsList: [
            { x: 310, y: 80 },
            { x: 370, y: 80 },
          ],
        },
        {
          id: "logic_93xrjtjbzs40000",
          type: "logic-line",
          sourceNodeId: "logic_98ujn64fwy00000",
          targetNodeId: "logic_fsygrbs67t40000",
          startPoint: { x: 310, y: 80 },
          endPoint: { x: 370, y: 140 },
          properties: {},
          pointsList: [
            { x: 310, y: 80 },
            { x: 334, y: 80 },
            { x: 334, y: 140 },
            { x: 370, y: 140 },
          ],
        },
        {
          id: "logic_fz4h8dc8yds0000",
          type: "logic-line",
          sourceNodeId: "init_1azos4vjtni8000",
          targetNodeId: "logic_98ujn64fwy00000",
          startPoint: { x: 150, y: 80 },
          endPoint: { x: 210, y: 80 },
          properties: {},
          pointsList: [
            { x: 150, y: 80 },
            { x: 210, y: 80 },
          ],
        },
        {
          id: "logic_2zcnfddo2ng0000",
          type: "logic-line",
          sourceNodeId: "init_1azos4vjtni8000",
          targetNodeId: "logic_73gus8kpsgk0000",
          startPoint: { x: 150, y: 80 },
          endPoint: { x: 210, y: 140 },
          properties: {},
          pointsList: [
            { x: 150, y: 80 },
            { x: 174, y: 80 },
            { x: 174, y: 140 },
            { x: 210, y: 140 },
          ],
        },
      ],
    },
  ],
};
