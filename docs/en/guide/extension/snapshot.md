# Snapshot

## Exporting images

### Getting started

**Step 1**: Register plugin

```ts
import LogicFlow from "@logicflow/core";
import { Snapshot } from "@logicflow/extension";

LogicFlow.use(Snapshot);
```

**Step 2**:
By registering the plugin to `LogicFlow` in the first step, an additiona method lf.getSnapshot is added to the `LogicFlow` instance.

```ts
const lf = new LogicFlow({
  container: document.querySelector("#graph"),
  width: 700,
  height: 600,
});
// You can use any method to trigger and then download the drawn graph to the local disk
document.getElementById("download").addEventListener("click", () => {
  lf.getSnapshot();
  // Or v1.1.13
  // lf.extension.snapshot.getSnapshot()
});
```

Tip: Images downloaded through this plugin will not be affected by offsetting or scaling.

## Exporting xml

Added in v1.0.7

LogicFlow generates data in json format by default, there may be some process engines that require xml format data from the front-end. `@logicflow/extension` provides two plugins `lfJson2Xml` and `lfXml2Json` for converting json and xml to each other.

```ts
import LogicFlow from "@logicflow/core";
import { lfJson2Xml, lfXml2Json } from "@logicflow/extension";

const lf = new LogicFlow({
  // ...
});
const data = lfJson2Xml(jsonData);
lf.render(data);
const xml = lfJson2Xml(lf.getGraphData());
```

### Customizing css

To keep the generated images consistent with the flowchart, the `snapshot` plugin will clone all the css rules of the current page to canvas by default, but it may cause errors due to cross-domain CSS files, see issue[575](https://github.com/didi/LogicFlow/issues /575). You can modify `useGlobalRules` to disable loading of all css rules and then customize the css properties with `customCssRules`.

```js
lf.extension.snapshot.useGlobalRules = false;
lf.extension.snapshot.customCssRules = `
    .lf-node-text-auto-wrap-content{
      line-height: 1.2;
      background: transparent;
      text-align: center;
      word-break: break-all;
      width: 100%;
    }
    .lf-canvas-overlay {
      background: red;
    }
  `;
```

### Example

<a href="https://codesandbox.io/embed/logicflow-base21-o3vqi?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>
