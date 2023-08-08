import { h } from '@logicflow/core';
import { GroupNode } from '@logicflow/extension';

export function SubProcessHOF(lf: any) {
  class view extends GroupNode.view {
    // @ts-ignore
    getFoldIcon() {
      const { model } = this.props;
      const { x, y, width, height, properties, foldable } = model;
      const foldX = model.x - model.width / 2 + 5;
      const foldY = model.y - model.height / 2 + 5;
      if (!foldable) return null;
      const iconIcon = h('path', {
        fill: 'none',
        stroke: '#818281',
        strokeWidth: 2,
        'pointer-events': 'none',
        d: properties.isFolded
          ? `M ${foldX + 3},${foldY + 6} ${foldX + 11},${foldY + 6} M${
              foldX + 7
            },${foldY + 2} ${foldX + 7},${foldY + 10}`
          : `M ${foldX + 3},${foldY + 6} ${foldX + 11},${foldY + 6} `,
      });
      return h('g', {}, [
        h('rect', {
          height: 12,
          width: 14,
          rx: 2,
          ry: 2,
          strokeWidth: 1,
          fill: '#F4F5F6',
          stroke: '#CECECE',
          cursor: 'pointer',
          x: x - width / 2 + 5,
          y: y - height / 2 + 5,
          onClick: (e: any) => {
            e.stopPropagation();
            model.foldGroup(!properties.isFolded);
          },
        }),
        iconIcon,
      ]);
    }
    getResizeShape() {
      const { model } = this.props;
      const { x, y, width, height } = model;
      const style = model.getNodeStyle();
      const foldRectAttrs = {
        ...style,
        x: x - width / 2,
        y: y - height / 2,
        width,
        height,
        stroke: 'black',
        strokeWidth: 2,
        strokeDasharray: '0 0',
      };
      return h('g', {}, [
        // this.getAddAbleShape(),
        h('rect', { ...foldRectAttrs }),
        this.getFoldIcon(),
      ]);
    }
  }

  class model extends GroupNode.model {
    initNodeData(data: {
      width: number;
      height: number;
      properties: Record<string, any>;
    }) {
      super.initNodeData(data);
      this.foldable = true;
      // this.isFolded = true;
      this.resizable = true;
      this.width = 400;
      this.height = 200;
      // 根据 properties中的配置重设 宽高
      this.resetWidthHeight();
      lf.groups.set(this.id, new Set<string>());
    }
    // 自定义根据properties.iniProp
    resetWidthHeight() {
      const width = this.properties.iniProp?.width;
      const height = this.properties.iniProp?.height;
      width && (this.width = width);
      height && (this.height = height);
    }
    getNodeStyle() {
      const style = super.getNodeStyle();
      style.stroke = '#989891';
      style.strokeWidth = 1;
      style.strokeDasharray = '3 3';
      if (this.isSelected) {
        style.stroke = 'rgb(124, 15, 255)';
      }

      return style;
    }
    addChild(id: string) {
      lf.groups.get(this.id).add(id);
      super.addChild(id);
    }
    // 隐藏锚点而不是设置锚点数为0
    // 因为分组内部节点与外部节点相连时，
    // 如果折叠分组，需要分组代替内部节点与外部节点相连。
    getAnchorStyle() {
      const style = super.getAnchorStyle({});
      style.stroke = '#000';
      style.fill = '#fff';
      style.hover.stroke = 'transparent';
      return style;
    }
  }

  return {
    type: 'bpmn:subProcess',
    model,
    view,
  };
}
