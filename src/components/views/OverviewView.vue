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
  <section class="max-w-[1240px] mx-auto px-4 md:px-8 py-8 md:py-10" aria-label="Overview">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
      <div>
        <div class="flex items-center gap-1.5 text-primary text-[11px] font-bold tracking-wider uppercase mb-3">
          <Compass :size="15" /> {{ t.overview.heroEyebrow }}
        </div>
        <h1 class="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-fg leading-tight">
          {{ t.overview.heroTitle }}<br /><span class="text-fg-muted">{{ t.overview.heroSpan }}</span>
        </h1>
        <p class="text-[14.5px] leading-relaxed text-fg-muted max-w-xl mt-3">{{ t.overview.heroDesc }}</p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all cursor-pointer whitespace-nowrap"
        @click="emit('new-decision')"
      >
        <Plus :size="17" /> {{ t.overview.newDecision }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-9">
      <article class="bg-surface border border-border rounded-2xl p-5 md:p-6 min-h-[132px] transition-all hover:border-border-hover hover:-translate-y-0.5 shadow-xs">
        <div class="flex items-center justify-between text-fg-muted text-[13px] font-semibold">
          <span>{{ t.overview.statsMapped }}</span>
          <span class="w-9 h-9 grid place-items-center rounded-xl bg-primary-soft text-primary border border-border">
            <GitBranch :size="17" />
          </span>
        </div>
        <div class="font-display font-extrabold text-3xl tracking-tight my-2 text-fg tabular-nums">
          {{ totalDecisions.toString().padStart(2, '0') }}
        </div>
        <div class="text-xs text-fg-subtle">{{ t.overview.statsMappedSub }}</div>
      </article>

      <article class="bg-surface border border-border rounded-2xl p-5 md:p-6 min-h-[132px] transition-all hover:border-border-hover hover:-translate-y-0.5 shadow-xs">
        <div class="flex items-center justify-between text-fg-muted text-[13px] font-semibold">
          <span>{{ t.overview.statsExploring }}</span>
          <span class="w-9 h-9 grid place-items-center rounded-xl bg-amber-soft text-amber border border-border">
            <Activity :size="17" />
          </span>
        </div>
        <div class="font-display font-extrabold text-3xl tracking-tight my-2 text-fg tabular-nums">
          {{ openDecisions.toString().padStart(2, '0') }}
        </div>
        <div class="text-xs text-fg-subtle">{{ t.overview.statsExploringSub }}</div>
      </article>

      <article class="bg-surface border border-border rounded-2xl p-5 md:p-6 min-h-[132px] transition-all hover:border-border-hover hover:-translate-y-0.5 shadow-xs">
        <div class="flex items-center justify-between text-fg-muted text-[13px] font-semibold">
          <span>{{ t.overview.statsReviewed }}</span>
          <span class="w-9 h-9 grid place-items-center rounded-xl bg-blue-soft text-blue border border-border">
            <Check :size="17" />
          </span>
        </div>
        <div class="font-display font-extrabold text-3xl tracking-tight my-2 text-fg tabular-nums">
          {{ reviewedDecisions.toString().padStart(2, '0') }}
        </div>
        <div class="text-xs text-fg-subtle">{{ t.overview.statsReviewedSub }}</div>
      </article>
    </div>

    <div class="flex items-center justify-between gap-4 mb-4">
      <div>
        <h2 class="font-display font-bold text-xl tracking-tight text-fg m-0">{{ t.overview.pickupTitle }}</h2>
        <p class="text-xs text-fg-muted mt-1">{{ t.overview.pickupDesc }}</p>
      </div>
      <button
        class="inline-flex items-center gap-1.5 text-primary text-xs font-bold hover:text-primary-dark transition-colors cursor-pointer"
        @click="emit('navigate', 'decisions')"
      >
        {{ t.overview.allDecisions }} <ArrowRight :size="15" />
      </button>
    </div>

    <div v-if="decisions.length" class="bg-surface border border-border rounded-2xl overflow-hidden divide-y divide-border shadow-xs">
      <button
        v-for="(decision, i) in decisions.slice(0, 3)"
        :key="decision.id"
        class="w-full flex items-center gap-4 p-4 md:p-5 text-left bg-surface hover:bg-canvas-subtle transition-colors cursor-pointer text-fg"
        @click="emit('open-decision', decision.id)"
      >
        <span class="font-display font-bold text-xs text-fg-subtle w-6">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="grid gap-1 min-w-0 flex-1">
          <strong class="text-sm font-bold truncate text-fg">{{ decision.title }}</strong>
          <small class="text-xs text-fg-muted truncate">{{ decision.context || t.studio.noContext }}</small>
        </span>
        <span class="flex items-center gap-1.5 text-fg-muted text-xs whitespace-nowrap">
          <span class="text-primary"><GitBranch :size="14" /></span>
          {{ interpolate(t.overview.pathsCount, { n: decision.scenarios.length }) }}
        </span>
        <span
          v-if="isOverdue(decision.reviewDate) && decision.status !== 'reviewed'"
          class="inline-flex items-center gap-1 text-danger bg-danger-soft border border-danger/20 rounded-md px-2 py-0.5 text-[11px] font-bold"
        >
          <AlertTriangle :size="11" /> {{ t.common.overdue }}
        </span>
        <span
          :class="[
            'text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap',
            decision.status === 'exploring' ? 'bg-amber-soft text-amber' : decision.status === 'decided' ? 'bg-primary-soft text-primary' : 'bg-blue-soft text-blue'
          ]"
        >
          {{ decision.status }}
        </span>
        <ArrowRight class="text-fg-subtle" :size="17" />
      </button>
    </div>

    <div v-else class="bg-surface border border-border rounded-2xl p-10 text-center flex flex-col items-center shadow-xs">
      <IllustrationFork :width="130" :height="100" />
      <h3 class="font-display font-bold text-lg text-fg mt-4 mb-2">{{ t.overview.emptyTitle }}</h3>
      <p class="text-sm text-fg-muted max-w-md mb-5 leading-relaxed">{{ t.overview.emptyDesc }}</p>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all cursor-pointer"
        @click="emit('new-decision')"
      >
        <Plus :size="16" /> {{ t.overview.mapFirstDecision }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4 mt-7">
      <article class="border border-border rounded-2xl p-5 bg-surface-elevated flex gap-4 shadow-xs">
        <div class="w-10 h-10 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
          <CircleHelp :size="19" />
        </div>
        <div>
          <span class="flex items-center gap-1 text-primary text-[11px] font-bold tracking-wider uppercase mb-1.5">
            {{ t.overview.betterQuestionEyebrow }}
          </span>
          <h3 class="font-display font-bold text-base text-fg my-1">{{ t.overview.betterQuestionTitle }}</h3>
          <p class="text-xs leading-relaxed text-fg-muted m-0">{{ t.overview.betterQuestionDesc }}</p>
        </div>
      </article>

      <article class="border border-border rounded-2xl p-5 bg-surface-elevated flex flex-col justify-between shadow-xs">
        <div class="flex items-center justify-between text-primary mb-2">
          <span class="flex items-center gap-1 text-primary text-[11px] font-bold tracking-wider uppercase">
            {{ t.overview.nextReviewEyebrow }}
          </span>
          <CalendarDays :size="17" />
        </div>
        <template v-if="nextReview">
          <div>
            <h3 class="font-display font-bold text-base text-fg my-1">{{ nextReview.title }}</h3>
            <p class="text-xs leading-relaxed text-fg-muted m-0">
              {{ interpolate(t.overview.reviewBy, { date: formatDate(nextReview.reviewDate) }) }}
              <span v-if="isOverdue(nextReview.reviewDate)" class="text-danger font-bold ml-1.5">
                {{ t.overview.nextReviewPastDue }}
              </span>
            </p>
          </div>
          <button
            class="inline-flex items-center gap-1.5 text-primary text-xs font-bold hover:text-primary-dark transition-colors cursor-pointer mt-3.5"
            @click="emit('open-decision', nextReview.id)"
          >
            {{ t.overview.openDecision }} <ArrowRight :size="15" />
          </button>
        </template>
        <template v-else>
          <div>
            <h3 class="font-display font-bold text-base text-fg my-1">{{ t.overview.noNextReviewTitle }}</h3>
            <p class="text-xs leading-relaxed text-fg-muted m-0">{{ t.overview.noNextReviewDesc }}</p>
          </div>
        </template>
      </article>
    </div>

    <div class="flex items-start gap-2.5 text-fg-subtle text-xs leading-relaxed mt-7">
      <ShieldAlert :size="15" class="shrink-0 mt-0.5 text-fg-subtle" />
      <span>{{ t.overview.disclaimer }}</span>
    </div>
  </section>
</template>
