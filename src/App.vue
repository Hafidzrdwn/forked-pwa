<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { useDecisions } from './composables/useDecisions'
import { useI18n } from './i18n'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppTopbar from './components/layout/AppTopbar.vue'
import OverviewView from './components/views/OverviewView.vue'
import DecisionStudioView from './components/views/DecisionStudioView.vue'
import JournalView from './components/views/JournalView.vue'
import CreateDecisionModal from './components/modals/CreateDecisionModal.vue'
import WeightsModal from './components/modals/WeightsModal.vue'
import JournalModal from './components/modals/JournalModal.vue'

const {
  decisions, activeId, searchTerm, busy, notice, activeDecision, filteredDecisions,
  totalDecisions, openDecisions, reviewedDecisions, nextReview,
  load, createDecision, deleteActiveDecision, addScenarioToActive, removeScenarioFromActive,
  chooseScenario, updateScenario, addAssumptionToScenario, toggleAssumption, removeAssumption,
  saveJournal, updateDecisionWeights, updateReviewDate, exportBackup, importBackupFile
} = useDecisions()

const { t } = useI18n()

const nav = ref<'overview' | 'decisions' | 'journal'>('overview')
const showCreate = ref(false)
const showWeights = ref(false)
const showJournal = ref(false)

onMounted(() => {
  load()
})

function openDecision(id: string) {
  activeId.value = id
  nav.value = 'decisions'
}

function handleCreateDecision(payload: { title: string; context: string }) {
  createDecision(payload.title, payload.context)
  showCreate.value = false
  nav.value = 'decisions'
}

function handleDeleteActive() {
  if (!activeDecision.value) return
  if (!confirm(`Hapus "${activeDecision.value.title}" beserta seluruh datanya?`)) return
  deleteActiveDecision()
  nav.value = 'overview'
}
</script>

<template>
  <div class="app-shell">
    <!-- Sidebar Navigation -->
    <AppSidebar
      :current-nav="nav"
      :total-decisions="totalDecisions"
      @navigate="nav = $event"
      @export="exportBackup"
      @import-file="importBackupFile"
    />

    <!-- Main Workspace Area -->
    <main class="main-area">
      <AppTopbar :current-nav="nav" />

      <!-- Loading State -->
      <div v-if="busy" class="loading-state" role="status" aria-live="polite">
        <span class="spinner"></span> Menyiapkan ruang keputusanmu…
      </div>

      <!-- Main View Pages -->
      <template v-else>
        <OverviewView
          v-if="nav === 'overview'"
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
          :decisions="decisions"
          @open-decision="openDecision"
          @edit-journal="activeId = $event; showJournal = true"
          @new-decision="showCreate = true"
        />
      </template>
    </main>

    <!-- Modals -->
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

    <!-- Toast Feedback Notice -->
    <Transition name="toast">
      <div v-if="notice" class="toast-message" role="alert" aria-live="assertive">
        <Check :size="16" /> {{ notice }}
      </div>
    </Transition>
  </div>
</template>
