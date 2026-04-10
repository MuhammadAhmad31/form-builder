import { createRouter, createWebHistory } from "vue-router";

import FormBuilderPage from "@/pages/FormBuilderPage.vue";
import FormRendererPage from "@/pages/FormRendererPage.vue";
import HomePage from "@/pages/HomePage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/builder",
      name: "form-builder",
      component: FormBuilderPage,
    },
    {
      path: "/renderer",
      name: "form-renderer",
      component: FormRendererPage,
    },
  ],
});

export default router;
