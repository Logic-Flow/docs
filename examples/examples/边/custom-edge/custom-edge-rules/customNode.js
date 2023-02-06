
class SquareModel extends RectNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    // 设置校验规则方法1
    const circleOnlyAsTarget = {
      message: "矩形节点下一个节点只能是圆形或多边形节点",
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return targetNode.type === "customCircleNode" || targetNode.type === "customPolygonNode";
      },
    };
    this.sourceRules.push(circleOnlyAsTarget);
  }

  // 设置校验规则方法2
  // getConnectedSourceRules() {
  //   const rules = super.getConnectedSourceRules();
  //   const geteWayOnlyAsTarget = {
  //     message: "下一个节点只能是circle",
  //     validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
  //       return targetNode.type === "circle";
  //     }
  //   };
  //   rules.push(geteWayOnlyAsTarget);
  //   return rules;
  // }

  getNodeStyle() {
    const style = super.getNodeStyle();
    // 如果此节点不允许被连接，节点变红
    if (this.state === 5) {
      style.fill = "red";
    }
    if (this.state === 4) {
      style.fill = "green";
    }
    return style;
  }
}


class CircleModel extends CircleNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    // 如果此节点不允许被连接，节点变红
    if (this.state === 5) {
      style.fill = "red";
    }
    if (this.state === 4) {
      style.fill = "green";
    }
    return style;
  }
}

class EllipseModel extends EllipseNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    // 如果此节点不允许被连接，节点变红
    if (this.state === 5) {
      style.fill = "red";
    }
    if (this.state === 4) {
      style.fill = "green";
    }
    return style;
  }
}

class PolygonModel extends PolygonNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle();
    // 如果此节点不允许被连接，节点变红
    if (this.state === 5) {
      style.fill = "red";
    }
    if (this.state === 4) {
      style.fill = "green";
    }
    return style;
  }
}

export const customRectNode = {
  type: "customRectNode",
  model: SquareModel,
  view: RectNode
};

export const customCircleNode = {
  type: "customCircleNode",
  model: CircleModel,
  view: CircleNode
};

export const customEllipseNode = {
  type: "customEllipseNode",
  model: EllipseModel,
  view: EllipseNode
};

export const customPolygonNode = {
  type: "customPolygonNode",
  model: PolygonModel,
  view: PolygonNode
};