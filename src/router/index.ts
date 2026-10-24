import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import OverviewView from '../components/views/OverviewView.vue'
import DecisionStudioView from '../components/views/DecisionStudioView.vue'
import JournalView from '../components/views/JournalView.vue'
import PrivacyPolicyView from '../components/views/PrivacyPolicyView.vue'
import TermsOfUseView from '../components/views/TermsOfUseView.vue'
import NotFoundView from '../components/views/NotFoundView.vue'
import { useI18n } from '../i18n'

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

router.afterEach((to) => {
  const { t, locale } = useI18n()
  const titles = t.value.pageTitles
  const name = String(to.name || 'overview')
  if (titles) {
    let title = titles.overview
    let desc = titles.overviewDesc
    if (name === 'decisions' || name === 'decision-detail') {
      title = titles.decisions
      desc = titles.decisionsDesc
    } else if (name === 'journal') {
      title = titles.journal
      desc = titles.journalDesc
    } else if (name === 'privacy') {
      title = titles.privacy
      desc = titles.privacyDesc
    } else if (name === 'terms') {
      title = titles.terms
      desc = titles.termsDesc
    } else if (name === 'not-found') {
      title = titles.notFound
      desc = titles.notFoundDesc
    }

    document.title = title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', desc)
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', title)
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', desc)
    const twTitle = document.querySelector('meta[name="twitter:title"]')
    if (twTitle) twTitle.setAttribute('content', title)
    const twDesc = document.querySelector('meta[name="twitter:description"]')
    if (twDesc) twDesc.setAttribute('content', desc)

    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = locale.value
    }
  }
})

export default router
