import { StartNode } from "@logicflow/engine";

class TimerStart extends StartNode {
  async action(_) {
    const { timerValue, timerType } = this.properties!;
    if (!timerType) {
      return {
        status: "success",
      };
    } else {
      let timer: number = +(timerValue as string);
      return new Promise((resolve) => {
        setTimeout(function run() {
          window.alert(`延迟执行，还剩${timer}秒`);
          if (--timer) {
            setTimeout(run, 1000);
          } else {
            resolve({
              status: "success",
            });
          }
        });
      });
    }
  }
}

export default TimerStart;
