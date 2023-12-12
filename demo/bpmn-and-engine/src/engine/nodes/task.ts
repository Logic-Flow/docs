import { TaskNode } from "@logicflow/engine";

class ManualTask extends TaskNode {
  async action(params: {
    executionId: string;
    actionId: string;
    nodeId: string;
    data?: Record<string, any>;
  }) {
    const { flag } = this.properties!;
    const value = window.confirm(`${flag}是否通过？`);
    if (value) {
      return {
        status: "success",
      };
    } else {
      return {
        status: "error",
      };
    }
  }
}

export default ManualTask;
