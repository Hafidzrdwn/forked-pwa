<script setup lang="ts">
import { computed, ref } from 'vue'
import { BookOpen, GitBranch, ArrowRight, CalendarDays, AlertTriangle } from '../common/AppIcons'
import type { Decision, DecisionStatus } from '../../types'
import { useI18n } from '../../i18n'
import IllustrationFork from '../common/IllustrationFork.vue'

const props = defineProps<{
  decisions: Decision[]
}>()

const emit = defineEmits<{
  (e: 'open-decision', id: string): void
  (e: 'edit-journal', id: string): void
  (e: 'new-decision'): void
}>()

const { t, locale, interpolate } = useI18n()
const filterStatus = ref<'all' | DecisionStatus>('all')

const filteredList = computed(() => {
  if (filterStatus.value === 'all') return props.decisions
  return props.decisions.filter(d => d.status === filterStatus.value)
})

function formatDate(value: string) {
  if (!value) return '-'
  const loc = locale.value === 'id' ? 'id-ID' : 'en-GB'
  return new Intl.DateTimeFormat(loc, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(`${value}T12:00:00`))
}

const isOverdue = (dateStr: string) => {
  if (!dateStr) return false
  return new Date(`${dateStr}T23:59:59`) < new Date()
}
</script>

<template>
  <section class="max-w-310 mx-auto px-4 md:px-8 py-7 md:py-10" aria-label="Decision journal view">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
      <div>
        <h1 class="font-display font-extrabold text-2xl md:text-4xl tracking-tight text-fg">
          {{ t.journalView.title }}<span class="text-primary">.</span>
        </h1>
        <p class="text-sm md:text-[14.5px] leading-relaxed text-fg-muted max-w-xl mt-1.5">{{ t.journalView.subtitle }}</p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        @click="emit('new-decision')"
      >
        <GitBranch :size="16" /> {{ t.journalView.newDecision }}
      </button>
    </div>

    <div class="flex gap-2 flex-wrap mb-5">
      <button
        type="button"
        :class="[
          'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs',
          filterStatus === 'all'
            ? 'bg-primary-soft text-primary border-primary font-bold'
            : 'bg-surface text-fg-muted border-border hover:bg-canvas-subtle hover:text-fg'
        ]"
        @click="filterStatus = 'all'"
      >
        {{ interpolate(t.journalView.filterAll, { n: decisions.length }) }}
      </button>
      <button
        type="button"
        :class="[
          'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs',
          filterStatus === 'exploring'
            ? 'bg-primary-soft text-primary border-primary font-bold'
            : 'bg-surface text-fg-muted border-border hover:bg-canvas-subtle hover:text-fg'
        ]"
        @click="filterStatus = 'exploring'"
      >
        {{ t.journalView.filterExploring }}
      </button>
      <button
        type="button"
        :class="[
          'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs',
          filterStatus === 'decided'
            ? 'bg-primary-soft text-primary border-primary font-bold'
            : 'bg-surface text-fg-muted border-border hover:bg-canvas-subtle hover:text-fg'
        ]"
        @click="filterStatus = 'decided'"
      >
        {{ t.journalView.filterDecided }}
      </button>
      <button
        type="button"
        :class="[
          'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs',
          filterStatus === 'reviewed'
            ? 'bg-primary-soft text-primary border-primary font-bold'
            : 'bg-surface text-fg-muted border-border hover:bg-canvas-subtle hover:text-fg'
        ]"
        @click="filterStatus = 'reviewed'"
      >
        {{ t.journalView.filterReviewed }}
      </button>
    </div>

    <div v-if="filteredList.length" class="grid gap-4">
      <article v-for="decision in filteredList" :key="decision.id" class="bg-surface border border-border rounded-2xl p-4 md:p-6 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-3.5">
          <div class="min-w-0 flex-1">
            <span class="text-[11px] font-semibold text-fg-subtle">
              {{ formatDate(decision.createdAt) }}
            </span>
            <h3 class="font-display font-bold text-base md:text-lg tracking-tight text-fg my-0.5 wrap-break-word">{{ decision.title }}</h3>
          </div>
          <div class="flex items-center gap-2 self-start shrink-0">
            <span v-if="isOverdue(decision.reviewDate) && decision.status !== 'reviewed'" class="inline-flex items-center gap-1 text-danger bg-danger-soft border border-danger/20 rounded-md px-2 py-0.5 text-[11px] font-bold">
              <AlertTriangle :size="12" /> {{ t.journalView.overdueWarning }}
            </span>
            <span
              :class="[
                'text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full whitespace-nowrap',
                (decision.status || '').toLowerCase() === 'exploring' ? 'bg-amber-soft text-amber' : (decision.status || '').toLowerCase() === 'decided' ? 'bg-primary-soft text-primary' : 'bg-blue-soft text-blue'
              ]"
            >
              {{ (decision.status || '').toLowerCase() === 'exploring' ? t.common.statusExploring : (decision.status || '').toLowerCase() === 'decided' ? t.common.statusDecided : t.common.statusReviewed }}
            </span>
          </div>
        </div>

        <p class="text-xs md:text-sm text-fg-muted leading-relaxed m-0">{{ decision.context || t.studio.noContext }}</p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-canvas-subtle rounded-xl my-4 text-xs">
          <div>
            <span class="text-fg-subtle block mb-1 text-[11px]">{{ t.journalView.chosenPath }}</span>
            <strong class="font-bold text-fg text-xs md:text-sm wrap-break-word">
              {{ decision.scenarios.find(s => s.id === decision.selectedScenarioId)?.name || '-' }}
            </strong>
          </div>
          <div>
            <span class="text-fg-subtle block mb-1 text-[11px]">{{ t.journalView.reviewDate }}</span>
            <strong class="font-bold text-fg text-xs md:text-sm">{{ formatDate(decision.reviewDate) }}</strong>
          </div>
          <div>
            <span class="text-fg-subtle block mb-1 text-[11px]">{{ t.journalView.pathsCompared }}</span>
            <strong class="font-bold text-fg text-xs md:text-sm">{{ decision.scenarios.length }}</strong>
          </div>
        </div>

        <div
          v-if="decision.journal.reason || decision.journal.expectedOutcome || decision.journal.actualOutcome || decision.journal.reflection"
          class="p-4 bg-canvas-subtle border-l-4 border-primary rounded-r-xl my-3 text-xs leading-relaxed space-y-1.5"
        >
          <span class="text-[10px] font-bold tracking-wider uppercase text-primary block mb-1">{{ t.journalView.notesHeader }}</span>
          <p v-if="decision.journal.reason" class="m-0 wrap-break-word">
            <strong class="text-fg">{{ t.journalView.why }}:</strong> <span class="text-fg-muted">{{ decision.journal.reason }}</span>
          </p>
          <p v-if="decision.journal.expectedOutcome" class="m-0 wrap-break-word">
            <strong class="text-fg">{{ t.journalView.expected }}:</strong> <span class="text-fg-muted">{{ decision.journal.expectedOutcome }}</span>
          </p>
          <p v-if="decision.journal.actualOutcome" class="m-0 wrap-break-word">
            <strong class="text-fg">{{ t.journalView.actual }}:</strong> <span class="text-fg-muted">{{ decision.journal.actualOutcome }}</span>
          </p>
          <p v-if="decision.journal.reflection" class="m-0 wrap-break-word">
            <strong class="text-fg">{{ t.journalView.reflection }}:</strong> <span class="text-fg-muted">{{ decision.journal.reflection }}</span>
          </p>
        </div>

        <div class="flex items-center justify-end gap-3 mt-4 pt-2 border-t border-border">
          <button class="inline-flex items-center rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-fg hover:bg-canvas-subtle transition-colors cursor-pointer" @click="emit('open-decision', decision.id)">
            {{ t.journalView.openDecision }}
          </button>
          <button class="inline-flex items-center gap-1 text-primary text-xs font-bold hover:text-primary-dark transition-colors cursor-pointer" @click="emit('edit-journal', decision.id)">
            <span>{{ t.journalView.editJournal }}</span> <ArrowRight :size="14" />
          </button>
        </div>
      </article>
    </div>

    <div v-else class="bg-surface border border-border rounded-2xl p-8 md:p-10 text-center flex flex-col items-center shadow-xs">
      <IllustrationFork :width="130" :height="100" />
      <h3 class="font-display font-bold text-lg text-fg mt-4 mb-2">{{ t.journalView.emptyTitle }}</h3>
      <p class="text-sm text-fg-muted max-w-md mb-5 leading-relaxed">{{ t.journalView.emptyDesc }}</p>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all cursor-pointer"
        @click="emit('new-decision')"
      >
        <BookOpen :size="16" /> {{ t.journalView.createDecision }}
      </button>
    </div>
  </section>
</template>
