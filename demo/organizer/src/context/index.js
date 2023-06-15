import History from './history';
import { EventEmitter } from './EventEmitter';

export default class Context {
  constructor(options) {
    this.eventCenter = new EventEmitter();
    this.history = new History(); // 操作记录

    this.logicList = options.logicList;
  }
}