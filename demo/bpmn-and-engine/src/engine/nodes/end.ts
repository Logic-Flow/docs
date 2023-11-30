import { TaskNode } from "@logicflow/engine";

class End extends TaskNode {
  async action(params: {
    executionId: string;
    actionId: string;
    nodeId: string;
    data?: Record<string, any>;
  }) {
    window.alert('执行结束')
  }
}

export default End;
