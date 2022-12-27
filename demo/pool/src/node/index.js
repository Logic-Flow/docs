
import PoolNode from './Pool'
import LaneNode from './Lane'

export const registerCustomElement = (lf) => {
  lf.register(PoolNode)
  lf.register(LaneNode)
}

