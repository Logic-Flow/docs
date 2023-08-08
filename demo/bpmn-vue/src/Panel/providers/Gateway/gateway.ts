import {
  GraphModel,
  NodeConfig,
  PolygonNode,
  PolygonNodeModel,
  h,
} from '@logicflow/core';
import { genBpmnId, groupRule } from '../../utils';

// @ts-ignore
const gateway = {
  exclusive: 0,
  inclusive: 1,
  parallel: 2,
};

/**
 * index 0 排他网关
 * index 1 包容网关
 * index 2 并行网关
 */
export const gatewayComposable = [
  [1, 1, 0],
  [0, 0, 1],
  [0, 1, 1],
];

export function GatewayNodeHOF(_lf: any) {
  return function GatewayNode(type: string, icon: string | object) {
    class view extends PolygonNode {
      getShape() {
        // @ts-ignore
        const { model } = this.props;
        const { x, y, width, height, points } = model;
        const style = model.getNodeStyle();
        return h(
          'g',
          {
            transform: `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`,
          },
          h('polygon', {
            ...style,
            x,
            y,
            points,
          }),
          typeof icon === 'string'
            ? h('path', {
                d: icon,
                ...style,
                fill: 'rgb(34, 36, 42)',
                strokeWidth: 1,
              })
            : icon,
        );
      }
    }

    class model extends PolygonNodeModel {
      constructor(data: NodeConfig, graphModel: GraphModel) {
        if (!data.id) {
          data.id = `Gateway_${genBpmnId()}`;
        }
        if (!data.text) {
          data.text = '';
        }
        if (data.text && typeof data.text === 'string') {
          data.text = {
            value: data.text,
            x: data.x,
            y: data.y + 40,
          };
        }
        super(data, graphModel);
        this.points = [
          [25, 0],
          [50, 25],
          [25, 50],
          [0, 25],
        ];
        groupRule.call(this);
      }
    }

    return {
      type: `bpmn:${type}`,
      view,
      model,
    };
  };
}
