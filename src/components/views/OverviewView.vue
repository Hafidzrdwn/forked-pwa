<script setup lang="ts">
import {
  Compass, Plus, GitBranch, Activity, Check, ArrowRight,
  CircleHelp, CalendarDays, ShieldAlert, AlertTriangle
} from 'lucide-vue-next'
import type { Decision } from '../../types'
import { useI18n } from '../../i18n'
import IllustrationFork from '../common/IllustrationFork.vue'

const props = defineProps<{
  decisions: Decision[]
  totalDecisions: number
  openDecisions: number
  reviewedDecisions: number
  nextReview: Decision | null
}>()

const emit = defineEmits<{
  (e: 'new-decision'): void
  (e: 'open-decision', id: string): void
  (e: 'navigate', tab: 'decisions' | 'journal'): void
}>()

const { t, locale, interpolate } = useI18n()

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
  <section class="page" aria-label="Overview">
    <div class="hero-row">
      <div>
        <div class="eyebrow"><Compass :size="15" /> {{ t.overview.heroEyebrow }}</div>
        <h1>{{ t.overview.heroTitle }}<br /><span>{{ t.overview.heroSpan }}</span></h1>
        <p class="hero-copy">{{ t.overview.heroDesc }}</p>
      </div>
      <button class="button button-primary hero-button" @click="emit('new-decision')">
        <Plus :size="17" /> {{ t.overview.newDecision }}
      </button>
    </div>

    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-top">
          <span>{{ t.overview.statsMapped }}</span>
          <span class="stat-icon sage"><GitBranch :size="17" /></span>
        </div>
        <div class="stat-number">{{ totalDecisions.toString().padStart(2, '0') }}</div>
        <div class="stat-foot">{{ t.overview.statsMappedSub }}</div>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span>{{ t.overview.statsExploring }}</span>
          <span class="stat-icon amber"><Activity :size="17" /></span>
        </div>
        <div class="stat-number">{{ openDecisions.toString().padStart(2, '0') }}</div>
        <div class="stat-foot">{{ t.overview.statsExploringSub }}</div>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span>{{ t.overview.statsReviewed }}</span>
          <span class="stat-icon blue"><Check :size="17" /></span>
        </div>
        <div class="stat-number">{{ reviewedDecisions.toString().padStart(2, '0') }}</div>
        <div class="stat-foot">{{ t.overview.statsReviewedSub }}</div>
      </article>
    </div>

    <div class="section-heading">
      <div>
        <h2>{{ t.overview.pickupTitle }}</h2>
        <p>{{ t.overview.pickupDesc }}</p>
      </div>
      <button class="text-button" @click="emit('navigate', 'decisions')">
        {{ t.overview.allDecisions }} <ArrowRight :size="15" />
      </button>
    </div>

    <div v-if="decisions.length" class="decision-list">
      <button
        v-for="(decision, i) in decisions.slice(0, 3)"
        :key="decision.id"
        class="decision-row"
        @click="emit('open-decision', decision.id)"
      >
        <span class="decision-index">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="decision-row-main">
          <strong>{{ decision.title }}</strong>
          <small>{{ decision.context || t.studio.noContext }}</small>
        </span>
        <span class="row-meta">
          <span class="mini-branch"><GitBranch :size="14" /></span>
          {{ interpolate(t.overview.pathsCount, { n: decision.scenarios.length }) }}
        </span>
        <span v-if="isOverdue(decision.reviewDate) && decision.status !== 'reviewed'" class="overdue-alert">
          <AlertTriangle :size="11" /> {{ t.common.overdue }}
        </span>
        <span :class="['status-tag', decision.status]">{{ decision.status }}</span>
        <ArrowRight class="row-arrow" :size="17" />
      </button>
    </div>

    <div v-else class="empty-card">
      <IllustrationFork :width="130" :height="100" />
      <h3>{{ t.overview.emptyTitle }}</h3>
      <p>{{ t.overview.emptyDesc }}</p>
      <button class="button button-primary" @click="emit('new-decision')">
        <Plus :size="16" /> {{ t.overview.mapFirstDecision }}
      </button>
    </div>

    <div class="bottom-grid">
      <article class="insight-card">
        <div class="insight-icon"><CircleHelp :size="19" /></div>
        <div>
          <span class="eyebrow">{{ t.overview.betterQuestionEyebrow }}</span>
          <h3>{{ t.overview.betterQuestionTitle }}</h3>
          <p>{{ t.overview.betterQuestionDesc }}</p>
        </div>
      </article>

      <article class="review-card">
        <div class="review-card-top">
          <span class="eyebrow">{{ t.overview.nextReviewEyebrow }}</span>
          <CalendarDays :size="17" />
        </div>
        <template v-if="nextReview">
          <h3>{{ nextReview.title }}</h3>
          <p>
            {{ interpolate(t.overview.reviewBy, { date: formatDate(nextReview.reviewDate) }) }}
            <span v-if="isOverdue(nextReview.reviewDate)" style="color: #b34a3d; font-weight: 700; margin-left: 6px;">
              {{ t.overview.nextReviewPastDue }}
            </span>
          </p>
          <button class="text-button" @click="emit('open-decision', nextReview.id)">
            {{ t.overview.openDecision }} <ArrowRight :size="15" />
          </button>
        </template>
        <template v-else>
          <h3>{{ t.overview.noNextReviewTitle }}</h3>
          <p>{{ t.overview.noNextReviewDesc }}</p>
        </template>
      </article>
    </div>

    <div class="disclaimer">
      <ShieldAlert :size="15" />
      <span>{{ t.overview.disclaimer }}</span>
    </div>
  </section>
</template>
