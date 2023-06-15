export const valueCollectorMap = {
  option: {
    label: '默认选项',
    value: 'option',
    icon: 'el-icon-folder-opened'
  },
  input: {
    label: '手动输入',
    value: 'input',
    icon: 'el-icon-edit-outline'
  },
  component: {
    label: '页面组件值',
    value: 'component',
    icon: 'el-icon-cpu'
  },
  componentProp: {
    label: '页面组件属性值',
    value: 'componentProp',
    icon: 'el-icon-connection'
  },
  dataSource: {
    label: '数据节点返回值',
    value: 'dataSource',
    icon: 'el-icon-receiving'
  },
  dataConvert: {
    label: '转换节点返回值',
    value: 'dataConvert',
    icon: 'el-icon-s-operation'
  },
  urlParam: {
    label: '路由参数属性值',
    value: 'urlParam',
    icon: 'el-icon-link'
  },
  initParam: {
    label: '宿主系统变量属性值',
    value: 'initParam',
    icon: 'el-icon-attract'
  }
}

export const commonNodeMap = {
  dataSource: {
    label: '请求数据',
    value: 'dataSource',
    logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_load.png'
  },
  pageJump: {
    label: '页面跳转',
    value: 'pageJump',
    logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_jump.png'
  },
  dataConvert: {
    label: '数据转换',
    value: 'dataConvert',
    logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/data_trans.png'
  },
}

export const eventNodeMap = {
  pageInit: {
    label: '页面初始化',
    value: 'pageInit',
    logo: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/page_init.png'
  }
}

export const toolMap = {
  undo: {
    name: 'undo',
    desc: '返回上一步',
    icon: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/tool_previous.png'
  },
  redo: {
    name: 'redo',
    desc: '恢复下一步',
    icon: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/tool_next.png'
  },
  zoomIn: {
    name: 'zoomIn',
    desc: '画布放大',
    icon: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/tool_zoom_in.png'
  },
  zoomOut: {
    name: 'zoomOut',
    desc: '画布缩小',
    icon: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/tool_zoom_out.png'
  },
  fitView: {
    name: 'fitView',
    desc: '区域适应',
    icon: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/tool_fullscreen.png'
  },
  selection: {
    name: 'selection',
    desc: '框选节点',
    icon: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/tool_selection.png'
  },
  beautify: {
    name: 'beautify',
    desc: '美化布局',
    icon: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/tool_beautify.png'
  },
  navigation: {
    name: 'navigation',
    desc: '全图导航',
    icon: 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/tool_location.png'
  }
}

export const defaultLogo = 'https://s3-gzpu.didistatic.com/tiyan-base-store/form-editor/pc/icon_anniu@2x.png'

export const requestMethodMap = [
  {
    value: 'GET',
    label: 'GET'
  },
  {
    value: 'POST',
    label: 'POST'
  }
]
