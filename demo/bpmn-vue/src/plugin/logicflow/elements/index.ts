import { definitionConfig, registerEventNodes } from "./Event";
import { registerGatewayNodes } from "./Gateway";
import { registerFlows } from "./Flow/indext";
import { registerTaskNodes } from "./Task";
import { registerPoolNodes } from "./Pool";

export function useDefinition(definition: any) {
  function setDefinition(definitionConfig: DefinitionConfigType[]) {
    function set(
      nodes: any[],
      definitions: EventDefinitionType[] | TaskDefinitionType[]
    ) {
      nodes.forEach((name) => {
        if (!definition?.[name]) {
          definition[name] = new Map();
        }
        let map = definition?.[name];
        definitions.forEach((define) => {
          map.set(define.type, define);
        });
      });
      return definition;
    }
    definitionConfig.forEach((define: any) => {
      set(define.nodes, define.definition);
    });
  }

  return () => [definition, setDefinition];
}

export class BpmnElement {
  static pluginName = "bpmnElement";
  constructor({ lf }: any) {
    lf.definition = {};
    lf.groups = new Map<string, Set<string>>();
    lf.useDefinition = useDefinition(lf.definition);
    const [_definitions, setDefinition] = lf.useDefinition();
    setDefinition(definitionConfig);

    registerEventNodes(lf);
    registerGatewayNodes(lf);
    registerFlows(lf);
    registerTaskNodes(lf);
    registerPoolNodes(lf);

    lf.setDefaultEdgeType("bpmn:sequenceFlow");
  }
}
