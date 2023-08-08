import LogicFlow from '@logicflow/core';
import { exclusiveIcon, parallelIcon, inclusiveIcon } from '../icons';
import { GatewayNodeHOF } from './gateway';

export function registerGatewayNodes(lf: LogicFlow) {
  const GatewayNode = GatewayNodeHOF(lf);

  const ExclusiveGateway = GatewayNode('exclusiveGateway', exclusiveIcon);

  const ParallelGateway = GatewayNode('parallelGateway', parallelIcon);

  const InclusiveGateway = GatewayNode('inclusiveGateway', inclusiveIcon);
  lf.register(ExclusiveGateway);
  lf.register(InclusiveGateway);
  lf.register(ParallelGateway);
}
