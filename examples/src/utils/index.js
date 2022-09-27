export const TypeOf = (target, type) => {
  if (Object.prototype.toString.call(target) === `[object ${type}]`) {
    return true;
  }
  return false;
};

export const getScreenshots = () => {
  // const modules = import.meta.globEager("/public/screenshots/*.png", {
  //   eager: true,
  // });
  const modules = import.meta.globEager("/public/screenshots/*.png");
  // return modules[path].default;
  return (name) => {
    const path = `/public/screenshots/${name}.png`;
    return modules[path].default;
  };
  const fn = async (name) => {
    const path = `/public/screenshots/${name}.png`;
    const res = await modules[path]();
    console.log(res, res.default);
    return res.default;
  };
  return (name) => {
    return fn(name);
  };
};
