class NodeBase {
  x: any;
  y: any;
  G: number;
  H: number;
  isProcessed: boolean;
  connection: null;
  from: null;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.G = 0;
    this.H = 0;
    this.isProcessed = false;
    this.connection = null;
    this.from = null;
  }
  get F() {
    return this.G + this.H;
  }
  setProcessed(flag: boolean) {
    this.isProcessed = flag;
  }
  setConnection(connection: null) {
    this.connection = connection;
  }
  setFrom(from: null) {
    this.from = from;
  }
  setG(g: number) {
    this.G = g;
  }
  setH(h: number) {
    this.H = h;
  }
  getManhattanDistanceTo(point: { x: any; y: any; }) {
    const { x: x1, y: y1 } = this;
    const { x: x2, y: y2 } = point;
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }
}

class PriorityQueue {
  heap: any[];
  constructor() {
    this.heap = [];
  }

  enqueue(node: { x: any; y: any; }, priority: number) {
    this.heap.push({ node, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return min;
  }

  bubbleUp(index: number) {
    const node = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (node.priority >= parent.priority) break;
      this.heap[parentIndex] = node;
      this.heap[index] = parent;
      index = parentIndex;
    }
  }

  sinkDown(index: number) {
    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;
    let smallestChildIndex = index;
    const length = this.heap.length;

    if (
      leftChildIndex < length &&
      this.heap[leftChildIndex].priority <
        this.heap[smallestChildIndex].priority
    ) {
      smallestChildIndex = leftChildIndex;
    }

    if (
      rightChildIndex < length &&
      this.heap[rightChildIndex].priority <
        this.heap[smallestChildIndex].priority
    ) {
      smallestChildIndex = rightChildIndex;
    }

    if (smallestChildIndex !== index) {
      const swapNode = this.heap[smallestChildIndex];
      this.heap[smallestChildIndex] = this.heap[index];
      this.heap[index] = swapNode;
      this.sinkDown(smallestChildIndex);
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

function expandBBox(bbox: { minX: any; minY: any; maxX: any; maxY: any; }, offset: number) {
  const { minX, minY, maxX, maxY } = bbox;
  return {
    minX: minX - offset,
    minY: minY - offset,
    maxX: maxX + offset,
    maxY: maxY + offset,
  };
}

function getPointsFromBBoxBorder(bbox: { minX: any; minY: any; maxX: any; maxY: any; }) {
  const { minX, minY, maxX, maxY } = bbox;
  return [
    { x: minX, y: minY },
    {
      x: minX + (maxX - minX) / 2,
      y: minY,
    },
    { x: maxX, y: minY },
    {
      x: maxX,
      y: minY + (maxY - minY) / 2,
    },
    { x: maxX, y: maxY },
    {
      x: minX + (maxX - minX) / 2,
      y: maxY,
    },
    { x: minX, y: maxY },
    {
      x: minX,
      y: minY + (maxY - minY) / 2,
    },
  ];
}

function getHull(points: any[]) {
  const xs = points.map((item: { x: any; }) => item.x);
  const ys = points.map((item: { y: any; }) => item.y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
}

function isPointInsideTheBoxes(point: { x: number, y: number}, bboxes: any) {
  let flag = false;
  for (const bbox of bboxes) {
    if (isBBoxContainThePoint(bbox, point)) {
      flag = true;
      break;
    }
  }
  return flag;
}

// @ts-ignore
function innerToOutside(hull: { minX: any; minY: any; maxX: any; maxY: any; }, bbox: { minX: any; minY: any; maxX: any; maxY: any; }) {
  const { minX, minY, maxX, maxY } = bbox;
  const { minX: hx1, minY: hy1, maxX: hx2, maxY: hy2 } = hull;

  return [
    {
      x: hx1,
      y: minY,
    },
    {
      x: hx1,
      y: maxY,
    },
    {
      x: hx1 + (hx2 - hx1) / 2,
      y: minY,
    },
    {
      x: hx1 + (hx2 - hx1) / 2,
      y: maxY,
    },
    {
      x: hx2,
      y: minY,
    },
    {
      x: hx2,
      y: maxY,
    },
    {
      x: minX,
      y: hy1,
    },
    {
      x: maxX,
      y: hy1,
    },
    {
      x: minX,
      y: hy1 + (hy2 - hy1) / 2,
    },
    {
      x: maxX,
      y: hy1 + (hy2 - hy1) / 2,
    },
    {
      x: minX,
      y: hy2,
    },
    {
      x: maxX,
      y: hy2,
    },
  ];
}

function isBBoxContainThePoint(bbox: { minX: any; minY: any; maxX: any; maxY: any; }, p: { x: any; y: any; }) {
  const { x, y } = p;
  const { minX, minY, maxX, maxY } = bbox;
  // ignore the point on the border
  return x > minX && x < maxX && y > minY && y < maxY;
}

// @ts-ignore
function filterPointsByBBox(points: any, bboxes: any) {
  const res = [];
  for (const point of points) {
    let flag = false;
    for (const bbox of bboxes) {
      if (isBBoxContainThePoint(bbox, point)) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      res.push(new NodeBase(point.x, point.y));
    }
  }
  return res;
}

function isSegmentsIntersected(seg1: any[], seg2: any[]) {
  const [p0, p1] = seg1;
  const [p2, p3] = seg2;
  const s1x = p1.x - p0.x;
  const s1y = p1.y - p0.y;
  const s2x = p3.x - p2.x;
  const s2y = p3.y - p2.y;

  const s =
    (-s1y * (p0.x - p2.x) + s1x * (p0.y - p2.y)) / (-s2x * s1y + s1x * s2y);
  const t =
    (s2x * (p0.y - p2.y) - s2y * (p0.x - p2.x)) / (-s2x * s1y + s1x * s2y);

  return s >= 0 && s <= 1 && t >= 0 && t <= 1;
}

function getVerticesFromBBox(bbox: { minX: any; minY: any; maxX: any; maxY: any; }) {
  const { minX, minY, maxX, maxY } = bbox;
  return [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY },
  ];
}

// @ts-ignore
function isBBoxOverlap(bbox1: { minX: any; minY: any; maxX: any; maxY: any; }, bbox2: { minX: any; minY: any; maxX: any; maxY: any; }) {
  const { minX: x1, minY: y1, maxX: x2, maxY: y2 } = bbox1;
  const { minX: x3, minY: y3, maxX: x4, maxY: y4 } = bbox2;
  const center1 = {
    x: x1 + (x2 - x1) / 2,
    y: y1 + (y2 - y1) / 2,
  };
  const center2 = {
    x: x3 + (x4 - x3) / 2,
    y: y3 + (y4 - y3) / 2,
  };
  return (
    Math.abs(center1.x - center2.x) <
      Math.abs(x1 - x2) / 2 + Math.abs(x3 - x4) / 2 &&
    Math.abs(center1.y - center2.y) <
      Math.abs(y1 - y2) / 2 + Math.abs(y3 - y4) / 2
  );
}

function isSegmentCrossingBBox(line: { x: any; y: any; }[] | [any, any], bbox: any) {
  const [p1, p2] = line;
  if (bbox.width === 0 && bbox.height === 0) {
    return false;
  }
  const [pa, pb, pc, pd] = getVerticesFromBBox(bbox);
  let count = 0;
  if (isSegmentsIntersected([p1, p2], [pa, pb])) {
    count++;
  }
  if (isSegmentsIntersected([p1, p2], [pa, pd])) {
    count++;
  }
  if (isSegmentsIntersected([p1, p2], [pb, pc])) {
    count++;
  }
  if (isSegmentsIntersected([p1, p2], [pc, pd])) {
    count++;
  }
  return count != 0;
}

function findNeighbors(node: { x: number; y: number; }, nodes: any[], bboxes: string | any[], _orient: any) {
  const neighborsSet = new Set();
  const neighbors = [];
  const points: any = {
    left: null,
    right: null,
    top: null,
    bottom: null,
  };
  nodes.forEach((item: any | null) => {
    if ((item.x === node.x || item.y === node.y) && item !== node) {
      if (item.x === node.x) {
        if (node.y - item.y >= 0) {
          if (!points.top) {
            points.top = item;
          } else if (points.top.y < item.y) {
            points.top = item;
          }
        } else {
          if (!points.bottom) {
            points.bottom = item;
          } else if (points.bottom.y > item.y) {
            points.bottom = item;
          }
        }
      }
      if (item.y === node.y) {
        if (node.x - item.x >= 0) {
          if (!points.left) {
            points.left = item;
          } else if (points.left.x < item.x) {
            points.left = item;
          }
        } else {
          if (!points.right) {
            points.right = item;
          } else if (points.right.x > item.x) {
            points.right = item;
          }
        }
      }
    }
    // let flag = 0;
    // for (const bbox of bboxes) {
    //   const bool = isSegmentCrossingBBox(
    //     [
    //       { x: node.x, y: node.y },
    //       { x: item.x, y: item.y },
    //     ],
    //     bbox
    //   );
    //   if (bool) {
    //     flag--;
    //     break;
    //   }
    //   flag++;
    // }
    // flag === 2 &&
    //   `${item.x}/${item.y}` !== `${node.x}/${node.y}` &&
    //   neighborsSet.add(item);
  });
  // const [prefix, suffix] = orient.split(":");
  // const other = Object.keys(points).filter(
  //   (item) => ![prefix, suffix].includes(item)
  // );
  // const res = [
  //   points[prefix],
  //   points[suffix],
  //   ...other.map((item) => points[item]),
  // ];
  const { left, right, top, bottom } = points;
  const res = [left, right, top, bottom];
  return res.filter((item) => {
    if (!item) return false;
    let flag = 0;
    for (const bbox of bboxes) {
      const bool = isSegmentCrossingBBox(
        [
          { x: node.x, y: node.y },
          { x: item.x, y: item.y },
        ],
        bbox
      );
      if (bool) {
        flag--;
        break;
      }
      flag++;
    }
    return flag === bboxes.length;
  });
  for (const point of neighborsSet) {
    neighbors.push(point);
  }

  return neighbors;
}

function aStarFindPath(startNode: NodeBase, endNode: NodeBase, points: NodeBase[], bboxes: never[], orient: string) {
  let toSearch = [startNode];
  while (toSearch.length) {
    let current = toSearch[0];

    for (const item of toSearch) {
      if (item.F < current.F || (item.F === current.F && item.H < current.H)) {
        current = item;
      }
    }

    if (`${current.x}/${current.y}` === `${endNode.x}/${endNode.y}`) {
      const res = [{ x: current.x, y: current.y }];
      while (current.connection) {
        const { connection }: any = current;
        res.push({
          x: connection.x,
          y: connection.y,
        });
        current = current.connection;
      }
      return res.reverse();
    }

    current.setProcessed(true);
    toSearch = toSearch.filter(
      (item) => `${current.x}/${current.y}` !== `${item.x}/${item.y}`
    );

    const neighbors = findNeighbors(current, points, bboxes, orient).filter(
      (item) => !item.isProcessed
    );
    for (const neighbor of neighbors) {
      if (neighbor.isProcessed) continue;
      const inSearch = toSearch.includes(current);
      const costToNeighbor =
        current.G + current.getManhattanDistanceTo(neighbor);

      if (!inSearch || costToNeighbor < neighbor.G) {
        neighbor.setG(costToNeighbor);
        neighbor.setConnection(current);
        current.setFrom(neighbor);

        if (!inSearch) {
          neighbor.setH(neighbor.getManhattanDistanceTo(endNode));
          toSearch.push(neighbor);
        }
      }
    }
  }
  let current = startNode;
  const res = [{ x: current.x, y: current.y }];
  while (current.from) {
    const { from }: any = current;
    res.push({
      x: from.x,
      y: from.y,
    });
    current = current.from;
  }
  return res;
}

function aStarFindPathByGrid(startNode: NodeBase, endNode: NodeBase, step: number, bboxes: any[], outside: { minX: number; minY: number; maxX: number; maxY: number; }) {
  let toSearch = [startNode];
  const searchSet = new Set();

  while (toSearch.length) {
    let current: any = toSearch[0];

    for (const item of toSearch) {
      if (item.F < current.F || (item.F === current.F && item.H < current.H)) {
        current = item;
      }
    }

    if (`${current.x}/${current.y}` === `${endNode.x}/${endNode.y}`) {
      const res = [{ x: current.x, y: current.y }];
      while (current.connection) {
        const { connection }: any = current;
        res.push({
          x: connection.x,
          y: connection.y,
        });
        current = current.connection;
      }
      return res.reverse();
    }

    const val = `${current.x}/${current.y}`;

    !searchSet.has(val) && searchSet.add(val);

    toSearch = toSearch.filter(
      (item) => `${current.x}/${current.y}` !== `${item.x}/${item.y}`
    );

    const neighborsRes = findNeighborsByGridStep(
      current,
      step,
      bboxes,
      outside
    ).filter((item) => {
      const flag = !isPointInsideTheBoxes(item, bboxes);
      //   console.log(flag);
      return flag;
    });

    const tmpRes: NodeBase[] = [];
    neighborsRes.forEach((item) => {
      const val = `${item.x}/${item.y}`;
      if (!searchSet.has(val)) {
        tmpRes.push(item);
        tmpRes.push(item);
      }
    });

    for (const neighbor of tmpRes) {
      if (neighbor.isProcessed) continue;
      const inSearch = toSearch.includes(current);
      const costToNeighbor =
        current.G + current.getManhattanDistanceTo(neighbor);

      if (!inSearch || costToNeighbor < neighbor.G) {
        neighbor.setG(costToNeighbor);
        neighbor.setConnection(current);
        current.setFrom(neighbor);

        if (!inSearch) {
          neighbor.setH(neighbor.getManhattanDistanceTo(endNode));
          toSearch.push(neighbor);
        }
      }
    }
  }
  return null;
}

function findNeighborsByGridStep(cur: any, step: number, bboxes: any, outside: { minX: any; minY: any; maxX: any; maxY: any; }) {
  const neighbors: any[] = [];
  const { x, y } = cur;
  const { minX, minY, maxX, maxY } = outside;
  const x1 = x - step;
  const x2 = x + step;
  const y1 = y - step;
  const y2 = y + step;
  function isValid(cur: { x: any; y: any; }, neighbor: { x: any; y: any; }, bboxes: any) {
    let flag =
      !isPointInsideTheBoxes(neighbor, bboxes) &&
      !isPointInsideTheBoxes(cur, bboxes);
    if (!flag) return false;
    for (const bbox of bboxes) {
      if (
        isSegmentCrossingBBox(
          [
            { x: cur.x, y: cur.y },
            { x: neighbor.x, y: neighbor.y },
          ],
          bbox
        )
      ) {
        flag = false;
        break;
      }
    }
    return flag;
  }
  if (x1 >= minX) {
    isValid(cur, { x: x1, y }, bboxes) && neighbors.push(new NodeBase(x1, y));
  }
  if (x2 <= maxX) {
    isValid(cur, { x: x2, y }, bboxes) && neighbors.push(new NodeBase(x2, y));
  }
  if (y1 >= minY) {
    isValid(cur, { x, y: y1 }, bboxes) && neighbors.push(new NodeBase(x, y1));
  }
  if (y2 <= maxY) {
    isValid(cur, { x, y: y2 }, bboxes) && neighbors.push(new NodeBase(x, y2));
  }
  return neighbors;
}

function manhattanDistance(p1: { x: any; y: any; }, p2: { x: any; y: any; }) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

// @ts-ignore
function dijkstraFindPath(start: any, end: any, step: any, bboxes: any, outside: any) {
  const visited = new Set();
  const distances = new Map();
  const previousNodes = new Map();
  const queue = new PriorityQueue();
  console.log("1");
  // return;
  distances.set(start, 0);
  queue.enqueue(start, 0);
  console.log("2", queue, distances);
  return;

  while (!queue.isEmpty()) {
    console.log("3");
    const { node: currentNode } = queue.dequeue();
    visited.add(`${currentNode.x}/${currentNode.y}`);

    if (currentNode === end) {
      break; // Reached the destination
    }

    const neighbors = findNeighborsByGridStep(
      currentNode,
      step,
      bboxes,
      outside
    ).map(({ x, y }) => {
      return {
        x,
        y,
      };
    });

    for (const neighbor of neighbors) {
      if (visited.has(`${neighbor.x}/${neighbor.y}`)) {
        continue; // Skip already visited nodes
      }

      const distance =
        distances.get(currentNode) + manhattanDistance(currentNode, neighbor);

      if (!distances.has(neighbor) || distance < distances.get(neighbor)) {
        distances.set(neighbor, distance);
        previousNodes.set(neighbor, currentNode);
        queue.enqueue(neighbor, distance);
      }
    }
  }
  console.log("4");
  return;

  // Reconstruct the path from start to end
  const shortestPath = [];
  let node = end;
  while (node !== start) {
    console.log("5");
    shortestPath.unshift(node);
    node = previousNodes.get(node);
  }
  shortestPath.unshift(start);
  console.log("6");

  return shortestPath;
}

function getAnchorWithOffset({ bbox }: any, node: { x: number; y: number; }, offset: number): any {
  const { minX, minY, maxX, maxY } = bbox;
  const { x, y } = node;
  if (x === minX) {
    return {
      x: x - offset,
      y,
    };
  }
  if (x === maxX) {
    return {
      x: x + offset,
      y,
    };
  }
  if (y === minY) {
    return {
      x,
      y: y - offset,
    };
  }
  if (y === maxY) {
    return {
      x,
      y: y + offset,
    };
  }
}

// @ts-ignore
function douglasPeuckerSimplify(points: string | any[], threshold: number): any {
  if (points.length <= 2) {
    return points;
  }

  let dmax = 0;
  let index = 0;

  const startPoint = points[0];
  const endPoint = points[points.length - 1];

  // 计算距离起点和终点最远的点
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], startPoint, endPoint);

    if (d > dmax) {
      index = i;
      dmax = d;
    }
  }

  // 如果最远点的距离小于等于阈值，直接返回起点和终点
  if (dmax <= threshold) {
    return [startPoint, endPoint];
  }

  // 否则递归地简化左侧和右侧的点集
  const leftPoints = douglasPeuckerSimplify(
    points.slice(0, index + 1),
    threshold
  );
  const rightPoints = douglasPeuckerSimplify(points.slice(index), threshold);

  // 合并左侧和右侧的简化结果
  return leftPoints.slice(0, leftPoints.length - 1).concat(rightPoints);
}

// function perpendicularDistance(point, start, end) {
//   const { x: startX, y: startY } = start;
//   const { x: endX, y: endY } = end;
//   const { x, y } = point;

//   const numerator = Math.abs(
//     (endY - startY) * x - (endX - startX) * y + endX * startY - endY * startX
//   );
//   const denominator = Math.sqrt((endY - startY) ** 2 + (endX - startX) ** 2);

//   return numerator / denominator;
// }

function perpendicularDistance(point: { x: any; y: any; }, lineStart: { x: any; y: any; }, lineEnd: { x: any; y: any; }) {
  const { x: x1, y: y1 } = lineStart;
  const { x: x2, y: y2 } = lineEnd;
  const { x, y } = point;

  if (x1 === x2) {
    // 线段是垂直的
    return Math.abs(x - x1);
  }

  if (y1 === y2) {
    // 线段是水平的
    return Math.abs(y - y1);
  }

  // 计算点到线段垂直点的坐标
  let px =
    x1 +
    ((x2 - x1) * ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1))) /
      ((x2 - x1) ** 2 + (y2 - y1) ** 2);
  let py =
    y1 +
    ((y2 - y1) * ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1))) /
      ((x2 - x1) ** 2 + (y2 - y1) ** 2);

  // 计算曼哈顿距离
  return Math.abs(x - px) + Math.abs(y - py);
}

function perpendicularToStraight(line: string | any[]) {
  // Step 1: Convert perpendicular segments to straight lines
  const straightLine = [line[0]];
  for (let i = 0; i < line.length - 2; i++) {
    const point1 = line[i];
    const point2 = line[i + 1];
    const point3 = line[i + 2];

    if (
      isVertical(point1, point2, point3) ||
      isHorizontal(point1, point2, point3)
    ) {
      // Remove point2 to make it a straight line
      continue;
    }

    straightLine.push(point2);
  }
  straightLine.push(line[line.length - 1]);

  // Step 2: Douglas-Peucker algorithm to remove redundant points
  // return straightLine;
  const epsilon = 1.0; // Adjust epsilon based on your requirements
  return douglasPeucker(straightLine, epsilon);
}

function isVertical(p1: { x: any; }, p2: { x: any; }, p3: { x: any; }) {
  return p1.x === p2.x && p2.x === p3.x;
}

function isHorizontal(p1: { y: any; }, p2: { y: any; }, p3: { y: any; }) {
  return p1.y === p2.y && p2.y === p3.y;
}

function douglasPeucker(points: string | any[], epsilon: number) {
  let dmax = 0;
  let index = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(
      points[i],
      points[0],
      points[points.length - 1]
    );
    if (d > dmax) {
      index = i;
      dmax = d;
    }
  }

  if (dmax > epsilon) {
    const left: any[] = douglasPeucker(points.slice(0, index + 1), epsilon);
    const right: any[] = douglasPeucker(points.slice(index), epsilon);

    return left.slice(0, left.length - 1).concat(right);
  } else {
    return [points[0], points[points.length - 1]];
  }
}

// @ts-ignore
function addExtraPointsToStraightenLine(line: string | any[], maxDistance: number) {
  const newLine = [line[0]];

  for (let i = 0; i < line.length - 1; i++) {
    const currentPoint = line[i];
    const nextPoint = line[i + 1];

    newLine.push(currentPoint);

    const deltaX = nextPoint.x - currentPoint.x;
    const deltaY = nextPoint.y - currentPoint.y;
    const distance = Math.abs(deltaX) + Math.abs(deltaY);

    if (distance > maxDistance) {
      const numExtraPoints = Math.ceil(distance / maxDistance) - 1;
      const stepX = deltaX / (numExtraPoints + 1);
      const stepY = deltaY / (numExtraPoints + 1);

      for (let j = 0; j < numExtraPoints; j++) {
        const newX = currentPoint.x + stepX * (j + 1);
        const newY = currentPoint.y + stepY * (j + 1);
        newLine.push({ x: newX, y: newY });
      }
    }
  }

  newLine.push(line[line.length - 1]);

  return newLine;
}

// @ts-ignore
function getPointsByConstantFunction(points: any[]) {
  const xSet = new Set();
  const ySet = new Set();
  points.forEach((point: { x: any; y: any; }) => {
    const { x, y } = point;
    xSet.add(x);
    ySet.add(y);
  });
  const xArray = Array.from(xSet);
  const yArray = Array.from(ySet);
  const newPoints = [];
  for (const x of xArray) {
    for (const y of yArray) {
      newPoints.push({ x, y });
    }
  }
  return newPoints;
}

// @ts-ignore
function getPointsByConstantFunctionFromBBoxes(bboxes: any[]) {
  const ySet = new Set();
  const xSet = new Set();
  bboxes.forEach((bbox: { minX: any; minY: any; maxX: any; maxY: any; }) => {
    const { minX, minY, maxX, maxY } = bbox;
    const halfX = minX + (maxX - minX) / 2;
    const halfY = minY + (maxY - minY) / 2;
    ySet.add(halfY);
    xSet.add(halfX);
    xSet.add(minX);
    xSet.add(maxX);
    ySet.add(minY);
    ySet.add(maxY);
  });
  const yArray = Array.from(ySet);
  const xArray = Array.from(xSet);
  const points = [];
  for (const x of xArray) {
    for (const y of yArray) {
      points.push({ x, y });
    }
  }
  return points;
}

// 每三个点如果其横坐标或者纵坐标都相同，则取其二
function getSimplePath(path: string | any[]) {
  // if (path.length < 5) return path;
  path = circleDetection(path);
  const res = [];
  for (let i = 0; i < path.length; ) {
    const point1 = path[i];
    const point2 = path[i + 1];
    const point3 = path[i + 2];
    if (!point3) {
      res.push(point1);
      i++;
      continue;
    }
    if (
      (point1.x === point2.x && point2.x === point3.x) ||
      (point1.y === point2.y && point2.y === point3.y)
    ) {
      res.push(point1);
      res.push(point3);
      i += 3;
    } else {
      res.push(point1);
      i++;
    }
  }
  return res;
}

// 回环检测 & 处理
function circleDetection(path: string | any[]) {
  if (path.length < 6) return path;

  const res = [];
  for (let i = 0; i < path.length; ) {
    const point1 = path[i];
    const point2 = path[i + 1];
    const point4 = path[i + 3];
    const point5 = path[i + 4];
    if (!point5) {
      res.push(point1);
      i++;
      continue;
    }
    if (isSegmentsIntersected([point1, point2], [point4, point5])) {
      let x = 0;
      let y = 0;
      if (point1.x === point2.x) {
        x = point1.x;
        y = point4.y;
      } else {
        x = point4.x;
        y = point1.y;
      }
      res.push({ x, y });
      res.push(point5);
      i += 4;
      continue;
    }
    res.push(point1);
    i++;
  }
  return res;
}

function getOrient(start: { x: any; y: any; }, end: { x: any; y: any; }) {
  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;
  let prefix = "";
  let suffix = "";
  if (x1 >= x2) {
    prefix = "left";
  } else {
    prefix = "right";
  }
  if (y1 >= y2) {
    suffix = "top";
  } else {
    suffix = "bottom";
  }
  return `${prefix}:${suffix}`;
}

export function ManhattanLayout(
  startAnchor: any,
  endAnchor: any,
  startNode: { bbox: any; },
  endNode: { bbox: any; },
  // obstacles,
  offset: any
) {
  // get orient
  const orient = getOrient(startAnchor, endAnchor);
  // get expanded bbox
  const { bbox: startBBox } = startNode;
  const { bbox: endBBox } = endNode;
  const startExpandBBox = expandBBox(startNode.bbox, offset);
  const endExpandBBox = expandBBox(endNode.bbox, offset);
  // get points from bbox border
  const points1 = getPointsFromBBoxBorder(startExpandBBox);
  const points2 = getPointsFromBBoxBorder(endExpandBBox);
  // is bbox overlap
  // const overlap = isBBoxOverlap(startBBox, endBBox);
  const outsideBBox = getHull([...points1, ...points2]);

  const sNode: any = getAnchorWithOffset(startNode, startAnchor, offset);
  const eNode: any = getAnchorWithOffset(endNode, endAnchor, offset);

  const sNodeBase = new NodeBase(sNode.x, sNode.y);
  const eNodeBase = new NodeBase(eNode.x, eNode.y);

  const path = aStarFindPathByGrid(
    eNodeBase,
    sNodeBase,
    10,
    // obstacles,
    [startBBox, endBBox],
    // [startExpandBBox, endExpandBBox],
    outsideBBox
  );

  if (path) {
    const simplifyedPath = perpendicularToStraight(path);

    return getSimplePath([endAnchor, ...simplifyedPath, startAnchor].reverse());
    // return getSimplePath([startAnchor, ...simplifyedPath, endAnchor]);
  } else {
    const hull = getHull([sNode, eNode]);
    const pointss = [
      ...getPointsFromBBoxBorder(hull),
      {
        x: hull.minX + (hull.maxX - hull.minX) / 2,
        y: hull.minY + (hull.maxY - hull.minY) / 2,
      },
    ].map(({ x, y }) => {
      return new NodeBase(x, y);
    });
    const path = aStarFindPath(
      sNodeBase,
      eNodeBase,
      pointss,
      // obstacles,
      [],
      orient
    );
    return getSimplePath([startAnchor, ...path, endAnchor]);
    return [startAnchor, endAnchor];
  }
}
