import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Index",
    redirect: "/gallery",
    children: [
      {
        path: "/gallery",
        name: "Gallery",
        component: () => import("../views/Gallery/index.vue"),
      },
      {
        path: "/playground",
        name: "Playground",
        component: () => import("../views/Playground/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
