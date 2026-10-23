<script setup lang="ts">
import {
  Plus, GitBranch, Activity, Check, ArrowRight,
  CircleHelp, CalendarDays, ShieldAlert, AlertTriangle
} from '../common/AppIcons'
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
  <section class="max-w-310 mx-auto px-4 md:px-8 py-7 md:py-10" aria-label="Overview">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
      <div>
        <h1 class="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-fg leading-tight">
          {{ t.overview.heroTitle }}<br /><span class="text-fg-muted">{{ t.overview.heroSpan }}</span>
        </h1>
        <p class="text-sm md:text-[14.5px] leading-relaxed text-fg-muted max-w-xl mt-2.5">{{ t.overview.heroDesc }}</p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-sm hover:bg-primary-dark transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        @click="emit('new-decision')"
      >
        <Plus :size="18" stroke-width="2.5" /> {{ t.overview.newDecision }}
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 md:gap-4 mb-8">
      <article class="bg-surface border border-border rounded-2xl p-4 md:p-6 min-h-30 md:min-h-33 transition-all hover:border-border-hover shadow-xs">
        <div class="flex items-center justify-between text-fg-muted text-xs md:text-[13px] font-semibold">
          <span>{{ t.overview.statsMapped }}</span>
          <span class="w-9 h-9 md:w-10 md:h-10 grid place-items-center rounded-xl bg-primary-soft text-primary border border-primary/25 shadow-2xs">
            <GitBranch :size="18" stroke-width="2.4" />
          </span>
        </div>
        <div class="font-display font-extrabold text-2xl md:text-3xl tracking-tight my-1.5 md:my-2 text-fg tabular-nums">
          {{ totalDecisions.toString().padStart(2, '0') }}
        </div>
        <div class="text-[11px] md:text-xs text-fg-subtle">{{ t.overview.statsMappedSub }}</div>
      </article>

      <article class="bg-surface border border-border rounded-2xl p-4 md:p-6 min-h-30 md:min-h-33 transition-all hover:border-border-hover shadow-xs">
        <div class="flex items-center justify-between text-fg-muted text-xs md:text-[13px] font-semibold">
          <span>{{ t.overview.statsExploring }}</span>
          <span class="w-9 h-9 md:w-10 md:h-10 grid place-items-center rounded-xl bg-amber-soft text-amber border border-amber/25 shadow-2xs">
            <Activity :size="18" stroke-width="2.4" />
          </span>
        </div>
        <div class="font-display font-extrabold text-2xl md:text-3xl tracking-tight my-1.5 md:my-2 text-fg tabular-nums">
          {{ openDecisions.toString().padStart(2, '0') }}
        </div>
        <div class="text-[11px] md:text-xs text-fg-subtle">{{ t.overview.statsExploringSub }}</div>
      </article>

      <article class="bg-surface border border-border rounded-2xl p-4 md:p-6 min-h-30 md:min-h-33 transition-all hover:border-border-hover shadow-xs">
        <div class="flex items-center justify-between text-fg-muted text-xs md:text-[13px] font-semibold">
          <span>{{ t.overview.statsReviewed }}</span>
          <span class="w-9 h-9 md:w-10 md:h-10 grid place-items-center rounded-xl bg-blue-soft text-blue border border-blue/25 shadow-2xs">
            <Check :size="18" stroke-width="2.5" />
          </span>
        </div>
        <div class="font-display font-extrabold text-2xl md:text-3xl tracking-tight my-1.5 md:my-2 text-fg tabular-nums">
          {{ reviewedDecisions.toString().padStart(2, '0') }}
        </div>
        <div class="text-[11px] md:text-xs text-fg-subtle">{{ t.overview.statsReviewedSub }}</div>
      </article>
    </div>

    <div class="flex items-center justify-between gap-4 mb-3.5">
      <div>
        <h2 class="font-display font-bold text-lg md:text-xl tracking-tight text-fg m-0">{{ t.overview.pickupTitle }}</h2>
        <p class="text-xs text-fg-muted mt-0.5">{{ t.overview.pickupDesc }}</p>
      </div>
      <button
        class="inline-flex items-center gap-1.5 text-primary text-xs font-bold hover:text-primary-dark transition-colors cursor-pointer shrink-0"
        @click="emit('navigate', 'decisions')"
      >
        <span>{{ t.overview.allDecisions }}</span> <ArrowRight :size="14" />
      </button>
    </div>

    <div v-if="decisions.length" class="bg-surface border border-border rounded-2xl overflow-hidden divide-y divide-border shadow-xs">
      <button
        v-for="(decision, i) in decisions.slice(0, 3)"
        :key="decision.id"
        class="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 md:p-5 text-left bg-surface hover:bg-canvas-subtle transition-colors cursor-pointer text-fg group"
        @click="emit('open-decision', decision.id)"
      >
        <div class="flex items-start gap-3 min-w-0 flex-1">
          <span class="font-display font-bold text-xs text-fg-subtle pt-0.5 shrink-0 w-5 sm:w-6">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="min-w-0 flex-1">
            <strong class="text-sm md:text-[15px] font-bold text-fg block wrap-break-word line-clamp-2 leading-snug group-hover:text-primary transition-colors">{{ decision.title }}</strong>
            <p class="text-xs text-fg-muted mt-1 line-clamp-2 leading-relaxed m-0">{{ decision.context || t.studio.noContext }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t border-border/40 sm:border-0">
          <span class="flex items-center gap-1.5 text-fg-muted text-xs whitespace-nowrap">
            <span class="text-primary"><GitBranch :size="13" /></span>
            {{ interpolate(t.overview.pathsCount, { n: decision.scenarios.length }) }}
          </span>
          <span
            v-if="isOverdue(decision.reviewDate) && decision.status !== 'reviewed'"
            class="inline-flex items-center gap-1 text-danger bg-danger-soft border border-danger/20 rounded-md px-2 py-0.5 text-[11px] font-bold"
          >
            <AlertTriangle :size="11" /> {{ t.common.overdue }}
          </span>
          <div class="flex items-center gap-2.5">
            <span
              :class="[
                'text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full whitespace-nowrap',
                (decision.status || '').toLowerCase() === 'exploring' ? 'bg-amber-soft text-amber' : (decision.status || '').toLowerCase() === 'decided' ? 'bg-primary-soft text-primary' : 'bg-blue-soft text-blue'
              ]"
            >
              {{ (decision.status || '').toLowerCase() === 'exploring' ? t.common.statusExploring : (decision.status || '').toLowerCase() === 'decided' ? t.common.statusDecided : t.common.statusReviewed }}
            </span>
            <ArrowRight class="text-fg-subtle group-hover:text-fg group-hover:translate-x-0.5 transition-all shrink-0" :size="15" />
          </div>
        </div>
      </button>
    </div>

    <div v-else class="bg-surface border border-border rounded-2xl p-8 md:p-10 text-center flex flex-col items-center shadow-xs">
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
      <article class="border border-border rounded-2xl p-4 md:p-5 bg-surface-elevated flex gap-3.5 shadow-xs">
        <div class="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
          <CircleHelp :size="18" />
        </div>
        <div>
          <h3 class="font-display font-bold text-sm md:text-base text-fg m-0">{{ t.overview.betterQuestionTitle }}</h3>
          <p class="text-xs leading-relaxed text-fg-muted m-0 mt-1">{{ t.overview.betterQuestionDesc }}</p>
        </div>
      </article>

      <article class="border border-border rounded-2xl p-4 md:p-5 bg-surface-elevated flex flex-col justify-between shadow-xs">
        <div class="flex items-center justify-between text-primary mb-1.5">
          <span class="text-xs font-bold text-fg">Jadwal Evaluasi Terdekat</span>
          <CalendarDays :size="16" />
        </div>
        <template v-if="nextReview">
          <div>
            <h3 class="font-display font-bold text-sm md:text-base text-fg m-0">{{ nextReview.title }}</h3>
            <p class="text-xs leading-relaxed text-fg-muted m-0 mt-1">
              {{ interpolate(t.overview.reviewBy, { date: formatDate(nextReview.reviewDate) }) }}
              <span v-if="isOverdue(nextReview.reviewDate)" class="text-danger font-bold ml-1.5">
                {{ t.overview.nextReviewPastDue }}
              </span>
            </p>
          </div>
          <button
            class="inline-flex items-center gap-1.5 text-primary text-xs font-bold hover:text-primary-dark transition-colors cursor-pointer mt-3"
            @click="emit('open-decision', nextReview.id)"
          >
            <span>{{ t.overview.openDecision }}</span> <ArrowRight :size="14" />
          </button>
        </template>
        <template v-else>
          <div>
            <h3 class="font-display font-bold text-sm md:text-base text-fg m-0">{{ t.overview.noNextReviewTitle }}</h3>
            <p class="text-xs leading-relaxed text-fg-muted m-0 mt-1">{{ t.overview.noNextReviewDesc }}</p>
          </div>
        </template>
      </article>
    </div>

    <div class="flex items-start gap-2.5 text-fg-subtle text-xs leading-relaxed mt-7">
      <ShieldAlert :size="14" class="shrink-0 mt-0.5 text-fg-subtle" />
      <span>{{ t.overview.disclaimer }}</span>
    </div>
  </section>
</template>
