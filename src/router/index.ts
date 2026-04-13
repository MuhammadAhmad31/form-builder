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
      component: () => import("@/pages/FormBuilderPage.vue"),
    },
    {
      path: "/renderer",
      name: "form-renderer",
      component: () => import("@/pages/FormRendererPage.vue"),
    },
    {
      path: "/codeparl",
      name: "codeparl-form",
      component: () => import("@/pages/CodeparlFormBuilder.vue"),
    },
    {
      path: "/codeparl/render",
      name: "codeparl-form-renderer",
      component: () => import("@/pages/CodeparlFormRendererPage.vue"),
    },
    {
      path: "/form-builder-simple",
      name: "form-builder-simple",
      component: () => import("@/components/organism/form-non-canvas/FormBuilder.vue"),
    },
  ],
});

export default router;
