# Background

> Provides methods that can modify the background of the canvas, including the background color or background image. The background layer is located at the bottom of the canvas.


When creating a canvas, set the background layer style of the canvas with the `background` option. The default value is `false` which means no background.

```js
const lf = new LogicFlow({
    background: false | BackgroundConfig
})

type BackgroundConfig = {
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;
  backgroundSize?: string;
  backgroundOpacity?: number;
  filter?: string; 
  [key: any]: any;
};

```
## Configuration items
### Set the background color

```js
const lf = new LogicFlow({
  // ...
  background: {
    backgroundImage: "url(../asserts/img/grid.svg)",
    backgroundRepeat: "repeat"
  }
})
 
```
## Example

<iframe src="https://codesandbox.io/embed/infallible-goldberg-mrwgz?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="infallible-goldberg-mrwgz"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>