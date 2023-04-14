# CustomPlugin

LogicFlow provides many generic plug-ins that may not always match your business needs. You can customize plug-ins based on your own business scenarios.

## The basic format of the plug-in

```js
class PluginCls {
  static pluginName = 'pluginName',
  constructor({ lf, LogicFlow }) {
    // do anything
  }
  render(lf, toolOverlay) {
    // do anything
  }
  destroy() {
    // do anythine
  }
}
```

- A plugin is a class.
- This class has a static property `pluginName` to identify the name of the plugin. Plugins with the same name are overwritten when the `lf` instance is initialized. You can obtain an instance of the plugin class through `lf.extension.[your plugin name]`.
- When initializing the `lf` instance, the plugin instance is initialized at the same time. And the parameters `lf` and `LogicFlow` will be passed in when initializing the plugin instance.
- The `render` method (if any) of the plugin instance will be called after `lf` rendering is complete. The second parameter, domOverlay, represents the node of the `LogicFlow` Dom layer. Plugin developers can insert html content directly into this node.
- `destroy` is the method called when the plugin is destroyed. It can be left out in most cases.

## Implementing the context-pad plugin

The following implements a `context-pad` example to show you how to define a plugin that fits your business. The `context-pad` plugin is used to bring up an optional shortcut menu next to the node after the user left-clicks on it.

### Adding plug-in method

LogicFlow will mount the instance of plugin to `lf.extension` so that our methods in `class` can be called with `lf.extension.[plugin name].[plugin method]`.

```js
class ContextPad {
  /**
   * Set general menu options
   */
  setContextMenuItems(items) {
    this.commonMenuItems = items;
  }
}

ContextPad.pluginName = "contextPad";

// Calling Methods

lf.extension.contextPad.setContextMenuItems([
  {
    icon: "...",
    callback: () => {},
  },
]);
```

### Listening for events when the node is clicked

When the plugin is initialized, `lf` is passed as a parameter to the plugin, which can then be used to listen for events that occur on the canvas.

```js
class ContextPad {
  constructor({ lf }) {
    lf.on("node:click", (data) => {
      this.showContextPad(data);
    });
  }
  showContextPad() {
    // ...
  }
}
```

### Display HTML content at the specified position on the canvas

The render function of the plugin has two arguments, one is `lf` and the second is `toolOverlay`, which is the component layer. the canvas of LogicFlow is composed of multiple layers, while the component layer is dedicated to rendering custom components.

**Layering of LogicFlow's graphs**

<img src="en/assets/images/overlay.png" width="200">

So here we just need to insert the menu into `toolOverlay`, and then move the menu to the right place.

```js
class ContextPad {
  render(lf, toolOverlay) {
    this.toolOverlay = toolOverlay;
  }
  createMenu() {
    this.__menuDOM = document.createElement("div");
  }
  // Calculate where the menu should be displayed (top right corner of the node)
  getContextMenuPosition() {
    const data = this._activeData;
    const Model = this.lf.graphModel.getElement(data.id);
    let x;
    let y;
    if (Model.BaseType === "node") {
      x = data.x + Model.width / 2;
      y = data.y - Model.height / 2;
    }
    return this.lf.graphModel.transformModel.CanvasPointToHtmlPoint([x, y]);
  }
  showMenu() {
    const [x, y] = this.getContextMenuPosition();
    this.__menuDOM.style.display = "flex";
    // Display the menu to the corresponding position
    this.__menuDOM.style.top = `${y}px`;
    this.__menuDOM.style.left = `${x + 10}px`;
    this.toolOverlay.appendChild(this.__menuDOM);
  }
}
```

## Full Example

<a href="https://codesandbox.io/embed/logicflow-base22-rl301?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>
