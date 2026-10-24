<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDecisions } from './composables/useDecisions'
import { useConfirm } from './composables/useConfirm'
import { useI18n } from './i18n'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppTopbar from './components/layout/AppTopbar.vue'
import OverviewView from './components/views/OverviewView.vue'
import DecisionStudioView from './components/views/DecisionStudioView.vue'
import JournalView from './components/views/JournalView.vue'
import PrivacyPolicyView from './components/views/PrivacyPolicyView.vue'
import TermsOfUseView from './components/views/TermsOfUseView.vue'
import NotFoundView from './components/views/NotFoundView.vue'
import CreateDecisionModal from './components/modals/CreateDecisionModal.vue'
import EditDecisionModal from './components/modals/EditDecisionModal.vue'
import WeightsModal from './components/modals/WeightsModal.vue'
import JournalModal from './components/modals/JournalModal.vue'
import ShareStoryModal from './components/modals/ShareStoryModal.vue'
import ConfirmModal from './components/common/ConfirmModal.vue'
import ToastContainer from './components/common/ToastContainer.vue'
import PwaInstallBanner from './components/common/PwaInstallBanner.vue'
import UnsupportedBrowserNotice from './components/common/UnsupportedBrowserNotice.vue'
import type { NavigationTab } from './types'

const route = useRoute()
const router = useRouter()

const {
  decisions, activeId, searchTerm, busy, notice, activeDecision, filteredDecisions,
  totalDecisions, openDecisions, reviewedDecisions, nextReview,
  load, loadSampleTemplates, createDecision, updateDecisionDetails, duplicateDecision,
  deleteActiveDecision, deleteMultipleDecisions, addScenarioToActive, removeScenarioFromActive,
  chooseScenario, updateScenario, addAssumptionToScenario, toggleAssumption, removeAssumption,
  saveJournal, updateDecisionWeights, updateReviewDate, exportBackup, copyBackupToClipboard, importBackupFile
} = useDecisions()

const { confirm: confirmDialog } = useConfirm()
const { t, locale, interpolate } = useI18n()

const showCreate = ref(false)
const showEdit = ref(false)
const showWeights = ref(false)
const showJournal = ref(false)
const showShare = ref(false)
const mobileMenuOpen = ref(false)

const currentNav = computed<NavigationTab>(() => {
  const name = String(route.name || '')
  if (name === 'decisions' || name === 'decision-detail') return 'decisions'
  if (name === 'journal') return 'journal'
  if (name === 'privacy') return 'privacy'
  if (name === 'terms') return 'terms'
  if (name === 'not-found') return 'not-found'
  return 'overview'
})

function updatePageMetadata() {
  const name = String(route.name || 'overview')
  const titles = t.value.pageTitles
  if (!titles) return

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

watch([() => route.name, () => route.params.id, locale], () => {
  updatePageMetadata()
}, { immediate: true })

function onPageBeforeEnter() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

onMounted(async () => {
  await load()
  // Sync URL parameter with store activeId upon initial page load / refresh
  if (route.params.id) {
    const targetId = route.params.id as string
    const match = decisions.value.find(d => d.id === targetId)
    if (match) {
      activeId.value = match.id
    }
  } else if ((route.name === 'decisions' || route.name === 'decision-detail') && activeId.value) {
    router.replace({ name: 'decision-detail', params: { id: activeId.value } })
  }
})

// Sync activeId when user uses browser back/forward or navigates by URL
watch(
  () => route.params.id,
  (newId) => {
    if (typeof newId === 'string' && newId) {
      const match = decisions.value.find(d => d.id === newId)
      if (match && match.id !== activeId.value) {
        activeId.value = match.id
      }
    }
  }
)

// Update route when activeId changes inside decisions view (e.g. duplicate or sample load)
watch(activeId, (newId) => {
  if (newId && (route.name === 'decisions' || route.name === 'decision-detail')) {
    if (route.params.id !== newId) {
      router.replace({ name: 'decision-detail', params: { id: newId } })
    }
  }
})

function handleNavigate(tab: NavigationTab) {
  if (tab === 'overview') {
    router.push('/')
  } else if (tab === 'decisions') {
    if (activeId.value) {
      router.push({ name: 'decision-detail', params: { id: activeId.value } })
    } else {
      router.push('/decisions')
    }
  } else if (tab === 'journal') {
    router.push('/journal')
  } else if (tab === 'privacy') {
    router.push('/privacy')
  } else if (tab === 'terms') {
    router.push('/terms')
  }
}

function openDecision(id: string) {
  activeId.value = id
  router.push({ name: 'decision-detail', params: { id } })
}

function handleSelectDecision(id: string) {
  activeId.value = id
  router.replace({ name: 'decision-detail', params: { id } })
}

async function handleCreateDecision(payload: { title: string; context: string; pathAName?: string; pathBName?: string }) {
  const created = await createDecision(payload.title, payload.context, payload.pathAName, payload.pathBName)
  showCreate.value = false
  if (created && created.id) {
    activeId.value = created.id
    router.push({ name: 'decision-detail', params: { id: created.id } })
  } else if (activeId.value) {
    router.push({ name: 'decision-detail', params: { id: activeId.value } })
  } else {
    router.push('/decisions')
  }
}

async function handleDeleteActive() {
  if (!activeDecision.value) return
  const confirmed = await confirmDialog({
    title: 'Hapus Keputusan Ini?',
    message: `Apakah kamu yakin ingin menghapus "${activeDecision.value.title}" beserta seluruh jalurnya? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: 'Ya, Hapus Keputusan',
    cancelText: 'Batal',
    danger: true
  })
  if (!confirmed) return
  await deleteActiveDecision()
  if (decisions.value.length && activeId.value) {
    router.replace({ name: 'decision-detail', params: { id: activeId.value } })
  } else {
    router.push('/')
  }
}

async function handleDeleteMultiple(ids: string[]) {
  if (!ids.length) return
  const count = ids.length
  const confirmed = await confirmDialog({
    title: interpolate(t.value.studio.confirmDeleteMultipleTitle, { n: count }),
    message: interpolate(t.value.studio.confirmDeleteMultipleMsg, { n: count }),
    confirmText: interpolate(t.value.studio.deleteSelected, { n: count }),
    cancelText: t.value.common.cancel,
    danger: true
  })
  if (!confirmed) return
  await deleteMultipleDecisions(ids)
}
</script>

<template>
  <div class="min-h-screen bg-canvas text-fg font-sans antialiased selection:bg-primary-soft selection:text-primary">
    <!-- Standalone Full-page View for 404 Not Found -->
    <template v-if="currentNav === 'not-found'">
      <NotFoundView />
    </template>

    <!-- Standard App Shell with Sidebar & Topbar for Application Pages -->
    <template v-else>
      <AppSidebar
        :current-nav="currentNav"
        :total-decisions="totalDecisions"
        :mobile-open="mobileMenuOpen"
        @navigate="handleNavigate"
        @close-mobile-menu="mobileMenuOpen = false"
        @export="exportBackup"
        @copy-backup="copyBackupToClipboard"
        @import-file="importBackupFile"
      />

      <main class="md:ml-63 min-h-screen bg-canvas transition-colors duration-200">
        <AppTopbar
          :current-nav="currentNav"
          @toggle-mobile-menu="mobileMenuOpen = !mobileMenuOpen"
        />

        <div v-if="busy" class="min-h-[60vh] flex items-center justify-center gap-3 text-fg-muted text-sm" role="status" aria-live="polite">
          <span class="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin"></span> Menyiapkan ruang keputusanmu…
        </div>

        <template v-else>
          <RouterView v-slot="{ route: currentRoute }">
            <Transition name="page-fade-blur" mode="out-in" @before-enter="onPageBeforeEnter">
              <OverviewView
                v-if="currentRoute.name === 'overview'"
                key="overview"
                :decisions="decisions"
                :total-decisions="totalDecisions"
                :open-decisions="openDecisions"
                :reviewed-decisions="reviewedDecisions"
                :next-review="nextReview"
                @new-decision="showCreate = true"
                @load-samples="loadSampleTemplates"
                @open-decision="openDecision"
                @navigate="handleNavigate"
              />

              <DecisionStudioView
                v-else-if="currentRoute.name === 'decisions' || currentRoute.name === 'decision-detail'"
                :key="currentRoute.name === 'decision-detail' ? (currentRoute.params.id as string) : 'decisions'"
                v-model:search-term="searchTerm"
                :decisions="decisions"
                :active-id="activeId"
                :active-decision="activeDecision"
                :filtered-decisions="filteredDecisions"
                @select-decision="handleSelectDecision"
                @new-decision="showCreate = true"
                @load-samples="loadSampleTemplates"
                @edit-active="showEdit = true"
                @duplicate-decision="duplicateDecision"
                @delete-active="handleDeleteActive"
                @delete-multiple="handleDeleteMultiple"
                @open-weights="showWeights = true"
                @open-journal="showJournal = true"
                @open-share="showShare = true"
                @add-scenario="addScenarioToActive($event.name, $event.income, $event.cost, $event.hours, $event.growth, $event.risk)"
                @remove-scenario="removeScenarioFromActive($event)"
                @choose-scenario="chooseScenario($event)"
                @update-scenario="updateScenario($event)"
                @add-assumption="addAssumptionToScenario($event.scenarioId, $event.text, $event.confidence, $event.kind)"
                @toggle-assumption="toggleAssumption($event.scenarioId, $event.assumptionId)"
                @remove-assumption="removeAssumption($event.scenarioId, $event.assumptionId)"
              />

              <JournalView
                v-else-if="currentRoute.name === 'journal'"
                key="journal"
                :decisions="decisions"
                @open-decision="openDecision"
                @edit-journal="activeId = $event; showJournal = true"
                @new-decision="showCreate = true"
              />

              <PrivacyPolicyView
                v-else-if="currentRoute.name === 'privacy'"
                key="privacy"
                @back="router.push('/')"
                @export="exportBackup"
              />

              <TermsOfUseView
                v-else-if="currentRoute.name === 'terms'"
                key="terms"
                @back="router.push('/')"
                @navigate="handleNavigate"
              />
            </Transition>
          </RouterView>
        </template>
      </main>
    </template>

    <CreateDecisionModal
      v-if="showCreate"
      @create="handleCreateDecision"
      @close="showCreate = false"
    />

    <EditDecisionModal
      v-if="showEdit && activeDecision"
      :decision="activeDecision"
      @save="updateDecisionDetails(activeDecision.id, $event.title, $event.context); showEdit = false"
      @close="showEdit = false"
    />

    <WeightsModal
      v-if="showWeights && activeDecision"
      :decision-title="activeDecision.title"
      :initial-weights="activeDecision.weights"
      @save="updateDecisionWeights(activeDecision.id, $event); showWeights = false"
      @close="showWeights = false"
    />

    <JournalModal
      v-if="showJournal && activeDecision"
      :decision-title="activeDecision.title"
      :initial-journal="activeDecision.journal"
      :initial-review-date="activeDecision.reviewDate"
      :initial-status="activeDecision.status"
      @save="saveJournal(activeDecision.id, $event.journal, $event.status); updateReviewDate(activeDecision.id, $event.reviewDate); showJournal = false"
      @close="showJournal = false"
    />

    <ShareStoryModal
      v-if="showShare && activeDecision"
      :decision="activeDecision"
      @close="showShare = false"
    />

    <ConfirmModal />

    <ToastContainer />

    <PwaInstallBanner />

    <UnsupportedBrowserNotice />
  </div>
</template>
