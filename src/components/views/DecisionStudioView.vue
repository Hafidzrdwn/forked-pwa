<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Plus, Search, Trash2, CalendarDays, ArrowRight, GitBranch,
  SlidersHorizontal, Scale, ShieldAlert, AlertCircle
} from 'lucide-vue-next'
import type { Decision, Scenario, AssumptionKind } from '../../types'
import { useI18n } from '../../i18n'
import { formatRupiahInput, parseRupiahInput } from '../../services/scoring'
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

import { AddScenarioInputSchema } from '../../schemas/decision.schema'

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
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${value}T12:00:00`))
}
</script>

<template>
  <section class="max-w-[1240px] mx-auto px-4 md:px-8 py-8 md:py-10" aria-label="Decision studio">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
      <div>
        <div class="text-[11px] font-bold tracking-wider uppercase text-primary mb-2.5">{{ t.studio.eyebrow }}</div>
        <h1 class="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-fg">
          {{ t.studio.title }}<span class="text-primary">.</span>
        </h1>
        <p class="text-[14.5px] leading-relaxed text-fg-muted max-w-xl mt-2">{{ t.studio.subtitle }}</p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all cursor-pointer whitespace-nowrap"
        @click="emit('new-decision')"
      >
        <Plus :size="17" /> {{ t.studio.newDecision }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
      <aside class="border border-border bg-surface rounded-2xl p-3.5 lg:sticky lg:top-[85px] shadow-xs" aria-label="Decision selector">
        <div class="flex items-center gap-2 bg-canvas-subtle border border-border rounded-xl px-3 h-10 text-fg-subtle mb-3">
          <Search :size="16" />
          <input
            :value="searchTerm"
            class="w-full border-0 bg-transparent outline-none text-xs text-fg placeholder:text-fg-subtle"
            :placeholder="t.studio.searchPlaceholder"
            @input="emit('update:searchTerm', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <button
          v-for="decision in filteredDecisions"
          :key="decision.id"
          type="button"
          :class="[
            'w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer mb-1',
            decision.id === activeId
              ? 'bg-primary-soft text-primary font-bold shadow-2xs'
              : 'hover:bg-canvas-subtle text-fg'
          ]"
          @click="emit('select-decision', decision.id)"
        >
          <span
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

        <div v-if="!filteredDecisions.length" class="p-4 text-center text-xs text-fg-muted">
          {{ t.studio.noMatches }}
        </div>

        <button
          type="button"
          class="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-border text-fg-muted hover:text-fg hover:border-primary text-xs font-bold transition-colors cursor-pointer mt-2"
          @click="emit('new-decision')"
        >
          <Plus :size="16" /> {{ t.studio.addDecision }}
        </button>
      </aside>

      <div v-if="activeDecision" class="min-w-0 flex flex-col gap-5">
        <div class="border border-border rounded-2xl bg-surface p-5 md:p-6 flex items-start justify-between gap-4 shadow-xs">
          <div>
            <div class="text-[11px] font-bold tracking-wider uppercase text-primary mb-1">
              {{ interpolate(t.studio.briefEyebrow, { date: formatDate(activeDecision.createdAt).toUpperCase() }) }}
            </div>
            <h2 class="font-display font-extrabold text-2xl tracking-tight text-fg my-1">{{ activeDecision.title }}</h2>
            <p class="text-sm text-fg-muted leading-relaxed m-0 mt-2">{{ activeDecision.context || t.studio.noContext }}</p>
          </div>
          <button
            type="button"
            class="w-9 h-9 rounded-xl border border-border bg-surface text-fg-muted hover:text-danger hover:bg-danger-soft grid place-items-center transition-colors cursor-pointer shrink-0"
            :aria-label="t.studio.deleteAria"
            @click="emit('delete-active')"
          >
            <Trash2 :size="17" />
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-3 p-3 px-4 bg-surface border border-border rounded-xl text-xs md:text-sm text-fg-muted shadow-xs">
          <span class="inline-flex items-center gap-1.5">
            <CalendarDays :size="15" />
            {{ interpolate(t.studio.reviewBy, { date: formatDate(activeDecision.reviewDate) }) }}
          </span>
          <span
            :class="[
              'text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap',
              activeDecision.status === 'exploring' ? 'bg-amber-soft text-amber' : activeDecision.status === 'decided' ? 'bg-primary-soft text-primary' : 'bg-blue-soft text-blue'
            ]"
          >
            {{ activeDecision.status }}
          </span>

          <button type="button" class="inline-flex items-center gap-1 text-primary text-xs font-bold hover:text-primary-dark transition-colors cursor-pointer ml-auto" @click="emit('open-weights')">
            <Scale :size="14" /> {{ t.studio.weightsBtn }}
          </button>

          <button type="button" class="inline-flex items-center gap-1 text-primary text-xs font-bold hover:text-primary-dark transition-colors cursor-pointer" @click="emit('open-journal')">
            {{ t.studio.openJournal }} <ArrowRight :size="14" />
          </button>
        </div>

        <div class="flex items-center justify-between gap-4 mt-2">
          <div>
            <h3 class="font-display font-bold text-lg tracking-tight text-fg m-0">{{ t.studio.explorePathsTitle }}</h3>
            <p class="text-xs text-fg-muted mt-1">{{ t.studio.explorePathsDesc }}</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-fg hover:bg-canvas-subtle transition-colors cursor-pointer shadow-xs"
            @click="showAddPath = !showAddPath"
          >
            <Plus :size="15" /> {{ t.studio.addPath }}
          </button>
        </div>

        <form v-if="showAddPath" class="bg-canvas-subtle border border-border rounded-2xl p-5 my-2 shadow-xs" @submit.prevent="submitAddPath">
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
                  class="w-full text-xs font-bold bg-transparent outline-none text-fg"
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
                    class="w-12 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary"
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
                    class="w-12 h-6 text-center text-xs font-bold border border-border rounded-md bg-surface text-fg outline-none focus:border-primary"
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

        <div class="flex items-center justify-between text-xs text-fg-subtle pt-2">
          <span><ShieldAlert :size="14" class="inline mr-1" /> {{ t.studio.disclaimer }}</span>
          <button type="button" class="inline-flex items-center gap-1 text-primary font-bold hover:text-primary-dark transition-colors cursor-pointer" @click="emit('open-journal')">
            {{ t.studio.openJournal }} <ArrowRight :size="15" />
          </button>
        </div>
      </div>

      <div v-else class="border border-border bg-surface rounded-2xl p-10 text-center flex flex-col items-center shadow-xs">
        <IllustrationFork :width="140" :height="110" />
        <h3 class="font-display font-bold text-lg text-fg mt-4 mb-2">{{ t.studio.emptyPickerTitle }}</h3>
        <p class="text-sm text-fg-muted max-w-md mb-5 leading-relaxed">{{ t.studio.emptyPickerDesc }}</p>
        <button
          class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all cursor-pointer"
          @click="emit('new-decision')"
        >
          <Plus :size="16" /> {{ t.studio.newDecision }}
        </button>
      </div>
    </div>
  </section>
</template>
