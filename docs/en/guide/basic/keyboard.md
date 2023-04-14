# Keyboard Shortcuts

## Shortcut configuration

Shortcut keys can be enabled by passing the keyboard property of options when creating a `LogicFlow` instance.
When the enabled attribute is true, it means that the default shortcut key is enabled.

```ts
const lf = new LogicFlow({
  container: document.querySelector("#app"),
  keyboard: {
    enabled: true,
  },
});
```

## Built-in shortcut keys

Logicflow has built-in shortcuts for copy, paste, redo/undo, and delete.

| Shortcut Keys       | Function   |
| :------------------ | :--------- |
| cmd + c or ctrl + c | Copy node  |
| cmd + v or ctrl + v | Paste node |
| cmd + z or ctrl + z | Undo       |
| cmd + y or ctrl + y | Redo       |
| backspace           | Delete     |

## Customized shortcut keys

The shortcuts property allows the user to customize a set of shortcut keys
The rules for keys, consistent with [mousetrap](https://www.npmjs.com/package/mousetrap).

The following example is a custom delete function that adds a confirmation action before the delete.

```js
const lf = new LogicFlow({
  // ...
  keyboard: {
    enabled: true,
    shortcuts: [
      {
        keys: ["backspace"],
        callback: () => {
          const r = window.confirm("Sure you want to delete it?");
          if (r) {
            const elements = lf.getSelectElements(true);
            lf.clearSelectElements();
            elements.edges.forEach((edge) => lf.deleteEdge(edge.id));
            elements.nodes.forEach((node) => lf.deleteNode(node.id));
          }
        },
      },
    ],
  },
});
```

<a href="https://codesandbox.io/embed/logicflow-base10-eerft?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>
