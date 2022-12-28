import React from 'react'
import Pool from './icon/nodes/Pool'



const DiagramSidebar = (props:any) => {
  const {dragInNode} = props

  return <div key="flow" className="diagram-sidebar">
          <div className="node-category">
            {/* 横泳道 */}
            <div>拖动图标到画布以添加新的泳道</div>
            <div className="node-item" onMouseDown={() => dragInNode('pool')}>
              <Pool></Pool>
            </div>
          </div>
      </div>
}

export default DiagramSidebar