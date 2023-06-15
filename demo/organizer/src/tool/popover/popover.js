import { cloneDeep } from "lodash-es";
import { getUniqueId } from '../../util';
import "./popover.less";

export default class Popover {
  constructor({ lf }) {
    lf.graphModel.popover = this;
    this.popoverTypeMap = new Map(); // 维护页面有多少种popover
    this.floatingMap = new Map(); // 维护当前正在显示有多少个popover
    this.waitingCollection = new Map(); // 待显示的组件集合
    this.renderedCollection = new Map(); // 已显示组件集合
    this.removeFloatingHandler = this.removeFloating.bind(this);
  }
  /**
   * 注册弹框组件
   * @param {string} type type类型，用于show的时候选择触发类型
   * @param { popoverItem } popoverItem 注册组件类型
   * popoverItem.element 渲染的DOM节点
   * popoverItem.render 渲染的方法，可以不传
   */
  registerPopover(type, popoverItem) {
    this.popoverTypeMap.set(type, popoverItem);
  }
  render(lf, container) {
    this.lf = lf;
    this.lfContainer = container;
    this.container = document.querySelector("body");
  }
  createFloating(x, y, popoverItem) {
    const floating = document.createElement("div");
    floating.className = `lf-popover-floating ${popoverItem.placement}`;
    floating.style.left = x + "px";
    floating.style.top = y + "px";
    const inner = document.createElement("div");
    floating.appendChild(inner);
    const arrow = document.createElement("div");
    arrow.className = `lf-popover-arrow ${popoverItem.placement}`;
    floating.appendChild(arrow);
    this.container.appendChild(floating);
    if (popoverItem.trigger === "click") {
      document.body.addEventListener("mousedown", this.removeFloatingHandler);
      floating.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });
    } else {
      floating.addEventListener("mouseenter", () => {
        this.renderedCollection.set(
          popoverItem.__id + "__popover",
          popoverItem
        );
      });
      floating.addEventListener("mouseleave", () => {
        this.renderedCollection.delete(popoverItem.__id + "__popover");
        this.destroyPopover(popoverItem.__id);
      });
    }
    this.floatingMap.set(popoverItem.__id, floating);
    return inner;
  }
  removeFloating() {
    document.body.removeEventListener("mousedown", this.removeFloatingHandler);
    this.renderedCollection.forEach((item) => {
      if (item.trigger === "click") {
        this.destroyPopover(item.__id);
      }
    });
  }
  renderPopover(popoverItem) {
    const showPosition = this.getShowPosition(popoverItem);
    const [x, y] =
      this.lf.graphModel.transformModel.CanvasPointToHtmlPoint(showPosition);
    const rect = this.lfContainer.getBoundingClientRect();
    const startX = rect.x,
      startY = rect.y;
    const posX = startX + x,
      posY = startY + y;
    const rootEl = this.createFloating(posX, posY, popoverItem);
    const item = this.popoverTypeMap.get(popoverItem.type);
    if (!item) {
      throw new Error("未找到需要弹框的内容");
    }
    if (item.render) {
      item.render(rootEl, popoverItem);
    } else if (item.element) {
      rootEl.appendChild(element);
    }
    const floating = this.floatingMap.get(popoverItem.__id);
    const floatingRect = floating.getBoundingClientRect();
    if (floatingRect.top < 0) {
      floating.className = `lf-popover-floating bottom`;
      const arrow = floating.querySelector(".lf-popover-arrow");
      arrow && (arrow.className = `lf-popover-arrow bottom`);
    }
    this.renderedCollection.set(popoverItem.__id, popoverItem);
  }
  destroyPopover(__id) {
    this.renderedCollection.delete(__id);
    if (!this.renderedCollection.has(__id + "__popover")) {
      const floating = this.floatingMap.get(__id);
      floating && this.container.removeChild(floating);
      this.renderedCollection.delete(__id + "__popover");
      this.floatingMap.delete(__id);
    }
  }
  /**
   * config = {
   *   x: number,
   *   y: number,
   *   width: number,
   *   height: number,
   *   key: '', // 传递key后，可以识别相同组件的重复触发，在click模式下，再次点击等于隐藏。
   *   placement: 'right',
   *   type: 'tip1', // 不同类型的popover
   *   delay: 100, // 延迟显示时间
   *   trigger: 'click'
   * }
   */
  show(config) {
    this.config = config
    const popoverItem = cloneDeep(config)
    const uid = getUniqueId()
    if (config.trigger === 'click' && config.key) {
      popoverItem.__id = config.key
    } else {
      popoverItem.__id = uid
    }
    this.waitingCollection.set(popoverItem.__id, popoverItem)
    setTimeout(() => {
      if (this.renderedCollection.has(popoverItem.__id)) {
        this.removeFloating()
      } else {
        const item = this.waitingCollection.get(popoverItem.__id)
        this.waitingCollection.delete(popoverItem.__id)
        item && this.renderPopover(item)
      }
    }, config.delay || 0)
    return popoverItem.__id
  }
  getShowPosition(config) {
    switch (config.placement) {
      case "right":
        return [config.x + config.width / 2 + 5, config.y];
      case "bottom":
        return [config.x, config.y + config.height / 2 + 5];
      case "top":
        return [config.x, config.y - config.height / 2 - 5];
      case "left":
        return [config.x - config.width / 2 + 5, config.y];
      default:
        return [config.x + config.width / 2 + 5, config.y];
    }
  }
  /**
   * popover消失时间50ms的延迟
   */
  hide(__id) {
    this.waitingCollection.delete(__id);
    setTimeout(() => {
      this.destroyPopover(__id);
    }, 50);
  }
}

Popover.pluginName = "popover";
