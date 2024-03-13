<!--  -->
<template>
  <nav class="app-nav">
    <ul>
      <li><a href="/docs/#/zh/guide/start" target="_blank" rel="noopener" title="Guide">教程<i class="fa fa-external-link navbar-icon"></i></a></li>
      <li><font size="4">API <i class="fa fa-caret-down navbar-icon"></i></font>
      <ul>
        <li>
          <a href="/docs/#/zh/api/logicFlowApi" target="_blank" rel="noopener" title="LogicFlow instance">LogicFlow实例</a>
        </li>
        <li>
          <a href="/docs/#/zh/api/graphModelApi" target="_blank" rel="noopener" title="graphModel">graphModel</a>
        </li>
        <li><a href="/docs/#/zh/api/nodeModelApi" target="_blank" rel="noopener" title="nodeModel">nodeModel</a></li>
        <li><a href="/docs/#/zh/api/edgeModelApi" target="_blank" rel="noopener" title="edgeModel">edgeModel</a></li>
        <li><a href="/docs/#/zh/api/eventCenterApi" target="_blank" rel="noopener" title="eventCenter">事件</a></li>
        <li><a href="/docs/#/zh/api/transformModelApi" target="_blank" rel="noopener" title="transformModel">transformModel</a></li>
        <li><a href="/docs/#/zh/api/editConfigModelApi" target="_blank" rel="noopener" title="editConfigModel">editConfigModel</a></li>
        <li><a href="/docs/#/zh/api/themeApi" target="_blank" rel="noopener" title="Theme">主题</a></li>
      </ul>
      </li>
      <li>
        <a class="active" href="https://site.logic-flow.cn/examples/" target="_blank" rel="noopener" title="Examples ">示例</a>
      </li>
      <li>
        <font>版本记录 <i class="fa fa-caret-down navbar-icon"></i></font>
        <ul>
          <li><a href="/docs/#/zh/release/1.2" target="_blank" rel="noopener" title="v1.2.x">v1.2.x</a></li>
          <li><a href="/docs/#/zh/release/1.1" target="_blank" rel="noopener" title="v1.1.x">v1.1.x</a></li>
          <li><a href="/docs/#/zh/release/1.0" target="_blank" rel="noopener" title="v1.0.x">v1.0.x</a></li>
          <li><a href="https://07.logic-flow.cn/" target="_blank" rel="noopener" title="v0.7.x ">v0.7.x <i class="fa fa-external-link navbar-icon"></i></a></li>
        </ul>
      </li>
      <li><a href="/docs/#/zh/article/article01" title="Article">文章 <i class="fa fa-external-link navbar-icon"></i></a></li>
      <li><a href="https://gitee.com/logic-flow/LogicFlow" target="_blank" rel="noopener" title="Gitee ">Gitee <i class="fa fa-external-link navbar-icon"></i></a></li>
      <li>
        <a href="https://github.com/didi/LogicFlow" target="_blank" rel="noopener" title=" Github "><i class="fa fa-github fa-lg"></i> Github <i class="fa fa-external-link navbar-icon"></i></a>
      </li>
    </ul>
  </nav>
</template>

<script setup>

</script>
<style lang="scss" scoped>
.app-nav {
  position: absolute;
  top: 0;
  left: 0;
  position: absolute;
  right: 0;
  text-align: right;
  z-index: 10;
  background: #FFF;
  border-bottom: 1px solid #f6f6f6;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.12);
  // height: 60px;
  padding: 12px;
  ul, li {
    display: inline-block;
    list-style: none;
    margin: 0;
  }
  li {
    display: inline-block;
    margin: 0 1rem;
    padding: 5px 0;
    position: relative;
    cursor: pointer;
    color: rgb(52,73,94);
  }
  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s;
  }
  a.active {
    border-bottom: 2px solid #0074d9;
    border-bottom: 2px solid var(--theme-color, #0074d9);
    color: #0074d9;
    color: var(--theme-color, #0074d9);
    font-size: 16px;
    text-decoration: none;
    transition: color 0.3s;
  }
  li ul {
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-color: #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    display: none;
    max-height: calc(100vh - 61px);
    overflow-y: auto;
    padding: 10px 0;
    position: absolute;
    right: -15px;
    text-align: left;
    top: 100%;
    white-space: nowrap;
    li {
      display: block;
      font-size: 14px;
      line-height: 1rem;
      margin: 0;
      margin: 8px 14px;
      white-space: nowrap;
    }
  }
  .navbar-icon {
    color: #aaa;
    margin-left: 5px;
    font-size: 14px !important;
  }
  li:hover ul {
    display: block;
  }
}
</style>
