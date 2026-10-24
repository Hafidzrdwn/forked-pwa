import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import OverviewView from '../components/views/OverviewView.vue'
import DecisionStudioView from '../components/views/DecisionStudioView.vue'
import JournalView from '../components/views/JournalView.vue'
import PrivacyPolicyView from '../components/views/PrivacyPolicyView.vue'
import TermsOfUseView from '../components/views/TermsOfUseView.vue'
import NotFoundView from '../components/views/NotFoundView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'overview',
    component: OverviewView
  },
  {
    path: '/overview',
    redirect: '/'
  },
  {
    path: '/decisions',
    name: 'decisions',
    component: DecisionStudioView
  },
  {
    path: '/decisions/:id',
    name: 'decision-detail',
    component: DecisionStudioView
  },
  {
    path: '/studio',
    redirect: '/decisions'
  },
  {
    path: '/studio/:id',
    redirect: to => ({ path: `/decisions/${to.params.id}` })
  },
  {
    path: '/journal',
    name: 'journal',
    component: JournalView
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyPolicyView
  },
  {
    path: '/terms',
    name: 'terms',
    component: TermsOfUseView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, left: 0 }
  }
})

export default router
