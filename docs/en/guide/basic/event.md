# Event

When we use the mouse or otherwise interact with the canvas, some events will be triggered. By listening to these events, you can get the data generated when they are triggered, and then implement the required functions based on this data. For details of listenable events see [eventCenter API](en/api/eventCenterApi)

## Event listener

The `on` method is provided on the `lf` instance to support listening to events.

```js
lf.on("node:dnd-add", (data) => {});
```

LogicFlow supports splitting event names with commas.

```js
lf.on("node:click,edge:click", (data) => {});
```

## custom event

In addition to the listening events supported on lf, you can also use the [eventCenter](en/api/graphModelApi#eventcenter) object to listen for and trigger events. `eventCenter` is a property on `graphModel`. So when customizing a node, we can use `eventCenter` to trigger custom events.

```js
class ButtonNode extends HtmlNode {
  setHtml(rootEl) {
    const { properties } = this.props.model;

    const el = document.createElement("div");
    el.className = "uml-wrapper";
    const html = `
      <div>
        <div class="uml-head">Head</div>
        <div class="uml-body">
          <div><button onclick="setData()">+</button> ${properties.name}</div>
          <div>${properties.body}</div>
        </div>
        <div class="uml-footer">
          <div>setHead(Head $head)</div>
          <div>setBody(Body $body)</div>
        </div>
      </div>
    `;
    el.innerHTML = html;
    rootEl.innerHTML = "";
    rootEl.appendChild(el);
    window.setData = () => {
      const { graphModel, model } = this.props;
      graphModel.eventCenter.emit("custom:button-click", model);
    };
  }
}
```

## Example

<a href="https://codesandbox.io/embed/logicflow-step7-dpmgb?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>
