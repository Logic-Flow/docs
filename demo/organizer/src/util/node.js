/**
 * 根据组件model生成节点名
 */
export const getNodeName = ( model ) => {
  return model.getModelName() || model.name || model.componentName
}

/**
 * 聚焦至该节点
 */
export const focusNode = function (graphModel, id, deltaX) {
  graphModel.selectElementById(id)
  const model = graphModel.getElement(id)
  const rect = graphModel.rootEl.getBoundingClientRect()
  const dx = deltaX || 0
  graphModel.transformModel.focusOn(model.x + dx, model.y, Number(rect.width), Number(rect.height))
}