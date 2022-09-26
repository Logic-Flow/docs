export const TypeOf = (target, type) => {
  if (Object.prototype.toString.call(target) === `[object ${type}]`) {
    return true;
  }
  return false;
};
