import { createApp, h } from 'vue';
import Panels from './index.vue';

function mountPanel(lf: any) {
  let panel = createApp(
    h(Panels, {
      lf,
    }),
  );
  const div = document.createElement('div');
  div.id = 'my-panel';
  document.querySelector('#graph')?.appendChild(div);
  panel.mount('#my-panel');
}

export default mountPanel;
