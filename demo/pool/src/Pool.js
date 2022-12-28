import React, {useState, useRef, useEffect} from 'react'
import DiagramSidebar from './DiagramSidebar'
import LogicFlow from '@logicflow/core'
import { Group } from '@logicflow/extension'
import { registerCustomElement } from './node'
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import './Pool.less'


const PoolDemo = () => {
  const [lf, setLf] = useState()
  const currentLf = useRef()
  const defaultStyleRef = useRef({
  })

  const dragInNode = (type) => {
    lf?.dnd.startDrag({type})
  }

  const deleteConfirm = (data) => {
    const {type, id, children = []} = data
    if (type === 'lane') {
      // 通知上层泳池节点， 重新分配空间
      const groupId = currentLf.current?.extension.group.nodeGroupMap.get(id)
      if(groupId) {
        const group = currentLf.current?.getNodeModelById(groupId)
        // group?.removeChild(id)
        // group?.resize()
        group?.deleteChild(id)
        return false
      }
    }
    if (type === 'pool') {
      // 删除全部child
      children.forEach ((childId) => {
        currentLf.current?.deleteNode(childId)
      })
    }
    return true
  }

  const initLogicFlow = () => {
    // 引入框选插件
    LogicFlow.use(Group)
    const newLf = new LogicFlow({
      container: document.querySelector('.lf-diagram'),
      overlapMode: 1,
      autoWrap: true,
      metaKeyMultipleSelected: true,
      stopZoomGraph: true,
      stopMoveGraph: true,
      keyboard: {
        enabled: true
      },
      grid: {
        visible: false,
        size: 1
      },
      background: {
        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QwZDBkMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")',
        backgroundRepeat: 'repeat'
      },
      guards: {
        beforeDelete: data => deleteConfirm(data),
      },
    })
    newLf.setTheme(
      {
        baseEdge: { strokeWidth: 1 },
        baseNode: { strokeWidth: 1 },
        nodeText: { overflowMode: 'autoWrap', lineHeight: 1.5 },
        edgeText: { overflowMode: 'autoWrap', lineHeight: 1.5 }
      }
    )
    // 注册自定义元素
    registerCustomElement(newLf)
    newLf.setDefaultEdgeType('pro-polyline')
    newLf.render({
      "nodes":[
          {
              "id":"d85739ef-e601-4752-8492-ff09b5fafa4a",
              "type":"pool",
              "x":285,
              "y":200,
              "properties":{
              },
              "zIndex":1,
              "text":{
                  "x":46,
                  "y":340,
                  "value":"泳池示例"
              },
              "children":[
                  "75e3e4b0-c9b9-47bd-99d2-4d77dfeed08f"
              ]
          },
          {
              "id":"75e3e4b0-c9b9-47bd-99d2-4d77dfeed08f",
              "type":"lane",
              "x":300,
              "y":200,
              "properties":{
                  "nodeSize":{
                      "width":470,
                      "height":260
                  }
              },
              "zIndex":1,
              "children":[
  
              ]
          }
      ],
      "edges":[
  
      ]
  });
    newLf.on('node:dnd-add, edge:add', ({data}) => {
      newLf.setProperties(data.id, defaultStyleRef.current || {})
      const {x,y,type, id} = data
      if (type === 'pool') {
        const poolModel = newLf.getNodeModelById(id)
        const {width, height} = poolModel
        const {id:laneId} = newLf.addNode({
          type: 'lane',
          properties: {
            nodeSize: {
              width: width - 30,
              height: height
            }
          },
          x: x + 15,
          y,
        })
        poolModel.addChild(laneId)
      }
    })
    newLf.on('node:resize', ({oldNodeSize, newNodeSize}) => {
      const {id, type} = oldNodeSize
      const deltaHeight = newNodeSize.height - oldNodeSize.height
      // const resizeDir = newNodeSize.y - oldNodeSize.y > 0 ? 'below': 'above'
      // 节点高度变高，y下移， 方向为below
      // 节点高度变高， y上移， 方向为above
      // 节点高度变小， y下移， 方向为above
      // 节点高度变小， y上移，方向为below
      let resizeDir = 'below'
      if (deltaHeight > 0 && (newNodeSize.y - oldNodeSize.y) < 0) {
        resizeDir = 'above'
      } else if (deltaHeight < 0 && (newNodeSize.y - oldNodeSize.y) > 0){
        resizeDir = 'above'
      }
      if (type === 'pool') {
        // 泳池缩放，泳道一起调整
        newLf.getNodeModelById(id).resizeChildren({resizeDir, deltaHeight})
      } else if (type === 'lane') {
        // 泳道缩放， 调整泳池
        const groupId = newLf.extension.group.nodeGroupMap.get(id)
        if(groupId) {
          newLf.getNodeModelById(groupId).resize(id, newNodeSize)
        }
      }

    })
    newLf.keyboard.on('cmd + a',selectAll)
    newLf.keyboard.on('ctrl + a', selectAll)
    setLf(newLf)
    currentLf.current = newLf
    window.lf = newLf
  }

  const selectAll = () => {
    const {nodes=[], edges = []} = currentLf.current?.getGraphData()
    nodes.forEach((node: any) => {
      const {id} = node
      if (id) {
        currentLf.current?.selectElementById(id)
      }
    })
    edges.forEach((edge) => {
      const {id} = edge
      if (id) {
        currentLf.current?.selectElementById(id)
      }
    })
    return false
  }

  useEffect(() => {
    initLogicFlow()
    /*eslint-disable-next-line */
  },[])

  return <div className="lf-diagram-page">
    <div className="diagram-main">
      <DiagramSidebar dragInNode={dragInNode}></DiagramSidebar>
      <div className="diagram-container">
        <div className="diagram-wrapper">
          <div className="lf-diagram"></div>
        </div>
      </div>
    </div>
  </div>
}

export default PoolDemo