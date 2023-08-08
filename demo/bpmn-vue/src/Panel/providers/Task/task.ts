import {
  GraphModel,
  NodeConfig,
  RectNode,
  RectNodeModel,
  h,
} from '@logicflow/core';
import { parallelMarker, sequentialMarker } from '../icons';
import { genBpmnId, groupRule } from '../../utils';

export const multiInstanceIcon: any = {
  parallel: parallelMarker,
  sequential: sequentialMarker,
  // loop: loopMarker,
};

type TaskType = {
  multiInstanceType: string;
  [key: string]: any;
};

export function TaskNodeHOF(lf: any) {
  return function TaskNodeFactory(type: string, icon: string | any[]) {
    class view extends RectNode {
      getLabelShape() {
        // @ts-ignore
        const { model } = this.props;
        const { x, y, width, height } = model;
        const style = model.getNodeStyle();
        const i = Array.isArray(icon)
          ? h(
              'g',
              {
                transform: `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`,
              },
              ...icon,
            )
          : h('path', {
              fill: style.stroke,
              d: icon,
            });
        return h(
          'svg',
          {
            x: x - width / 2 + 5,
            y: y - height / 2 + 5,
            width: 25,
            height: 25,
            viewBox: '0 0 1274 1024',
          },
          i,
        );
      }
      getShape() {
        // @ts-ignore
        const { model } = this.props;
        const { x, y, width, height, radius, properties } = model;
        const style = model.getNodeStyle();
        return h('g', {}, [
          h('rect', {
            ...style,
            x: x - width / 2,
            y: y - height / 2,
            rx: radius,
            ry: radius,
            width,
            height,
            opacity: 0.95,
          }),
          this.getLabelShape(),
          h(
            'g',
            {
              transform: `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`,
            },
            h('path', {
              fill: 'white',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              stroke: 'rgb(34, 36, 42)',
              strokeWidth: '2',
              d: multiInstanceIcon[properties.multiInstanceType] || '',
            }),
          ),
        ]);
      }
    }

    class model extends RectNodeModel {
      constructor(data: NodeConfig, graphModel: GraphModel) {
        if (!data.id) {
          data.id = `Activity_${genBpmnId()}`;
        }
        const properties: TaskType = {
          ...data.properties,
          multiInstanceType: '',
          panels: ['multiInstance'],
        };
        data.properties = properties;
        super(data, graphModel);
        properties?.boundaryEvents?.forEach((id: string) => {
          this.addBoundaryEvent(id);
        });
        this.deleteProperty('boundaryEvents');
        groupRule.call(this);
      }
      initNodeData(data: any) {
        super.initNodeData(data);
        // this.width = 100;
        // this.height = 60;
        this.isTaskNode = true; // 标识此节点是任务节点，可以被附件边界事件
        this.boundaryEvents = []; // 记录自己附加的边界事件
      }
      getNodeStyle() {
        const style = super.getNodeStyle();
        // isCloseToBoundary属性用于标识拖动边界节点是否靠近此节点
        // 如果靠近，则高亮提示
        const { isCloseToBoundary } = this.properties;
        // style.fill = 'rgb(255, 230, 204)';
        if (isCloseToBoundary) {
          style.stroke = '#00acff';
          style.strokeWidth = 2;
        }
        if (this.isSelected) {
          style.strokeWidth = 2;
        }
        return style;
      }
      getOutlineStyle() {
        const style = super.getOutlineStyle();
        style.stroke = 'transparent';
        // @ts-ignore
        !style?.hover && (style.hover = {});
        style.hover.stroke = 'transparent';
        return style;
      }
      /**
       * 提供方法给插件在判断此节点被拖动边界事件节点靠近时调用，从而触发高亮
       */
      setIsCloseToBoundary(flag: boolean) {
        this.setProperty('isCloseToBoundary', flag);
      }
      /**
       * 附加后记录被附加的边界事件节点Id
       */
      addBoundaryEvent(nodeId: string) {
        if (this.boundaryEvents.find((item: string) => item === nodeId)) {
          return false;
        }
        const boundaryEvent = lf.getNodeModelById(nodeId);
        boundaryEvent?.setProperties({
          attachedToRef: this.id,
        });
        this.boundaryEvents.push(nodeId);
        return true;
      }
      /**
       * 被附加的边界事件节点被删除时，移除记录
       */
      deleteBoundaryEvent(nodeId: string) {
        this.boundaryEvents = this.boundaryEvents.filter(
          (item: string) => item !== nodeId,
        );
      }
    }

    return {
      type: `bpmn:${type}`,
      view,
      model,
    };
  };
}
