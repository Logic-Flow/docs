import { TaskNode } from "@logicflow/engine";

class Gateway extends TaskNode {
  async action(params: {
    executionId: string;
    actionId: string;
    nodeId: string;
    data?: Record<string, any>;
  }) {
    const { variable } = this.properties!;
    const value = window.prompt(`请输入${variable}的值`);
    this.globalData[(variable as string)] = value;
    return {
      status: "success",
    };
  }
}

export default Gateway;
