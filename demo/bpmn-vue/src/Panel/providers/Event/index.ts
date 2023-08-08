import LogicFlow from "@logicflow/core";
import { messageIcon, timerIcon } from "../icons";
import { EndEventFactory } from "./EndEventFactory";
import { IntermediateCatchEventFactory } from "./IntermediateEventFactory";
import { StartEventFactory } from "./StartEventFactory";
import { BoundaryEventFactory } from "./boundaryEventFactory";
import { IntermediateThrowEventFactory } from "./IntermediateThrowEvent";

export const definitionConfig: DefinitionConfigType[] = [
  {
    nodes: ["startEvent", "intermediateCatchEvent", "boundaryEvent"],
    definition: [
      {
        type: "bpmn:timerEventDefinition",
        icon: timerIcon,
        properties: {
          definitionType: "bpmn:timerEventDefinition",
          timerValue: "",
          timerType: "",
          panels: ["timerDefinition"],
        },
      },
    ],
  },
  {
    nodes: ["endEvent"],
    definition: [
      {
        type: "bpmn:messageEventDefinition",
        icon: messageIcon,
        properties: {
          definitionType: "bpmn:messageEventDefinition",
          panels: [],
        },
      },
    ],
  },
];

export function registerEventNodes(lf: LogicFlow) {
  lf.register(StartEventFactory(lf));
  lf.register(EndEventFactory(lf));
  lf.register(IntermediateCatchEventFactory(lf));
  lf.register(IntermediateThrowEventFactory(lf));
  lf.register(BoundaryEventFactory(lf));
}
