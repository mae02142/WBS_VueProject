import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 여기에 라우트를 정의하십시오.
  // 예:
  // { path: '/', component: () => import('../views/Home.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
