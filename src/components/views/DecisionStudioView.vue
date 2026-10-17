<script setup lang="ts">
import { ref } from 'vue'
import {
  Plus, Search, Trash2, CalendarDays, ArrowRight, GitBranch,
  SlidersHorizontal, Scale, ShieldAlert
} from 'lucide-vue-next'
import type { Decision, Scenario, AssumptionKind } from '../../types'
import { useI18n } from '../../i18n'
import ScenarioCard from '../decision/ScenarioCard.vue'
import WhatIfSimulator from '../decision/WhatIfSimulator.vue'
import AssumptionManager from '../decision/AssumptionManager.vue'
import IllustrationFork from '../common/IllustrationFork.vue'

const props = defineProps<{
  decisions: Decision[]
  activeId: string | null
  activeDecision: Decision | null
  filteredDecisions: Decision[]
  searchTerm: string
}>()

const emit = defineEmits<{
  (e: 'update:searchTerm', val: string): void
  (e: 'select-decision', id: string): void
  (e: 'new-decision'): void
  (e: 'delete-active'): void
  (e: 'open-weights'): void
  (e: 'open-journal'): void
  (e: 'add-scenario', payload: { name: string; income: number; cost: number; hours: number; growth: number; risk: number }): void
  (e: 'remove-scenario', id: string): void
  (e: 'choose-scenario', id: string): void
  (e: 'update-scenario', scenario: Scenario): void
  (e: 'add-assumption', payload: { scenarioId: string; text: string; confidence: number; kind: AssumptionKind }): void
  (e: 'toggle-assumption', payload: { scenarioId: string; assumptionId: string }): void
  (e: 'remove-assumption', payload: { scenarioId: string; assumptionId: string }): void
}>()

const { t, locale, interpolate } = useI18n()

// New Path Inline Form State
const showAddPath = ref(false)
const pathName = ref('')
const pathIncome = ref(5000000)
const pathCost = ref(1000000)
const pathHours = ref(20)
const pathGrowth = ref(70)
const pathRisk = ref(35)

function submitAddPath() {
  if (!pathName.value.trim()) return
  emit('add-scenario', {
    name: pathName.value.trim(),
    income: Number(pathIncome.value),
    cost: Number(pathCost.value),
    hours: Number(pathHours.value),
    growth: Number(pathGrowth.value),
    risk: Number(pathRisk.value)
  })
  pathName.value = ''
  showAddPath.value = false
}

function formatDate(value: string) {
  if (!value) return '-'
  const loc = locale.value === 'id' ? 'id-ID' : 'en-GB'
  return new Intl.DateTimeFormat(loc, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${value}T12:00:00`))
}
</script>

<template>
  <section class="page" aria-label="Decision studio">
    <div class="page-title-row">
      <div>
        <div class="eyebrow">{{ t.studio.eyebrow }}</div>
        <h1>{{ t.studio.title }}<span class="title-period">.</span></h1>
        <p class="hero-copy">{{ t.studio.subtitle }}</p>
      </div>
      <button class="button button-primary" @click="emit('new-decision')">
        <Plus :size="17" /> {{ t.studio.newDecision }}
      </button>
    </div>

    <div class="studio-layout">
      <!-- Left Decision Picker Sidebar -->
      <aside class="decision-picker" aria-label="Decision selector">
        <div class="search-box">
          <Search :size="16" />
          <input
            :value="searchTerm"
            :placeholder="t.studio.searchPlaceholder"
            @input="emit('update:searchTerm', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <button
          v-for="decision in filteredDecisions"
          :key="decision.id"
          type="button"
          :class="['picker-item', { selected: decision.id === activeId }]"
          @click="emit('select-decision', decision.id)"
        >
          <span class="picker-mark"><GitBranch :size="16" /></span>
          <span class="picker-copy">
            <strong>{{ decision.title }}</strong>
            <small>
              {{ interpolate(t.overview.pathsCount, { n: decision.scenarios.length }) }} · {{ formatDate(decision.createdAt) }}
            </small>
          </span>
          <span class="picker-dot" />
        </button>

        <div v-if="!filteredDecisions.length" class="picker-empty">
          {{ t.studio.noMatches }}
        </div>

        <button type="button" class="picker-add" @click="emit('new-decision')">
          <Plus :size="16" /> {{ t.studio.addDecision }}
        </button>
      </aside>

      <!-- Right Active Decision Workspace -->
      <div v-if="activeDecision" class="decision-detail">
        <div class="detail-header">
          <div>
            <div class="eyebrow">
              {{ interpolate(t.studio.briefEyebrow, { date: formatDate(activeDecision.createdAt).toUpperCase() }) }}
            </div>
            <h2>{{ activeDecision.title }}</h2>
            <p>{{ activeDecision.context || t.studio.noContext }}</p>
          </div>
          <button
            type="button"
            class="icon-button danger-hover"
            :aria-label="t.studio.deleteAria"
            @click="emit('delete-active')"
          >
            <Trash2 :size="17" />
          </button>
        </div>

        <div class="detail-meta">
          <span>
            <CalendarDays :size="15" />
            {{ interpolate(t.studio.reviewBy, { date: formatDate(activeDecision.reviewDate) }) }}
          </span>
          <span :class="['status-tag', activeDecision.status]">{{ activeDecision.status }}</span>

          <button type="button" class="text-button small" @click="emit('open-weights')">
            <Scale :size="14" /> {{ t.studio.weightsBtn }}
          </button>

          <button type="button" class="text-button small" @click="emit('open-journal')">
            {{ t.studio.openJournal }} <ArrowRight :size="14" />
          </button>
        </div>

        <!-- Scenarios Section -->
        <div class="subsection-title">
          <div>
            <h3>{{ t.studio.explorePathsTitle }}</h3>
            <p>{{ t.studio.explorePathsDesc }}</p>
          </div>
          <button
            type="button"
            class="button button-secondary button-small"
            @click="showAddPath = !showAddPath"
          >
            <Plus :size="15" /> {{ t.studio.addPath }}
          </button>
        </div>

        <!-- Inline Add Path Form -->
        <form v-if="showAddPath" class="inline-form scenario-new" @submit.prevent="submitAddPath">
          <label>
            {{ t.addPathForm.title }}
            <input v-model="pathName" required :placeholder="t.addPathForm.placeholder" />
          </label>
          <div class="form-grid three">
            <label>
              {{ t.addPathForm.monthlyIncome }}
              <input v-model.number="pathIncome" type="number" min="0" step="100000" />
            </label>
            <label>
              {{ t.addPathForm.monthlyCost }}
              <input v-model.number="pathCost" type="number" min="0" step="100000" />
            </label>
            <label>
              {{ t.addPathForm.hoursPerWeek }}
              <input v-model.number="pathHours" type="number" min="0" max="168" />
            </label>
            <label>
              {{ t.addPathForm.growth }} <b>{{ pathGrowth }}/100</b>
              <input v-model.number="pathGrowth" type="range" min="0" max="100" />
            </label>
            <label>
              {{ t.addPathForm.risk }} <b>{{ pathRisk }}/100</b>
              <input v-model.number="pathRisk" type="range" min="0" max="100" />
            </label>
          </div>
          <div class="form-actions">
            <button type="button" class="button button-ghost" @click="showAddPath = false">
              {{ t.addPathForm.cancel }}
            </button>
            <button class="button button-primary" type="submit" :disabled="!pathName.trim()">
              {{ t.addPathForm.submit }} <ArrowRight :size="15" />
            </button>
          </div>
        </form>

        <!-- Scenario Cards Grid -->
        <div class="scenario-grid">
          <ScenarioCard
            v-for="(scenario, index) in activeDecision.scenarios"
            :key="scenario.id"
            :scenario="scenario"
            :index="index"
            :is-selected="activeDecision.selectedScenarioId === scenario.id"
            :weights="activeDecision.weights"
            @update="emit('update-scenario', $event)"
            @choose="emit('choose-scenario', $event)"
            @remove="emit('remove-scenario', $event)"
          />
        </div>

        <!-- Reactive What-If Stress Test -->
        <WhatIfSimulator
          :scenarios="activeDecision.scenarios"
          :weights="activeDecision.weights"
        />

        <!-- Assumptions & Evidence Tracking -->
        <AssumptionManager
          :scenarios="activeDecision.scenarios"
          :selected-scenario-id="activeDecision.selectedScenarioId"
          @add-assumption="emit('add-assumption', $event)"
          @toggle-assumption="emit('toggle-assumption', $event)"
          @remove-assumption="emit('remove-assumption', $event)"
        />

        <div class="detail-footer">
          <span><ShieldAlert :size="14" /> {{ t.studio.disclaimer }}</span>
          <button type="button" class="text-button" @click="emit('open-journal')">
            {{ t.studio.openJournal }} <ArrowRight :size="15" />
          </button>
        </div>
      </div>

      <!-- Empty Picker State -->
      <div v-else class="empty-detail">
        <IllustrationFork :width="140" :height="110" />
        <h3>{{ t.studio.emptyPickerTitle }}</h3>
        <p>{{ t.studio.emptyPickerDesc }}</p>
        <button class="button button-primary" @click="emit('new-decision')">
          <Plus :size="16" /> {{ t.studio.newDecision }}
        </button>
      </div>
    </div>
  </section>
</template>
