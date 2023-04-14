# Theme

LogicFlow provides a method to set the theme, which facilitates users to set the style of all internal elements in a uniform way.
There are two ways of setting:

- Passed in as configuration when initializing `LogicFlow`
- After initialization, call the setTheme method of `LogicFlow`

The parameters for theme configuration are described in [Theme API](en/api/themeApi)

## Configuration

When calling new LogicFlow, use the theme configuration as a parameter to initialize Logicflow.

```ts
// Method 1: Pass in as configuration when calling new LogicFlow
const config = {
  domId: 'app',
  width: 1000,
  height: 800,
  style: { // Set default theme style
    rect: { // Rectangle style
      ...
    },
    circle: { // Circular style
      ...
    },
    nodeText: { // Node text style
      ...
    },
    edgeText: { // Edge text style
      ...
    },
    anchor: { // Anchor style
      ...
    }
    ...
  }
}
const lf = new LogicFlow(config);
```

## setTheme

Call LogicFlow's setTheme method, `lf.setTheme`, to configure the theme.

```ts
// Method 2: Call LogicFlow's setTheme method
lf.setTheme({ // Set default theme style
  rect: { // Rectangle style
    ...
  },
  circle: { // Circular style
    ...
  },
  nodeText: { // Node text style
    ...
  },
  edgeText: { // Edge text style
    ...
  },
  anchor: { // Anchor style
    ...
  }
  ...
})
```

<a href="https://codesandbox.io/embed/logicflow-step6-err2o?fontsize=14&hidenavigation=1&theme=dark&view=preview" target="_blank"> Demo in CodeSandBox</a>
