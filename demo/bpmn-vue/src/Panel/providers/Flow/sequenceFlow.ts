import {
  EdgeConfig,
  PolylineEdge,
  PolylineEdgeModel,
  GraphModel,
  h,
  BaseNode,
} from "@logicflow/core";
import { JSX } from "preact";
import { genBpmnId } from "../../utils";
// import { ManhattanLayout } from "./manhattan";

type SequenceFlowType = {
  // toJSON: Function;
  panels: string[];
  [key: string]: any;
};

// @ts-ignore
const getNodeBBox = (node: BaseNode) => {
  const { x, y, width, height }: any = node;
  const bbox = {
    minX: x - width / 2,
    minY: y - height / 2,
    maxX: x + width / 2,
    maxY: y + height / 2,
  };
  return {
    bbox,
  };
};

export function sequenceFlowFactory() {
  class SequenceFlowModel extends PolylineEdgeModel {
    static extendKey = "SequenceFlowModel";
    constructor(data: EdgeConfig, graphModel: GraphModel) {
      if (!data.id) {
        data.id = `Flow_${genBpmnId()}`;
      }
      const properties: SequenceFlowType = {
        ...data.properties,
        panels: ["condition"],
        isDefaultFlow: false,
      };
      data.properties = properties;

      super(data, graphModel);
    }
    // updatePoints(): void {
    //   const startBBox = getNodeBBox(this.sourceNode);
    //   const endBBox = getNodeBBox(this.targetNode);
    //   const nodes = this.graphModel.nodes;
    //   const obstacles = nodes.map((node) => {
    //     return getNodeBBox(node);
    //   });
    //   console.log(obstacles);
    //   const points = ManhattanLayout(
    //     {
    //       x: this.startPoint.x,
    //       y: this.startPoint.y,
    //     },
    //     {
    //       x: this.endPoint.x,
    //       y: this.endPoint.y,
    //     },
    //     startBBox,
    //     endBBox,
    //     // obstacles,
    //     20
    //   );
    //   this.pointsList = points;
    //   this.points = points.map((point) => `${point.x},${point.y}`).join(" ");
    // }
  }

  class SequenceFlowView extends PolylineEdge {
    static extendKey = "SequenceFlowEdge";
    getStartArrow(): JSX.Element | null {
      const { model } = this.props;
      const { isDefaultFlow } = model.properties;
      return isDefaultFlow
        ? h("path", {
            refX: 15,
            stroke: "#000000",
            strokeWidth: 2,
            d: "M 20 5 10 -5 z",
          })
        : h("path", {
            d: "",
          });
    }
  }

  return {
    type: `bpmn:sequenceFlow`,
    view: SequenceFlowView,
    model: SequenceFlowModel,
  };
}
