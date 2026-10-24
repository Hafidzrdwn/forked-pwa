<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Plus, Search, Trash2, CalendarDays, ArrowRight, GitBranch,
  Scale, ShieldAlert, AlertCircle, Share2, Pencil, Copy, Check, Sparkles
} from '../common/AppIcons'
import type { Decision, Scenario, AssumptionKind } from '../../types'
import { useI18n } from '../../i18n'
import { formatRupiahInput, parseRupiahInput } from '../../services/scoring'
import ScenarioCard from '../decision/ScenarioCard.vue'
import ComparisonMatrix from '../decision/ComparisonMatrix.vue'
import WhatIfSimulator from '../decision/WhatIfSimulator.vue'
import AssumptionManager from '../decision/AssumptionManager.vue'
import IllustrationFork from '../common/IllustrationFork.vue'
import DecisionWatermarkIllustration from '../common/DecisionWatermarkIllustration.vue'
import { AddScenarioInputSchema } from '../../schemas/decision.schema'

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
  (e: 'load-samples'): void
  (e: 'edit-active'): void
  (e: 'duplicate-decision', id: string): void
  (e: 'delete-active'): void
  (e: 'delete-multiple', ids: string[]): void
  (e: 'open-weights'): void
  (e: 'open-journal'): void
  (e: 'open-share'): void
  (e: 'add-scenario', payload: { name: string; income: number; cost: number; hours: number; growth: number; risk: number }): void
  (e: 'remove-scenario', id: string): void
  (e: 'choose-scenario', id: string): void
  (e: 'update-scenario', scenario: Scenario): void
  (e: 'add-assumption', payload: { scenarioId: string; text: string; confidence: number; kind: AssumptionKind }): void
  (e: 'toggle-assumption', payload: { scenarioId: string; assumptionId: string }): void
  (e: 'remove-assumption', payload: { scenarioId: string; assumptionId: string }): void
}>()

const { t, locale, interpolate } = useI18n()

const multiSelectMode = ref(false)
const selectedIds = ref<string[]>([])

function toggleMultiSelectMode() {
  multiSelectMode.value = !multiSelectMode.value
  if (!multiSelectMode.value) {
    selectedIds.value = []
  }
}

function toggleSelectItem(id: string) {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}

function handleDeleteSelected() {
  if (!selectedIds.value.length) return
  emit('delete-multiple', [...selectedIds.value])
  selectedIds.value = []
  multiSelectMode.value = false
}

const showAddPath = ref(false)
const pathName = ref('')
const pathIncome = ref(5000000)
const pathCost = ref(1000000)
const pathHours = ref(20)
const pathGrowth = ref(70)
const pathRisk = ref(35)
const pathNameTouched = ref(false)

const scenarioValidation = computed(() => {
  return AddScenarioInputSchema.safeParse({
    name: pathName.value,
    income: Number(pathIncome.value),
    cost: Number(pathCost.value),
    hours: Number(pathHours.value),
    growth: Number(pathGrowth.value),
    risk: Number(pathRisk.value)
  })
})

const pathNameError = computed(() => {
  if (!pathNameTouched.value || scenarioValidation.value.success) return ''
  const err = scenarioValidation.value.error.format().name
  return err?._errors[0] ?? ''
})

function submitAddPath() {
  pathNameTouched.value = true
  if (!scenarioValidation.value.success) return
  const data = scenarioValidation.value.data
  emit('add-scenario', {
    name: data.name,
    income: data.income,
    cost: data.cost,
    hours: data.hours,
    growth: data.growth,
    risk: data.risk
  })
  pathName.value = ''
  pathNameTouched.value = false
  showAddPath.value = false
}

function formatDate(value: string) {
  if (!value) return '-'
  const loc = locale.value === 'id' ? 'id-ID' : 'en-GB'
  return new Intl.DateTimeFormat(loc, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(`${value}T12:00:00`))
}
</script>

<template>
  <section class="max-w-310 mx-auto px-4 md:px-8 py-7 md:py-10" aria-label="Decision studio">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
      <div>
        <h1 class="font-display font-extrabold text-2xl md:text-4xl tracking-tight text-fg">
          {{ t.studio.title }}<span class="text-primary">.</span>
        </h1>
        <p class="text-sm md:text-[14.5px] leading-relaxed text-fg-muted max-w-xl mt-1.5">{{ t.studio.subtitle }}</p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        @click="emit('new-decision')"
      >
        <Plus :size="17" /> {{ t.studio.newDecision }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
      <aside class="border border-border bg-surface rounded-2xl p-3.5 lg:sticky lg:top-21.25 shadow-xs" aria-label="Decision selector">
        <div class="flex items-center gap-2 bg-canvas-subtle border border-border rounded-xl px-3 h-10 text-fg-subtle mb-3">
          <Search :size="16" />
          <input
            :value="searchTerm"
            class="w-full border-0 bg-transparent outline-none text-xs text-fg placeholder:text-fg-subtle"
            :placeholder="t.studio.searchPlaceholder"
            @input="emit('update:searchTerm', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div v-if="filteredDecisions.length > 1 || multiSelectMode" class="flex items-center justify-between gap-2 mb-2 px-1">
          <span class="text-[10.5px] font-bold text-fg-subtle uppercase tracking-wider">
            {{ multiSelectMode ? interpolate(t.studio.selectedCount, { n: selectedIds.length }) : t.overview.allDecisions }}
          </span>
          <button
            type="button"
            class="text-[11px] font-bold text-primary hover:text-primary-dark transition-colors cursor-pointer"
            @click="toggleMultiSelectMode"
          >
            {{ multiSelectMode ? t.studio.cancelSelect : t.studio.selectMultiple }}
          </button>
        </div>

        <button
          v-for="decision in filteredDecisions"
          :key="decision.id"
          type="button"
          :class="[
            'w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer mb-1',
            multiSelectMode && selectedIds.includes(decision.id)
              ? 'bg-primary-soft/60 border border-primary/40 text-primary shadow-2xs'
              : !multiSelectMode && decision.id === activeId
                ? 'bg-primary-soft text-primary font-bold shadow-2xs'
                : 'hover:bg-canvas-subtle text-fg border border-transparent'
          ]"
          @click="multiSelectMode ? toggleSelectItem(decision.id) : emit('select-decision', decision.id)"
        >
          <div
            v-if="multiSelectMode"
            :class="[
              'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all',
              selectedIds.includes(decision.id)
                ? 'bg-primary border-primary text-white'
                : 'border-border bg-surface'
            ]"
          >
            <Check v-if="selectedIds.includes(decision.id)" :size="13" stroke-width="3" />
          </div>

          <span
            v-else
            :class="[
              'w-8 h-8 rounded-lg grid place-items-center shrink-0 text-sm',
              decision.id === activeId ? 'bg-surface text-primary shadow-xs' : 'bg-canvas-subtle text-fg-muted'
            ]"
          >
            <GitBranch :size="16" />
          </span>
          <span class="min-w-0 flex-1">
            <strong class="block text-xs font-bold truncate">{{ decision.title }}</strong>
            <small class="text-[11px] text-fg-muted block truncate">
              {{ interpolate(t.overview.pathsCount, { n: decision.scenarios.length }) }} · {{ formatDate(decision.createdAt) }}
            </small>
          </span>
        </button>

        <button
          v-if="multiSelectMode && selectedIds.length > 0"
          type="button"
          class="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl bg-danger-soft text-danger border border-danger/25 hover:bg-danger hover:text-white text-xs font-bold transition-all cursor-pointer mt-2 shadow-xs"
          @click="handleDeleteSelected"
        >
          <Trash2 :size="14" />
          {{ interpolate(t.studio.deleteSelected, { n: selectedIds.length }) }}
        </button>

        <div v-if="!filteredDecisions.length" class="p-4 text-center text-xs text-fg-muted">
          {{ t.studio.noMatches }}
        </div>

        <button
          v-if="!multiSelectMode"
          type="button"
          class="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-border text-fg-muted hover:text-fg hover:border-primary text-xs font-bold transition-colors cursor-pointer mt-2"
          @click="emit('new-decision')"
        >
          <Plus :size="16" /> {{ t.studio.addDecision }}
        </button>
      </aside>

      <div v-if="activeDecision" class="min-w-0 flex flex-col gap-5">
        <div class="border border-border rounded-2xl bg-surface p-4 md:p-6 shadow-xs relative overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 md:gap-4 relative z-10">
            <div class="min-w-0 flex-1 pr-0 sm:pr-3">
              <div class="text-[11px] font-semibold text-fg-subtle mb-1">
                {{ interpolate(t.studio.createdOn, { date: formatDate(activeDecision.createdAt) }) }}
              </div>
              <h2 class="font-display font-extrabold text-xl md:text-2xl tracking-tight text-fg my-0.5 leading-snug wrap-break-word">{{ activeDecision.title }}</h2>
              <p class="text-xs md:text-sm text-fg-muted leading-relaxed m-0 mt-1.5">{{ activeDecision.context || t.studio.noContext }}</p>

              <div class="mt-3">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs',
                    (activeDecision.status || '').toLowerCase() === 'exploring' ? 'bg-amber-soft text-amber' : (activeDecision.status || '').toLowerCase() === 'decided' ? 'bg-primary-soft text-primary' : 'bg-blue-soft text-blue'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {{ (activeDecision.status || '').toLowerCase() === 'exploring' ? t.common.statusExploring : (activeDecision.status || '').toLowerCase() === 'decided' ? t.common.statusDecided : t.common.statusReviewed }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-start pt-1 sm:pt-0">
              <button
                type="button"
                class="group relative inline-flex items-center h-9 min-w-9 max-w-9 hover:max-w-56 focus-visible:max-w-56 px-2.5 hover:pr-3 focus-visible:pr-3 rounded-xl border border-border bg-surface text-fg hover:border-primary hover:bg-canvas-subtle focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-300 ease-out cursor-pointer shadow-2xs shrink-0 overflow-hidden"
                :title="t.studio.editDecision"
                :aria-label="t.studio.editDecision"
                @click="emit('edit-active')"
              >
                <Pencil :size="15" class="text-primary dark:text-white shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span class="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-out group-hover:max-w-44 group-focus-visible:max-w-44 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:ml-1.5 group-focus-visible:ml-1.5 text-xs font-bold leading-none text-fg dark:text-white">
                  {{ t.studio.editDecision }}
                </span>
              </button>

              <button
                type="button"
                class="group relative inline-flex items-center h-9 min-w-9 max-w-9 hover:max-w-56 focus-visible:max-w-56 px-2.5 hover:pr-3 focus-visible:pr-3 rounded-xl border border-border bg-surface text-fg hover:border-primary hover:bg-canvas-subtle focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-300 ease-out cursor-pointer shadow-2xs shrink-0 overflow-hidden"
                :title="t.studio.duplicateDecision"
                :aria-label="t.studio.duplicateDecision"
                @click="emit('duplicate-decision', activeDecision.id)"
              >
                <Copy :size="15" class="text-primary dark:text-white shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span class="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-out group-hover:max-w-44 group-focus-visible:max-w-44 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:ml-1.5 group-focus-visible:ml-1.5 text-xs font-bold leading-none text-fg dark:text-white">
                  {{ t.studio.duplicateDecision }}
                </span>
              </button>

              <button
                type="button"
                class="group relative inline-flex items-center h-9 min-w-9 max-w-9 hover:max-w-56 focus-visible:max-w-56 px-2.5 hover:pr-3 focus-visible:pr-3 rounded-xl border border-border bg-surface text-fg hover:border-primary hover:bg-canvas-subtle focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-300 ease-out cursor-pointer shadow-2xs shrink-0 overflow-hidden"
                :title="t.studio.shareBtn"
                :aria-label="t.studio.shareBtn"
                @click="emit('open-share')"
              >
                <Share2 :size="15" class="text-primary dark:text-white shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span class="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-out group-hover:max-w-44 group-focus-visible:max-w-44 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:ml-1.5 group-focus-visible:ml-1.5 text-xs font-bold leading-none text-fg dark:text-white">
                  {{ t.studio.shareBtn }}
                </span>
              </button>

              <button
                type="button"
                class="group relative inline-flex items-center h-9 min-w-9 max-w-9 hover:max-w-40 focus-visible:max-w-40 px-2.5 hover:pr-3 focus-visible:pr-3 rounded-xl border border-border bg-surface text-fg-muted hover:text-danger hover:border-danger/40 hover:bg-danger-soft focus-visible:border-danger focus-visible:ring-2 focus-visible:ring-danger/20 transition-all duration-300 ease-out cursor-pointer shadow-2xs shrink-0 overflow-hidden"
                :title="t.studio.deleteAria"
                :aria-label="t.studio.deleteAria"
                @click="emit('delete-active')"
              >
                <Trash2 :size="15" class="shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span class="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-out group-hover:max-w-28 group-focus-visible:max-w-28 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:ml-1.5 group-focus-visible:ml-1.5 text-xs font-bold leading-none">
                  {{ t.common.delete }}
                </span>
              </button>
            </div>
          </div>

          <!-- Ambient Decision Watermark Illustration (fills bottom-right empty space) -->
          <DecisionWatermarkIllustration
            class="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 lg:-bottom-8 lg:-right-6 hidden sm:block sm:w-52 sm:h-38 md:w-68 md:h-48 lg:w-84 lg:h-60 text-primary opacity-[0.10] dark:opacity-[0.18] z-0"
          />
        </div>

        <div id="decision-meta-card" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 p-3.5 sm:p-4 bg-surface border border-border rounded-2xl text-xs md:text-sm text-fg-muted shadow-2xs overflow-hidden">
          <div class="inline-flex items-center gap-2 text-fg font-medium min-w-0">
            <CalendarDays :size="16" class="text-primary shrink-0" />
            <span class="break-words">{{ interpolate(t.studio.reviewBy, { date: formatDate(activeDecision.reviewDate) }) }}</span>
          </div>

          <div class="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-border/40 sm:border-0 shrink-0">
            <button
              type="button"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-canvas-subtle hover:border-primary text-xs font-bold text-fg transition-all cursor-pointer shadow-2xs text-center"
              @click="emit('open-weights')"
            >
              <Scale :size="14" class="text-primary shrink-0" />
              <span>{{ t.studio.weightsBtn }}</span>
            </button>

            <button
              type="button"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-soft hover:bg-primary-soft/80 border border-primary/20 text-xs font-bold text-primary transition-all cursor-pointer shadow-2xs text-center"
              @click="emit('open-journal')"
            >
              <span>{{ t.studio.openJournal }}</span>
              <ArrowRight :size="13" class="shrink-0" />
            </button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-2">
          <div>
            <h3 class="font-display font-bold text-base md:text-lg tracking-tight text-fg m-0">{{ t.studio.explorePathsTitle }}</h3>
            <p class="text-xs text-fg-muted mt-0.5">{{ t.studio.explorePathsDesc }}</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-fg hover:bg-canvas-subtle transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
            @click="showAddPath = !showAddPath"
          >
            <Plus :size="15" /> {{ t.studio.addPath }}
          </button>
        </div>

        <form v-if="showAddPath" class="bg-canvas-subtle border border-border rounded-2xl p-4 md:p-5 my-2 shadow-xs" @submit.prevent="submitAddPath">
          <label class="block text-xs font-bold text-fg mb-3.5">
            {{ t.addPathForm.title }}
            <input
              v-model="pathName"
              :class="[
                'w-full mt-1.5 border rounded-xl bg-surface text-fg px-3.5 py-2 text-sm outline-none transition-all',
                pathNameError ? 'border-danger ring-2 ring-danger/20' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
              ]"
              :placeholder="t.addPathForm.placeholder"
              @blur="pathNameTouched = true"
            />
            <div v-if="pathNameError" class="flex items-center gap-1 text-danger text-xs font-semibold mt-1">
              <AlertCircle :size="14" />
              <span>{{ pathNameError }}</span>
            </div>
          </label>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3.5">
            <label class="block text-xs font-bold text-fg">
              {{ t.addPathForm.monthlyIncome }}
              <div class="flex items-center gap-1.5 bg-surface border border-border rounded-xl px-3 py-2 mt-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <span class="text-xs text-fg-muted font-bold">Rp</span>
                <input
                  :value="formatRupiahInput(pathIncome)"
                  class="w-full text-xs font-bold bg-transparent outline-none text-fg"
                  placeholder="5.000.000"
                  @input="pathIncome = parseRupiahInput(($event.target as HTMLInputElement).value)"
                />
              </div>
            </label>
            <label class="block text-xs font-bold text-fg">
              {{ t.addPathForm.monthlyCost }}
              <div class="flex items-center gap-1.5 bg-surface border border-border rounded-xl px-3 py-2 mt-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <span class="text-xs text-fg-muted font-bold">Rp</span>
                <input
                  :value="formatRupiahInput(pathCost)"
                  class="w-full text-xs font-bold bg-transparent outline-none text-fg"
                  placeholder="1.000.000"
                  @input="pathCost = parseRupiahInput(($event.target as HTMLInputElement).value)"
                />
              </div>
            </label>
            <label class="block text-xs font-bold text-fg">
              {{ t.addPathForm.hoursPerWeek }}
              <div class="flex items-center gap-1.5 bg-surface border border-border rounded-xl px-3 py-2 mt-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <input
                  v-model.number="pathHours"
                  type="number"
                  min="0"
                  max="168"
                  class="w-full text-xs font-bold bg-transparent outline-none text-fg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span class="text-xs text-fg-muted font-medium shrink-0">{{ t.common.hrs }}</span>
              </div>
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
            <label class="block text-xs font-bold text-fg">
              <div class="flex justify-between items-center mb-1.5">
                <span>{{ t.addPathForm.growth }}</span>
                <div class="flex items-center gap-1 shrink-0">
                  <input
                    v-model.number="pathGrowth"
                    type="number"
                    min="0"
                    max="100"
                    class="w-12 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span class="text-[11px] text-fg-muted">/100</span>
                </div>
              </div>
              <input v-model.number="pathGrowth" type="range" min="0" max="100" class="w-full" />
            </label>

            <label class="block text-xs font-bold text-fg">
              <div class="flex justify-between items-center mb-1.5">
                <span>{{ t.addPathForm.risk }}</span>
                <div class="flex items-center gap-1 shrink-0">
                  <input
                    v-model.number="pathRisk"
                    type="number"
                    min="0"
                    max="100"
                    class="w-12 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span class="text-[11px] text-fg-muted">/100</span>
                </div>
              </div>
              <input v-model.number="pathRisk" type="range" min="0" max="100" class="w-full" />
            </label>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-2">
            <button type="button" class="px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer" @click="showAddPath = false">
              {{ t.addPathForm.cancel }}
            </button>
            <button class="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50" type="submit" :disabled="pathName.trim().length < 2">
              {{ t.addPathForm.submit }} <ArrowRight :size="15" />
            </button>
          </div>
        </form>

        <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 mb-2">
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

        <ComparisonMatrix
          :scenarios="activeDecision.scenarios"
          :weights="activeDecision.weights"
          :selected-scenario-id="activeDecision.selectedScenarioId"
          @choose-scenario="emit('choose-scenario', $event)"
        />

        <WhatIfSimulator
          :scenarios="activeDecision.scenarios"
          :weights="activeDecision.weights"
        />

        <AssumptionManager
          :scenarios="activeDecision.scenarios"
          :selected-scenario-id="activeDecision.selectedScenarioId"
          @add-assumption="emit('add-assumption', $event)"
          @toggle-assumption="emit('toggle-assumption', $event)"
          @remove-assumption="emit('remove-assumption', $event)"
        />

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-fg-subtle pt-3 border-t border-border/40">
          <p class="leading-relaxed m-0 text-fg-muted flex-1">
            <ShieldAlert :size="14" class="inline mr-1 text-primary shrink-0 -mt-0.5" />
            {{ t.studio.disclaimer }}
          </p>
          <button type="button" class="inline-flex items-center gap-1.5 text-primary font-bold hover:text-primary-dark transition-colors cursor-pointer shrink-0" @click="emit('open-journal')">
            <span>{{ t.studio.openJournal }}</span> <ArrowRight :size="14" />
          </button>
        </div>
      </div>

      <div v-else class="border border-border bg-surface rounded-2xl p-8 md:p-10 text-center flex flex-col items-center shadow-xs">
        <IllustrationFork :width="140" :height="110" />
        <h3 class="font-display font-bold text-lg text-fg mt-4 mb-2">{{ t.studio.emptyPickerTitle }}</h3>
        <p class="text-sm text-fg-muted max-w-md mb-5 leading-relaxed">{{ t.studio.emptyPickerDesc }}</p>
        <div class="flex flex-col sm:flex-row items-center gap-3">
          <button
            class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all cursor-pointer"
            @click="emit('new-decision')"
          >
            <Plus :size="16" /> {{ t.studio.newDecision }}
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-fg-muted hover:text-fg hover:bg-canvas-subtle border border-border transition-all cursor-pointer"
            @click="emit('load-samples')"
          >
            <Sparkles :size="15" /> {{ t.overview.loadSampleAction }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
