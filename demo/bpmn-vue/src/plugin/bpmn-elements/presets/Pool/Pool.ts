/* eslint-disable no-case-declarations */
/**
 * 泳道节点
 */
import { h } from '@logicflow/core';
import { GroupNode } from '@logicflow/extension';

const closetInteger = ( base: number) => {
  
   return (num: number) => base && (num - Math.round(num / base) * base  - 0 < Number.EPSILON ? num : Math.round(num / base) * base) || num;
}

export function PoolFactory(lf: any) {
  const { gridSize = 0 } = lf.graphModel
  const defaultMinWidth = 320
  const defaultMinHeight = 120

  const getInteger = closetInteger(gridSize)

  const laneMinSize = {
    width: getInteger(defaultMinWidth),
    height: getInteger(defaultMinHeight),
  };

  const textWidth = 4 * gridSize

  class model extends GroupNode.model {
    initNodeData(data: {
      width: number;
      height: number;
      properties: Record<string, any>;
    }) {
      super.initNodeData(data);
      this.height = laneMinSize.height;
      this.width = laneMinSize.width + textWidth
      this.resizable = true;
      this.zIndex = 1;
      this.text.editable = true;
    }
  
    setAttributes() {
      this.text = {
        ...this.text,
        value: this.text.value || '泳池示例',
        x: this.x - this.width / 2 + textWidth / 2,
        y: this.y,
      };
    }
  
    getTextStyle() {
      const style = super.getTextStyle();
      style.textWidth = 16;
      return style;
    }
  
    // 感应泳道变化，调整宽高
    resize(resizeId: string, newNodeSize: { id: string, x: number; width: number , y: number, height: number}) {
      if (!this.children.size) {
        return;
      }
      const lanes: any[] = [];
      let totalHeight= 0;
      this.children.forEach((elementId) => {
        const nodeModel: any = this.graphModel.getElement(elementId);
        const { type, id } = nodeModel;
        if (type === 'bpmn:participant') {
          lanes.push(nodeModel);
          totalHeight = totalHeight + (id === resizeId ? newNodeSize?.height : nodeModel.height)
        }
      });
      // 按y轴值排序
      lanes.sort((a, b) => {
        if (a.y < b.y) {
          return -1;
        }
        return 1;
      });
      const { y, height } = lanes[0]
      this.width = newNodeSize.width + textWidth;
      this.height = totalHeight;
      this.x = newNodeSize.x - textWidth / 2;
      this.y = y - height / 2 + totalHeight / 2

      this.setAttributes();
      this.resizeChildren({});
    }
  
    resizeChildren({ resizeDir = '', deltaHeight = 0 }) {
      const { x, y, width } = this;
      const lanes: any[] = [];
      this.children.forEach((elementId) => {
        const nodeModel: any = this.graphModel.getElement(elementId);
        const { type } = nodeModel;
        if (type === 'bpmn:participant') {
          lanes.push(nodeModel);
        }
      });
      // 按y轴值排序
      lanes.sort((a, b) => {
        if (a.y < b.y) {
          return -1;
        }
        return 1;
      });
      // 把泳池resize的高度加进来
      switch (resizeDir) {
        case 'below':
          // 高度加在最下面的泳道上
          const lastLane = lanes[lanes.length - 1];
          lastLane.height = lastLane.height + deltaHeight < laneMinSize.height
            ? laneMinSize.height
            : lastLane.height + deltaHeight;
          lanes[lanes.length - 1] = lastLane;
          break;
        case 'above':
          // 高度加在最上面的泳道上
          const firstLane = lanes[0];
          firstLane.height = firstLane.height + deltaHeight < laneMinSize.height
            ? laneMinSize.height
            : firstLane.height + deltaHeight;
          lanes[0] = firstLane;
          break;
        default:
          break;
      }
      const poolHeight = lanes.reduce((a, b) => a + b.height, 0);
      let aboveNodeHeights = 0;
      lanes.forEach((nodeModel, _index) => {
        const { height } = nodeModel;
        nodeModel.changeAttribute({
          width: width - textWidth,
          height,
          x: x + textWidth / 2,
          y: y - poolHeight / 2 + aboveNodeHeights + height / 2,
        });
        aboveNodeHeights += height;
      });
      this.height = poolHeight;
    }
  
    addChild(childId: any) {
      super.addChild(childId);
      this.graphModel.group.nodeGroupMap?.set(childId, this.id);
    }
  
    addChildAbove({ x, y, width, height }: any) {
      this.children.forEach((elementId) => {
        const nodeModel: any = this.graphModel.getElement(elementId);
        const { type, y: childY } = nodeModel;
        if (type !== 'bpmn:participant') {
          return;
        }
        // 在被操作的泳道之上
        if (childY < y) {
          nodeModel.changeAttribute({ y: childY - laneMinSize.height });
        }
      });

      const { id: laneId } = this.graphModel.addNode({
        type: 'bpmn:participant',
        properties: {
          nodeSize: {
            width,
            height: laneMinSize.height,
          },
        },
        x,
        y: y - ( height + laneMinSize.height ) / 2,
      });

      this.addChild(laneId);
      this.height = this.height + laneMinSize.height;
      this.y = this.y - laneMinSize.height / 2;
    }
  
    addChildBelow({ x, y, width, height }: any) {
      this.children.forEach((elementId) => {
        const nodeModel: any = this.graphModel.getElement(elementId);
        const { type, y: childY } = nodeModel;
        if (type !== 'bpmn:participant') {
          return;
        }
        // 在被操作的泳道之下
        if (childY > y) {
          nodeModel.changeAttribute({ y: childY + laneMinSize.height });
        }
      });
      const { id: laneId } = this.graphModel.addNode({
        type: 'bpmn:participant',
        properties: {
          nodeSize: {
            width,
            height: laneMinSize.height,
          },
        },
        x,
        y: y + height / 2 + laneMinSize.height / 2,
      });
      this.addChild(laneId);
      this.height = this.height + laneMinSize.height;
      this.y = this.y + laneMinSize.height / 2;
    }
  
    deleteChild(childId: any) {
      const laneChildren: any[] = [];
      this.children.forEach((elementId) => {
        const nodeModel: any = this.graphModel.getElement(elementId);
        const { type } = nodeModel;
        if (type === 'bpmn:participant') {
          laneChildren.push(nodeModel);
        }
      });
      if (laneChildren.length <= 1) {
        return;
      }
      this.removeChild(childId);
      this.graphModel.deleteNode(childId);
      // @ts-ignore
      this.resize();
    }
  }
  
  class view extends GroupNode.view {
    getResizeShape() {
      const { model } = this.props;
      const { x, y, width, height } = model;
      const style = model.getNodeStyle();
      // 标题区域
      const foldRectAttrs = {
        ...style,
        x: x - width / 2,
        y: y - height / 2,
        width: textWidth,
        height,
      };
      // 泳道区域
      const transRectAttrs = {
        ...style,
        x: x - width / 2 + textWidth,
        y: y - height / 2,
        width: width - textWidth,
        height,
        fill: 'transparent',
      };
      return h('g', {}, [
        // this.getAddAbleShape(),
        h('rect', { ...foldRectAttrs }),
        h('rect', { ...transRectAttrs }),
        this.getFoldIcon(),
      ]);
    }
  }
  
  return {
    type: 'bpmn:collaboration',
    view,
    model,
  };
}

