export const TypeOf = (target, type) => {
  if (Object.prototype.toString.call(target) === `[object ${type}]`) {
    return true;
  }
  return false;
};

export const getScreenshots = () => {
  const mode = import.meta.env.MODE;
  if (mode === "development") {
    return (name) => {
      return `/src/screenshots/${name}.png`;
    };
  } else {
    const modules = import.meta.globEager("/src/screenshots/*.png");
    return (name) => {
      const path = `/src/screenshots/${name}.png`;
      return modules[path].default;
    };
  }
};
