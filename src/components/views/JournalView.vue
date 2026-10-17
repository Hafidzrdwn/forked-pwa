<script setup lang="ts">
import { computed, ref } from 'vue'
import { BookOpen, GitBranch, ArrowRight, CalendarDays, AlertTriangle } from 'lucide-vue-next'
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
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${value}T12:00:00`))
}

const isOverdue = (dateStr: string) => {
  if (!dateStr) return false
  return new Date(`${dateStr}T23:59:59`) < new Date()
}
</script>

<template>
  <section class="page" aria-label="Decision journal view">
    <div class="page-title-row">
      <div>
        <div class="eyebrow">{{ t.journalView.eyebrow }}</div>
        <h1>{{ t.journalView.title }}<span class="title-period">.</span></h1>
        <p class="hero-copy">{{ t.journalView.subtitle }}</p>
      </div>
      <button class="button button-primary" @click="emit('new-decision')">
        <GitBranch :size="16" /> {{ t.journalView.newDecision }}
      </button>
    </div>

    <!-- Filter Pills -->
    <div style="display: flex; gap: 8px; margin-bottom: 20px;">
      <button
        type="button"
        :class="['tab-pill', { active: filterStatus === 'all' }]"
        @click="filterStatus = 'all'"
      >
        {{ interpolate(t.journalView.filterAll, { n: decisions.length }) }}
      </button>
      <button
        type="button"
        :class="['tab-pill', { active: filterStatus === 'exploring' }]"
        @click="filterStatus = 'exploring'"
      >
        {{ t.journalView.filterExploring }}
      </button>
      <button
        type="button"
        :class="['tab-pill', { active: filterStatus === 'decided' }]"
        @click="filterStatus = 'decided'"
      >
        {{ t.journalView.filterDecided }}
      </button>
      <button
        type="button"
        :class="['tab-pill', { active: filterStatus === 'reviewed' }]"
        @click="filterStatus = 'reviewed'"
      >
        {{ t.journalView.filterReviewed }}
      </button>
    </div>

    <div v-if="filteredList.length" class="journal-list">
      <article v-for="decision in filteredList" :key="decision.id" class="journal-card">
        <div class="journal-card-head">
          <div>
            <span class="eyebrow">
              {{ decision.status.toUpperCase() }} <span class="dot-sep">·</span> {{ formatDate(decision.createdAt) }}
            </span>
            <h3>{{ decision.title }}</h3>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span v-if="isOverdue(decision.reviewDate) && decision.status !== 'reviewed'" class="overdue-alert">
              <AlertTriangle :size="12" /> {{ t.journalView.overdueWarning }}
            </span>
            <span :class="['status-tag', decision.status]">{{ decision.status }}</span>
          </div>
        </div>

        <p>{{ decision.context || t.studio.noContext }}</p>

        <div class="journal-snapshot">
          <div>
            <span>{{ t.journalView.chosenPath }}</span>
            <strong>
              {{ decision.scenarios.find(s => s.id === decision.selectedScenarioId)?.name || '-' }}
            </strong>
          </div>
          <div>
            <span>{{ t.journalView.reviewDate }}</span>
            <strong>{{ formatDate(decision.reviewDate) }}</strong>
          </div>
          <div>
            <span>{{ t.journalView.pathsCompared }}</span>
            <strong>{{ decision.scenarios.length }}</strong>
          </div>
        </div>

        <div
          v-if="decision.journal.reason || decision.journal.expectedOutcome || decision.journal.actualOutcome || decision.journal.reflection"
          class="journal-quote"
        >
          <span class="eyebrow">{{ t.journalView.notesHeader }}</span>
          <p v-if="decision.journal.reason">
            <strong>{{ t.journalView.why }}</strong> {{ decision.journal.reason }}
          </p>
          <p v-if="decision.journal.expectedOutcome">
            <strong>{{ t.journalView.expected }}</strong> {{ decision.journal.expectedOutcome }}
          </p>
          <p v-if="decision.journal.actualOutcome">
            <strong>{{ t.journalView.actual }}</strong> {{ decision.journal.actualOutcome }}
          </p>
          <p v-if="decision.journal.reflection">
            <strong>{{ t.journalView.reflection }}</strong> {{ decision.journal.reflection }}
          </p>
        </div>

        <div class="journal-card-actions">
          <button class="button button-secondary button-small" @click="emit('open-decision', decision.id)">
            {{ t.journalView.openDecision }}
          </button>
          <button class="text-button" @click="emit('edit-journal', decision.id)">
            {{ t.journalView.editJournal }} <ArrowRight :size="14" />
          </button>
        </div>
      </article>
    </div>

    <div v-else class="empty-card">
      <IllustrationFork :width="130" :height="100" />
      <h3>{{ t.journalView.emptyTitle }}</h3>
      <p>{{ t.journalView.emptyDesc }}</p>
      <button class="button button-primary" @click="emit('new-decision')">
        <BookOpen :size="16" /> {{ t.journalView.createDecision }}
      </button>
    </div>
  </section>
</template>
