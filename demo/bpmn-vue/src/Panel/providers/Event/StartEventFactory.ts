import {
  CircleNode,
  CircleNodeModel,
  NodeConfig,
  GraphModel,
  h,
} from '@logicflow/core';
import { genBpmnId } from '../../utils';

export function StartEventFactory(lf: any) {
  const [definition] = lf.useDefinition();
  console.log(definition);
  class view extends CircleNode {
    getAnchorStyle() {
      return {
        visibility: 'hidden',
      };
    }
    getShape() {
      //@ts-ignore
      const { model } = this.props;
      const style = model.getNodeStyle();
      const { x, y, r, width, height, properties } = model;
      const { definitionType, cancelActivity } = properties;
      const { icon } = definition['startEvent']?.get(definitionType) || {};
      const i = Array.isArray(icon)
        ? h(
            'g',
            {
              transform: `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`,
            },
            ...icon,
          )
        : h('path', {
            transform: `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`,
            d: icon,
            style:
              'fill: white; stroke-linecap: round; stroke-linejoin: round; stroke: rgb(34, 36, 42); stroke-width: 1px;',
          });
      return h(
        'g',
        {},
        h('circle', {
          ...style,
          cx: x,
          cy: y,
          r,
          strokeDasharray: cancelActivity ? '5,5' : '',
          strokeWidth: 2,
        }),
        i,
      );
    }
  }

  class model extends CircleNodeModel {
    constructor(data: NodeConfig, graphModel: GraphModel) {
      if (!data.id) {
        data.id = `Event_${genBpmnId()}`;
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
      const { properties } =
        definition['startEvent']?.get(data.properties?.definitionType) || {};
      data.properties = {
        ...properties,
        ...data.properties,
      };
      data.properties?.definitionType &&
        (data.properties!.definitionId = `${
          data.properties?.definitionType
        }EventDefinition_${genBpmnId()}`);
      super(data, graphModel);
    }
    setAttributes(): void {
      this.r = 18;
    }
    getConnectedSourceRules() {
      const rules = super.getConnectedSourceRules();
      const notAsSource = {
        message: '起始节点不能作为边的终点',
        validate: () => false,
      };
      rules.push(notAsSource);
      return rules;
    }
  }

  return {
    type: 'bpmn:startEvent',
    view,
    model,
  };
}
