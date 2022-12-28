import React from 'react'


import { x, y, width, height, style } from './FlowChartConfig'

const foldRectAttrs = {
  ...style,
  x: x-width/2,
  y: y-height/2,
  width: 4,
  height,
}
const transRectAttrs = {
  ...style,
  x: x - width/2 + 4,
  y: y - height/2,
  width: width -4,
  height,
  fill: 'transparent'
}

// 横泳道
const HorizontalLane = () => {
  return <svg className="svg-node">
    <g transform="translate(0.5,0.5)" style={{visibility: 'visible'}}>
      <rect {...foldRectAttrs}></rect>
      <rect {...transRectAttrs}></rect>
    </g>
  </svg>
}

export default HorizontalLane