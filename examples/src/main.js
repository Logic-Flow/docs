import { createApp } from 'vue';
import router from './router';
import './static/playground-elements';

import './style.css';
import App from './App.vue';

createApp(App).use(router).mount('#app');
