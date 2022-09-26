import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: 'examples/gallery',
    children: [
      {
        path: '/examples/gallery',
        name: 'Gallery',
        component: () => import('../views/Gallery/index.vue'),
      },
      {
        path: '/examples/playground',
        name: 'Playground',
        component: () => import('../views/Playground/index.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
