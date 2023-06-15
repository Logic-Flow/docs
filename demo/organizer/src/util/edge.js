export const pointFilter = (points) => {
  const allPoints = points;
  let i = 1;
  while (i < allPoints.length - 1) {
    const pre = allPoints[i - 1];
    const current = allPoints[i];
    const next = allPoints[i + 1];
    if ((pre.x === current.x && current.x === next.x)
      || (pre.y === current.y && current.y === next.y)) {
      allPoints.splice(i, 1);
    } else {
      i++;
    }
  }
  return allPoints;
};