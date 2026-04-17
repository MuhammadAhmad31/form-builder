import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/pages/HomePage.vue"),
    },
    {
      path: "/builder",
      name: "form-builder",
      component: () => import("@/pages/v2/FormBuilderPage.vue"),
    },
    {
      path: "/renderer",
      name: "form-renderer",
      component: () => import("@/pages/v2/FormRendererPage.vue"),
    },
    {
      path: "/form-builder-simple",
      name: "form-builder-simple",
      component: () => import("@/pages/finance/FormBuilderPage.vue"),
    },
    {
      path: "/form-renderer-simple",
      name: "form-renderer-simple",
      component: () => import("@/pages/finance/FormRendererPage.vue"),
    },
  ],
});

export default router;
