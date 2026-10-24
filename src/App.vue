<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
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
import CreateDecisionModal from './components/modals/CreateDecisionModal.vue'
import WeightsModal from './components/modals/WeightsModal.vue'
import JournalModal from './components/modals/JournalModal.vue'
import ShareStoryModal from './components/modals/ShareStoryModal.vue'
import ConfirmModal from './components/common/ConfirmModal.vue'
import ToastContainer from './components/common/ToastContainer.vue'
import PwaInstallBanner from './components/common/PwaInstallBanner.vue'
import UnsupportedBrowserNotice from './components/common/UnsupportedBrowserNotice.vue'
import type { NavigationTab } from './types'

const {
  decisions, activeId, searchTerm, busy, notice, activeDecision, filteredDecisions,
  totalDecisions, openDecisions, reviewedDecisions, nextReview,
  load, createDecision, deleteActiveDecision, addScenarioToActive, removeScenarioFromActive,
  chooseScenario, updateScenario, addAssumptionToScenario, toggleAssumption, removeAssumption,
  saveJournal, updateDecisionWeights, updateReviewDate, exportBackup, copyBackupToClipboard, importBackupFile
} = useDecisions()

const { confirm: confirmDialog } = useConfirm()
const { t } = useI18n()

const nav = ref<NavigationTab>('overview')
const showCreate = ref(false)
const showWeights = ref(false)
const showJournal = ref(false)
const showShare = ref(false)
const mobileMenuOpen = ref(false)

watch(nav, () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
})

function onPageBeforeEnter() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

onMounted(() => {
  load()
})

function openDecision(id: string) {
  activeId.value = id
  nav.value = 'decisions'
}

function handleCreateDecision(payload: { title: string; context: string; pathAName?: string; pathBName?: string }) {
  createDecision(payload.title, payload.context, payload.pathAName, payload.pathBName)
  showCreate.value = false
  nav.value = 'decisions'
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
  deleteActiveDecision()
  nav.value = 'overview'
}
</script>

<template>
  <div class="min-h-screen bg-canvas text-fg font-sans antialiased selection:bg-primary-soft selection:text-primary">
    <AppSidebar
      :current-nav="nav"
      :total-decisions="totalDecisions"
      :mobile-open="mobileMenuOpen"
      @navigate="nav = $event"
      @close-mobile-menu="mobileMenuOpen = false"
      @export="exportBackup"
      @copy-backup="copyBackupToClipboard"
      @import-file="importBackupFile"
    />

    <main class="md:ml-63 min-h-screen bg-canvas transition-colors duration-200">
      <AppTopbar
        :current-nav="nav"
        @toggle-mobile-menu="mobileMenuOpen = !mobileMenuOpen"
      />

      <div v-if="busy" class="min-h-[60vh] flex items-center justify-center gap-3 text-fg-muted text-sm" role="status" aria-live="polite">
        <span class="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin"></span> Menyiapkan ruang keputusanmu…
      </div>

      <template v-else>
        <Transition name="page-fade-blur" mode="out-in" @before-enter="onPageBeforeEnter">
          <OverviewView
            v-if="nav === 'overview'"
            key="overview"
            :decisions="decisions"
            :total-decisions="totalDecisions"
            :open-decisions="openDecisions"
            :reviewed-decisions="reviewedDecisions"
            :next-review="nextReview"
            @new-decision="showCreate = true"
            @open-decision="openDecision"
            @navigate="nav = $event"
          />

          <DecisionStudioView
            v-else-if="nav === 'decisions'"
            key="decisions"
            v-model:search-term="searchTerm"
            :decisions="decisions"
            :active-id="activeId"
            :active-decision="activeDecision"
            :filtered-decisions="filteredDecisions"
            @select-decision="activeId = $event"
            @new-decision="showCreate = true"
            @delete-active="handleDeleteActive"
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
            v-else-if="nav === 'journal'"
            key="journal"
            :decisions="decisions"
            @open-decision="openDecision"
            @edit-journal="activeId = $event; showJournal = true"
            @new-decision="showCreate = true"
          />

          <PrivacyPolicyView
            v-else-if="nav === 'privacy'"
            key="privacy"
            @back="nav = 'overview'"
            @export="exportBackup"
          />

          <TermsOfUseView
            v-else-if="nav === 'terms'"
            key="terms"
            @back="nav = 'overview'"
            @navigate="nav = $event"
          />
        </Transition>
      </template>
    </main>

    <CreateDecisionModal
      v-if="showCreate"
      @create="handleCreateDecision"
      @close="showCreate = false"
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
