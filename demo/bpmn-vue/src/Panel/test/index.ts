const proxyHandler = {
  set(target: any, prop: any, val: any, receiver: any) {
    return Reflect.set(target, prop, val, receiver);
  },
  get(target: any, prop: any, receiver: any) {
    return Reflect.get(target, prop, receiver);
  },
};

export function bindProperty(instance: any, path: string[]) {
  let targetName = '';
  try {
    const target = path.reduce((pre, cur, index) => {
      if (index === path.length - 1) {
        if (pre[cur] == null) {
          pre[cur] = '';
        }
        return pre;
      }
      if (pre[cur]) {
        targetName = path[index];
      } else {
        pre[cur] = {};
      }
      return pre[cur];
    }, instance);
    let proxyTarget = target;
    if (Object.prototype.toString.call(proxyTarget) !== '[object Proxy]') {
      proxyTarget = new Proxy(target, proxyHandler);
      instance[targetName] = proxyTarget;
    }
    // onchange
    return {
      target: proxyHandler,
      name: targetName,
    };
  } catch (error: any) {
    console.error(error.message);
  }
}
