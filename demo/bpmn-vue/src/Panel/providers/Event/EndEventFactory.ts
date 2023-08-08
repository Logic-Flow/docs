import {
  CircleNode,
  CircleNodeModel,
  GraphModel,
  NodeConfig,
  h,
} from "@logicflow/core";
import { genBpmnId, groupRule } from "../../utils";

export function EndEventFactory(lf: any) {
  const [definition] = lf.useDefinition();
  class view extends CircleNode {
    getAnchorStyle() {
      return {
        visibility: "hidden",
      };
    }
    getShape() {
      // @ts-ignore
      const { model } = this.props;
      const style = model.getNodeStyle();
      const { x, y, r, width, height, properties } = model;
      const outCircle = super.getShape();
      const { definitionType } = properties;
      const { icon } = definition["endEvent"]?.get(definitionType) || {};
      const i = Array.isArray(icon)
        ? h(
            "g",
            {
              transform: `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`,
            },
            ...icon
          )
        : h("path", {
            transform: `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`,
            d: icon,
            style:
              "fill: black; stroke-linecap: round; stroke-linejoin: round; stroke: white; stroke-width: 1px;",
          });
      return h(
        "g",
        {},
        outCircle,
        h("circle", {
          ...style,
          strokeWidth: 2,
          cx: x,
          cy: y,
          r: r - 2,
        }),
        i
      );
    }
  }
  class model extends CircleNodeModel {
    constructor(data: NodeConfig, graphModel: GraphModel) {
      if (!data.id) {
        data.id = `Event_${genBpmnId()}`;
      }
      if (!data.text) {
        data.text = "";
      }
      if (data.text && typeof data.text === "string") {
        data.text = {
          value: data.text,
          x: data.x,
          y: data.y + 40,
        };
      }
      const { properties } =
        definition["endEvent"]?.get(data.properties?.definitionType) || {};
      data.properties = {
        ...properties,
        ...data.properties,
      };
      data.properties?.definitionType &&
        (data.properties!.definitionId = `${
          data.properties?.definitionType
        }EventDefinition_${genBpmnId()}`);
      super(data, graphModel);
      groupRule.call(this);
    }
    setAttributes(): void {
      this.r = 18;
    }
    getConnectedSourceRules() {
      const rules = super.getConnectedSourceRules();
      const notAsSource = {
        message: "结束节点不能作为边的起点",
        validate: () => false,
      };
      rules.push(notAsSource);
      return rules;
    }
  }

  return {
    type: "bpmn:endEvent",
    view,
    model,
  };
}
